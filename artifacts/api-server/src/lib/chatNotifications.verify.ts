import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { getPool } from "@workspace/db";
import { queueChatNotification } from "./chatNotifications";

// Exercise mail formatting without sending any real mail.
process.env.SMTP_HOST ||= "test.invalid";
process.env.SMTP_USERNAME ||= "test";
process.env.SMTP_PASSWORD ||= "test";
const { sendNewChatNotification } = await import("./mailer");
const original = nodemailer.createTransport;
let mail: any;
nodemailer.createTransport = (() => ({
  use: () => {},
  sendMail: async (value: any) => { mail = value; return {}; },
})) as unknown as typeof original;
const id = randomUUID();
const pool = getPool();
const client = await pool.connect();
await client.query("BEGIN");
const originalQuery = pool.query;
pool.query = client.query.bind(client) as typeof pool.query;
try {
  await sendNewChatNotification(id, "How much is Nizamy?", "2026-10-04T00:00:00Z");
  assert.equal(mail.to, "sales@nizamy.app");
  assert.match(mail.subject, /New Nizamy chat ticket/);
  assert.ok(mail.text.includes(id));
  assert.ok(mail.text.includes("How much is Nizamy?"));
  await queueChatNotification(id, "How much is Nizamy?");
  await queueChatNotification(id, "Follow-up");
  const result = await getPool().query("SELECT content FROM chat_notifications WHERE public_id=$1", [id]);
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].content, "How much is Nizamy?");
  console.log("PASS: sales recipient, ticket content, one durable alert per conversation");
} finally {
  nodemailer.createTransport = original;
  pool.query = originalQuery;
  await client.query("ROLLBACK");
  client.release();
  await pool.end();
}