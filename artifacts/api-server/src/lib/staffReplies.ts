import { createHash, randomBytes } from "node:crypto";
import { getPool } from "@workspace/db";
import { sendStaffReplyEmail } from "./mailer";
import { smtpFailureDetails } from "./smtpFailure";
import { isMailerConfigured } from "./mailer";
import { logger } from "./logger";
import {
  canClaimEmail, displayEmailStatus, runDelivery, UNCONFIRMED_MARK, initialEmailStatus, resolveRecipient, sameReplayRequest,
  CHAT_TOKEN_RE, UUID_RE, type EmailStatus, type ReplyInput,
} from "./staffReplyCore";

export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
export const newChatToken = () => randomBytes(32).toString("base64url");
export const tokenDigest = (token: string | undefined | null) => (token && CHAT_TOKEN_RE.test(token) ? sha256(token) : null);

/** Returns the stored digest for a conversation (undefined if absent). Throws if the schema is missing. */
export async function conversationDigest(publicId: string): Promise<string | null | undefined> {
  if (!UUID_RE.test(publicId)) return undefined;
  const { rows } = await getPool().query("SELECT access_token_hash FROM conversations WHERE public_id=$1", [publicId]);
  return rows[0] ? rows[0].access_token_hash : undefined;
}

export type ReplyView = {
  id: number; target: "chat" | "ticket"; body: string; createdAt: string; createdBy: string;
  recipientEmail: string | null; emailStatus: EmailStatus | "unconfirmed"; emailAttempts: number;
  emailSentAt: string | null; messageId: number | null; canRetryEmail: boolean;
};

type Row = {
  id: number; target: "chat" | "ticket"; body: string; created_at: Date; created_by: string;
  recipient_email: string | null; email_status: EmailStatus; email_error: string | null; email_attempts: number;
  email_claimed_at: Date | null; email_sent_at: Date | null; message_id: number | null;
  conversation_id: number | null; ticket_id: number | null; body_hash: string;
};

export function toView(r: Row): ReplyView {
  return {
    id: r.id, target: r.target, body: r.body, createdAt: new Date(r.created_at).toISOString(), createdBy: r.created_by,
    recipientEmail: r.recipient_email, emailStatus: displayEmailStatus(r.email_status, r.email_claimed_at ? new Date(r.email_claimed_at) : null, Date.now(), r.email_error),
    emailAttempts: r.email_attempts, emailSentAt: r.email_sent_at ? new Date(r.email_sent_at).toISOString() : null,
    messageId: r.message_id, canRetryEmail: canClaimEmail(r.email_status, r.email_attempts, r.recipient_email) && r.email_status === "failed",
  };
}

export async function getConversationForStaffByInbox(inboxId: string) {
  const { rows } = await getPool().query(
    `SELECT c.id, c.public_id AS "publicId", c.notify_email AS "notifyEmail"
     FROM support_inbox i JOIN conversations c ON i.source_id = 'conversation:' || c.id
     WHERE i.id = $1 AND i.source = 'chat'`, [inboxId]);
  return rows[0] as { id: number; publicId: string; notifyEmail: string | null } | undefined;
}

export async function getTicketForStaff(ticketId: string) {
  const { rows } = await getPool().query(
    `SELECT t.id, t.email, t.ticket_number AS "ticketNumber", c.id AS "conversationId"
     FROM tickets t LEFT JOIN conversations c ON c.public_id::text = t.conversation_public_id AND c.access_token_hash IS NOT NULL
     WHERE t.id = $1`, [ticketId]);
  return rows[0] as { id: number; email: string; ticketNumber: string; conversationId: number | null } | undefined;
}

export async function listReplies(where: { conversationId?: number; ticketId?: number }): Promise<ReplyView[]> {
  const { rows } = where.ticketId != null
    ? await getPool().query(`SELECT * FROM staff_replies WHERE ticket_id=$1 ORDER BY created_at ASC`, [where.ticketId])
    : await getPool().query(`SELECT * FROM staff_replies WHERE conversation_id=$1 ORDER BY created_at ASC`, [where.conversationId]);
  return rows.map(toView);
}

export class ReplyConflict extends Error {}

/**
 * Persists a staff reply exactly once per idempotency key. The chat message and the
 * reply record are written in one transaction; email delivery happens afterwards so a
 * mail failure never loses the chat reply.
 */
export async function createReply(opts: {
  input: ReplyInput; staff: string; target: "chat" | "ticket";
  conversationId: number | null; ticketId: number | null;
  notifyEmail?: string | null; ticketEmail?: string | null; ticketNumber?: string | null;
}): Promise<{ reply: ReplyView; replayed: boolean }> {
  const { input } = opts;
  const bodyHash = sha256(input.body);
  const targetId = opts.target === "chat" ? opts.conversationId : opts.ticketId;
  const recipient = resolveRecipient(opts.target, { notifyEmail: opts.notifyEmail, ticketEmail: opts.ticketEmail });
  const status = initialEmailStatus(input.sendEmail, recipient);
  const pool = getPool();

  const findExisting = async () => {
    const { rows } = await pool.query(`SELECT * FROM staff_replies WHERE idempotency_key=$1`, [input.idempotencyKey]);
    const r = rows[0] as Row | undefined;
    if (!r) return null;
    const exTarget = r.target === "chat" ? r.conversation_id : r.ticket_id;
    if (!sameReplayRequest({ target: r.target, targetId: exTarget, bodyHash: r.body_hash }, { target: opts.target, targetId, bodyHash })) {
      throw new ReplyConflict("This request key was already used for a different reply");
    }
    return r;
  };

  let row = await findExisting();
  let replayed = !!row;
  if (!row) {
    const db = await pool.connect();
    try {
      await db.query("BEGIN");
      let messageId: number | null = null;
      if (opts.conversationId != null) {
        const m = await db.query(`INSERT INTO messages(conversation_id, role, content) VALUES ($1,'staff',$2) RETURNING id`, [opts.conversationId, input.body]);
        messageId = m.rows[0].id;
      }
      const ins = await db.query(
        `INSERT INTO staff_replies(idempotency_key, body_hash, body, conversation_id, message_id, ticket_id, target, recipient_email, email_status, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [input.idempotencyKey, bodyHash, input.body, opts.conversationId, messageId, opts.ticketId, opts.target,
          status === "not_requested" ? null : recipient, status, opts.staff]);
      await db.query("COMMIT");
      row = ins.rows[0] as Row;
    } catch (err) {
      await db.query("ROLLBACK").catch(() => undefined);
      if ((err as { code?: string }).code === "23505") {
        row = await findExisting();
        replayed = true;
        if (!row) throw err;
      } else throw err;
    } finally { db.release(); }
  }
  const delivered = await deliverEmail(row!.id, opts.ticketNumber ?? null);
  return { reply: delivered ?? toView(row!), replayed };
}

/**
 * Atomically claims a pending/failed reply for sending, then records the truthful outcome.
 * Concurrent callers cannot both claim it, so each attempt produces at most one email.
 */
export async function deliverEmail(replyId: number, ticketNumber: string | null): Promise<ReplyView | null> {
  const pool = getPool();
  const claimed = await pool.query(
    `UPDATE staff_replies SET email_status='sending', email_attempts=email_attempts+1, email_claimed_at=now(), email_error=NULL
     WHERE id=$1 AND email_status IN ('pending','failed') AND recipient_email IS NOT NULL AND email_attempts < 5
     RETURNING *`, [replyId]);
  const r = claimed.rows[0] as Row | undefined;
  if (!r) {
    const cur = await pool.query(`SELECT * FROM staff_replies WHERE id=$1`, [replyId]);
    return cur.rows[0] ? toView(cur.rows[0]) : null;
  }
  const key = String(await keyFor(replyId));
  const outcome = await runDelivery({
    send: () => sendStaffReplyEmail({ to: r.recipient_email!, body: r.body, idempotencyKey: key, ticketNumber }),
    markSent: async () => { await pool.query(`UPDATE staff_replies SET email_status='sent', email_sent_at=now(), email_error=NULL WHERE id=$1 AND email_status='sending'`, [replyId]); },
    markFailed: async (err) => {
      const d = smtpFailureDetails(err, isMailerConfigured());
      await pool.query(`UPDATE staff_replies SET email_status='failed', email_error=$2 WHERE id=$1 AND email_status='sending'`,
        [replyId, d.configured ? `${d.code}${d.responseCode ? ` ${d.responseCode}` : ""}` : "NOT_CONFIGURED"]);
    },
    markUnconfirmed: async () => { await pool.query(`UPDATE staff_replies SET email_error=$2 WHERE id=$1 AND email_status='sending'`, [replyId, UNCONFIRMED_MARK]); },
    log: (event, err) => logger.error({ replyId, smtp: err ? smtpFailureDetails(err, isMailerConfigured()) : undefined }, event),
  });
  try {
    const cur = await pool.query(`SELECT * FROM staff_replies WHERE id=$1`, [replyId]);
    const view = toView(cur.rows[0] ?? r);
    // Truth wins over a stale row: an accepted message is reported as sent even if the write failed.
    if (outcome === "sent_unrecorded") return { ...view, emailStatus: "sent", canRetryEmail: false };
    if (outcome === "unconfirmed") return { ...view, emailStatus: "unconfirmed", canRetryEmail: false };
    return view;
  } catch {
    const status = outcome === "sent" || outcome === "sent_unrecorded" ? "sent" : outcome === "failed" ? "failed" : "unconfirmed";
    return { ...toView(r), emailStatus: status, canRetryEmail: false };
  }
}

async function keyFor(replyId: number): Promise<string> {
  const { rows } = await getPool().query(`SELECT idempotency_key FROM staff_replies WHERE id=$1`, [replyId]);
  return rows[0].idempotency_key;
}

export async function ticketNumberForReply(replyId: number): Promise<string | null> {
  const { rows } = await getPool().query(
    `SELECT t.ticket_number FROM staff_replies r LEFT JOIN tickets t ON t.id = r.ticket_id WHERE r.id=$1`, [replyId]);
  return rows[0]?.ticket_number ?? null;
}
