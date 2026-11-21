/** Synthetic prompts only: no saved conversations, database writes, or notifications. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openai } from "@workspace/integrations-openai-ai-server";

async function main() {
  const source = readFileSync(new URL("../routes/openai.ts", import.meta.url), "utf8");
  const prompt = source.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)?.[1];
  assert.ok(prompt, "Chat system prompt must exist");
  assert.ok(prompt.includes('starting with "• "'));
  assert.ok(prompt.includes("Arabic and English"));
  assert.ok(!prompt.includes("no headings"));

  if (process.argv.includes("--live")) {
    await Promise.all(["ماذا تقدمون", "What does Nizamy offer?"].map(async (question) => {
      const result = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        max_completion_tokens: 1800,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: question },
        ],
      });
      const reply = result.choices[0]?.message.content ?? "";
      const bullets = reply.match(/^• .+/gm) ?? [];
      assert.ok(bullets.length >= 3 && bullets.length <= 6, "Overview needs 3-6 bullets");
      assert.ok(reply.includes("\n\n"), "Separate introduction and list");
      assert.ok(!/^\s*#|\*\*/m.test(reply), "Avoid unrendered Markdown");
      assert.ok(question.startsWith("What") ? /[a-z]/i.test(reply) : /[\u0621-\u064a]/.test(reply));
    }));
  }
  console.log("Chat formatting checks passed" + (process.argv.includes("--live") ? " (Arabic and English live replies)." : "."));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
