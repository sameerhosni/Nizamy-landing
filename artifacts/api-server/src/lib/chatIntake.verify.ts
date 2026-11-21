import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { getPool } from "@workspace/db";
import { randomUUID } from "node:crypto";
import { chatIntake, isIntakeReply } from "./chatIntake";

const pool = getPool(), client = await pool.connect();
await client.query("BEGIN");
const query = pool.query;
pool.query = client.query.bind(client) as typeof pool.query;
const transport = nodemailer.createTransport;
nodemailer.createTransport = (() => ({ use: () => {}, sendMail: async () => ({}) })) as unknown as typeof transport;
try {
  for (const language of ["ar", "en"]) {
    const id = randomUUID();
    const history: Array<{role:string;content:string}> = [];
    async function turn(content: string) {
      const reply = await chatIntake(id, history, content);
      assert.ok(reply);
      history.push({role:"user",content}, {role:"assistant",content:reply});
      return reply;
    }
    await turn(language === "ar" ? "كيف أتواصل مع المبيعات" : "How can I contact sales?");
    assert.ok(isIntakeReply(history));
    await turn("Test Visitor");
    const invalid = await turn("not-an-email");
    assert.match(invalid, /email|بريد/);
    await turn("test@example.invalid");
    const reply = await turn("Test company, 25 employees, interested in a Nizamy demo");
    assert.match(reply, /NZ-/);
    const result = await client.query("SELECT email,name FROM tickets WHERE conversation_public_id=$1", [id]);
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].email, "test@example.invalid");
    assert.equal(result.rows[0].name, "Test Visitor");
    assert.equal(await chatIntake(id,history,"Thanks"), null);
  }
  console.log("PASS: Arabic/English intake, invalid email retry, automatic saved ticket, no duplicate on thanks");
} finally {
  pool.query = query;
  nodemailer.createTransport = transport;
  await client.query("ROLLBACK");
  client.release();
  await pool.end();
}
