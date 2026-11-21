// Pure, dependency-free rules for staff replies and visitor chat capabilities.
// Kept import-free so they can be unit tested in isolation.

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const CHAT_TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;
export const MAX_REPLY = 4000;
export const MAX_EMAIL_ATTEMPTS = 5;
export const STALE_SENDING_MS = 15 * 60 * 1000;

export type EmailStatus = "not_requested" | "no_address" | "pending" | "sending" | "sent" | "failed";

export type ReplyInput = { body: string; sendEmail: boolean; idempotencyKey: string };

/** Validates a staff reply request body. Returns a normalized input or an error code. */
export function parseReplyInput(raw: unknown): { ok: true; value: ReplyInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid reply" };
  const b = raw as Record<string, unknown>;
  if (typeof b.body !== "string") return { ok: false, error: "Reply text is required" };
  // Strip control characters except newline/tab, normalize line endings.
  const body = b.body.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (!body) return { ok: false, error: "Reply text is required" };
  if (body.length > MAX_REPLY) return { ok: false, error: `Reply must be ${MAX_REPLY} characters or fewer` };
  if (b.sendEmail !== undefined && typeof b.sendEmail !== "boolean") return { ok: false, error: "Invalid email option" };
  if (typeof b.idempotencyKey !== "string" || !UUID_RE.test(b.idempotencyKey)) return { ok: false, error: "Invalid request key" };
  // Recipient must never come from the request; reject attempts to supply one.
  if ("to" in b || "recipient" in b || "email" in b || "recipientEmail" in b) return { ok: false, error: "Recipient cannot be supplied" };
  return { ok: true, value: { body, sendEmail: b.sendEmail === true, idempotencyKey: b.idempotencyKey.toLowerCase() } };
}

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  if (v.length < 6 || v.length > 254) return null;
  if (!/^[^\s@<>()[\]\\,;:"]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(v)) return null;
  return v;
}

export function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain) return null;
  return `${user.slice(0, 1)}${"*".repeat(Math.max(1, Math.min(6, user.length - 1)))}@${domain}`;
}

/**
 * Recipient sourcing: chat replies use only the address the visitor saved with
 * their capability token; ticket replies use only the stored ticket address.
 * Nothing from the staff request body can influence the recipient.
 */
export function resolveRecipient(target: "chat" | "ticket", src: { notifyEmail?: string | null; ticketEmail?: string | null }): string | null {
  const v = target === "chat" ? src.notifyEmail : src.ticketEmail;
  return normalizeEmail(v ?? null);
}

export function initialEmailStatus(sendEmail: boolean, recipient: string | null): EmailStatus {
  if (!sendEmail) return "not_requested";
  return recipient ? "pending" : "no_address";
}

/** Whether a send attempt may claim this reply. Sending/sent are never re-claimed to avoid duplicate mail. */
export function canClaimEmail(status: EmailStatus, attempts: number, recipient: string | null): boolean {
  return !!recipient && (status === "pending" || status === "failed") && attempts < MAX_EMAIL_ATTEMPTS;
}

/** What staff should see: a 'sending' claim that never finished is reported as unconfirmed, not sent. */
export const UNCONFIRMED_MARK = "UNCONFIRMED";
export function displayEmailStatus(status: EmailStatus, claimedAt: Date | null, now = Date.now(), error: string | null = null): EmailStatus | "unconfirmed" {
  if (status === "sending" && error === UNCONFIRMED_MARK) return "unconfirmed";
  if (status === "sending" && claimedAt && now - claimedAt.getTime() > STALE_SENDING_MS) return "unconfirmed";
  return status;
}

const PRE_DATA_COMMANDS = new Set(["CONN", "EHLO", "HELO", "LHLO", "STARTTLS", "AUTH", "AUTH PLAIN", "AUTH LOGIN", "MAIL FROM", "RCPT TO", "API"]);
const PRE_SEND_CODES = new Set(["EAUTH", "EENVELOPE", "ECONFIG", "EDNS", "ETLS", "ENOTCONFIGURED"]);

/**
 * Classifies a send error. "rejected" means the message was definitely not accepted
 * (explicit SMTP 4xx/5xx reply, or a failure before the message body was transmitted)
 * and may be retried. Anything else (e.g. a timeout or socket drop during/after DATA)
 * is "unknown": the server may have accepted it, so it must never be resent automatically.
 */
export function classifySendFailure(err: unknown): "rejected" | "unknown" {
  if (!err || typeof err !== "object") return "unknown";
  const e = err as { code?: unknown; responseCode?: unknown; command?: unknown; message?: unknown };
  if (typeof e.message === "string" && e.message === "SMTP not configured") return "rejected";
  if (typeof e.responseCode === "number" && e.responseCode >= 400 && e.responseCode < 600) return "rejected";
  if (typeof e.code === "string" && PRE_SEND_CODES.has(e.code)) return "rejected";
  const cmd = typeof e.command === "string" ? e.command.toUpperCase().split(":")[0].trim() : "";
  if (cmd && PRE_DATA_COMMANDS.has(cmd)) return "rejected";
  return "unknown";
}

export type DeliveryOutcome = "sent" | "sent_unrecorded" | "failed" | "unconfirmed";

/**
 * Runs one claimed delivery attempt. The SMTP send and the state write are separated:
 * a database failure after a successful send never turns into "failed" (which would
 * allow a resend); the row simply stays in its non-claimable "sending" state.
 */
export async function runDelivery(io: {
  send: () => Promise<void>;
  markSent: () => Promise<void>;
  markFailed: (err: unknown) => Promise<void>;
  markUnconfirmed: () => Promise<void>;
  log: (event: string, err?: unknown) => void;
}): Promise<DeliveryOutcome> {
  let sendError: unknown;
  let accepted = false;
  try {
    await io.send();
    accepted = true;
  } catch (err) {
    sendError = err;
  }
  if (accepted) {
    try { await io.markSent(); return "sent"; } catch (err) {
      io.log("Email accepted by SMTP but sent-state not recorded; left non-retryable", err);
      return "sent_unrecorded";
    }
  }
  if (classifySendFailure(sendError) === "rejected") {
    try { await io.markFailed(sendError); return "failed"; } catch (err) {
      io.log("Email rejected but failed-state not recorded; left non-retryable", err);
      return "unconfirmed";
    }
  }
  io.log("Email outcome unknown; marked unconfirmed and not retryable", sendError);
  try { await io.markUnconfirmed(); } catch (err) { io.log("Unconfirmed-state not recorded", err); }
  return "unconfirmed";
}

/** A replayed idempotency key must refer to the same target and text, otherwise it is a conflict. */
export function sameReplayRequest(
  existing: { target: string; targetId: number | null; bodyHash: string },
  incoming: { target: string; targetId: number | null; bodyHash: string },
): boolean {
  return existing.target === incoming.target && existing.targetId === incoming.targetId && existing.bodyHash === incoming.bodyHash;
}

/** Constant-time-ish compare for hex digests. */
export function digestEquals(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Decide visitor access to a conversation. Conversations created after this feature
 * carry a token digest and require the matching token. Legacy rows without a digest
 * keep their UUID-only behaviour but can never set a notification email.
 */
export function chatAccess(storedDigest: string | null, presentedDigest: string | null): "ok" | "denied" {
  // Conversations without a stored digest (pre-feature rows) are never accessible publicly.
  if (!storedDigest || !presentedDigest) return "denied";
  return digestEquals(storedDigest, presentedDigest) ? "ok" : "denied";
}

/**
 * Whether a public ticket submission may be linked to a chat. Linking requires the
 * conversation's capability token; otherwise the ticket is still accepted, unlinked.
 */
export function ticketLinkDecision(conversationId: string | null | undefined, storedDigest: string | null | undefined, presentedDigest: string | null): "unlinked" | "link" {
  if (!conversationId || !UUID_RE.test(conversationId)) return "unlinked";
  return chatAccess(storedDigest ?? null, presentedDigest) === "ok" ? "link" : "unlinked";
}

/** Map stored roles for the AI model. Staff replies are context from the team, never user text. */
export function historyForModel(rows: Array<{ role: string; content: string }>): Array<{ role: "user" | "assistant"; content: string }> {
  return rows.map((m) =>
    m.role === "staff"
      ? { role: "assistant" as const, content: `[Reply from the Nizamy support team]\n${m.content}` }
      : { role: m.role === "assistant" ? ("assistant" as const) : ("user" as const), content: m.content },
  );
}
