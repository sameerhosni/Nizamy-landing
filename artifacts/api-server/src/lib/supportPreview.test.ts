import assert from "node:assert/strict";
import express from "express";
import { getPool } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import supportRouter from "../routes/support";
import { validPreviewInput } from "./supportPreview";
import { staffEmail } from "./supportAuth";
import type { SupportPreview } from "@workspace/api-zod";

const input = {
  question: "رصيدي ثابت رغم استخدام نظامي",
  draft: { title: "Points", keywords: "points not increasing", diagnosticQuestions: "", resolution: "Ask which activity earned points. Never promise an immediate credit." },
  caseId: "4",
};
assert.equal(validPreviewInput(input), true);
for (const invalid of [null, {}, { ...input, question: " " }, { ...input, question: "x".repeat(4001) },
  { ...input, caseId: "4 OR true" }, { ...input, draft: { ...input.draft, title: "x".repeat(201) } },
  { ...input, draft: { ...input.draft, resolution: "" } },
  { ...input, draft: { ...input.draft, keywords: "x".repeat(10001) } },
  { ...input, draft: { ...input.draft, diagnosticQuestions: 3 } }]) {
  assert.equal(validPreviewInput(invalid), false);
}

async function main() {
  const pool = getPool();
  const query = pool.query;
  const create = openai.chat.completions.create;
  const queries: string[] = [];
  const prompts: string[] = [];
  let noMatch = false;
  let fail = false;
  pool.query = (async (sql: string) => {
    queries.push(sql);
    assert.match(sql, /^SELECT /, "Preview must never write data");
    if (sql.includes("support_sessions")) return { rows: [{ email: staffEmail }] };
    assert.match(sql, /status='approved'/);
    return { rows: [
      { id: 4, title: "Old version", keywords: "", diagnostic_questions: "", resolution: "OLD VERSION", updated_at: new Date() },
      { id: 5, title: "Approved points guidance", keywords: "", diagnostic_questions: "", resolution: "APPROVED GUIDANCE", updated_at: new Date() },
    ] };
  }) as typeof pool.query;
  openai.chat.completions.create = (async (body: { response_format?: unknown; messages: Array<{ content: string }> }) => {
    if (fail) throw new Error("Provider failure");
    const prompt = JSON.stringify(body);
    prompts.push(prompt);
    assert.doesNotMatch(prompt, /OLD VERSION/);
    if (body.response_format) {
      assert.match(prompt, /preview-draft/);
      return { choices: [{ message: { content: JSON.stringify({ matches: noMatch ? [] : [{ id: "preview-draft", relevance: 3 }, { id: "5", relevance: 2 }] }) } }] };
    }
    assert.match(prompt, /friendly AI assistant for Nizamy/);
    if (!noMatch) {
      assert.match(prompt, /APPROVED GUIDANCE/);
      assert.match(prompt, /Ask which activity/);
    }
    return { choices: [{ message: { content: "ما النشاط الذي توقعت أن تحصل منه على النقاط؟" } }] };
  }) as typeof openai.chat.completions.create;
  const app = express();
  app.use(express.json());
  app.use("/support", supportRouter);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address() as { port: number };
  const send = (body: unknown, cookie = "", header = true) => fetch(`http://127.0.0.1:${address.port}/support/preview`, {
    method: "POST", headers: { "Content-Type": "application/json", ...(header ? { "X-Support-Request": "1" } : {}), Cookie: cookie }, body: JSON.stringify(body),
  });
  try {
    assert.equal((await send(input)).status, 401);
    assert.equal((await send(input, "", false)).status, 403);
    assert.equal(prompts.length, 0);
    const cookie = "nz_staff=" + "a".repeat(64);
    assert.equal((await send({ ...input, question: "" }, cookie)).status, 400);
    const response = await send(input, cookie);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const result = await response.json() as SupportPreview;
    assert.equal(result.preview, true);
    assert.deepEqual(result.matches.map((m: { source: string }) => m.source), ["draft", "approved"]);
    noMatch = true;
    const unmatched = await send({ ...input, question: "How much is Nizamy?" }, cookie);
    assert.deepEqual((await unmatched.json() as SupportPreview).matches, []);
    fail = true;
    assert.equal((await send(input, cookie)).status, 503);
    assert.ok(queries.every(sql => !/INSERT|UPDATE|DELETE/i.test(sql.replace(/updated_at/g, ""))));
    console.log("Preview validation, auth, replacement, matches, no-match, errors and read-only regression checks passed.");
  } finally {
    pool.query = query;
    openai.chat.completions.create = create;
    server.close();
    await pool.end();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
