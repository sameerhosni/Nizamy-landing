import { getPool } from "@workspace/db";
import { sendNewChatNotification } from "./mailer";
import { logger } from "./logger";
import { acquisitionText } from "./attribution";

export async function queueChatNotification(publicId: string, content: string) {
  await getPool().query(
    "INSERT INTO chat_notifications(public_id,content) VALUES($1,$2) ON CONFLICT DO NOTHING",
    [publicId, content + acquisitionText()],
  );
}

export async function deliverChatNotifications() {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM chat_notifications WHERE sent_at IS NULL ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED",
    );
    for (const row of rows) {
      const contacts = await client.query(
        `SELECT c.notify_email, COALESCE(array_agg(m.content ORDER BY m.created_at) FILTER (WHERE m.role='user'), ARRAY[]::text[]) AS messages
         FROM conversations c LEFT JOIN messages m ON m.conversation_id=c.id
         WHERE c.public_id=$1 GROUP BY c.id`, [row.public_id]);
      const contact = contacts.rows[0];
      await sendNewChatNotification(row.public_id, row.content, new Date(row.created_at).toISOString(), contact?.messages ?? [], contact?.notify_email);
      await client.query("UPDATE chat_notifications SET sent_at=now() WHERE public_id=$1", [row.public_id]);
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error({ err }, "New chat notification delivery failed; will retry");
  } finally { client.release(); }
}

export function startChatNotificationWorker() {
  let busy = false;
  const run = async () => {
    if (busy) return;
    busy = true;
    try { await deliverChatNotifications(); }
    catch (err) { logger.error({err}, "Chat notification worker failed"); }
    finally { busy = false; }
  };
  void run();
  setInterval(() => { void run(); }, 30_000).unref();
}