import { Router, type Request, type Response } from "express";
import { getPool } from "@workspace/db";
import { session } from "../lib/supportAuth";
import { parseReplyInput } from "../lib/staffReplyCore";
import {
  createReply, deliverEmail, getConversationForStaffByInbox, getTicketForStaff, listReplies,
  ReplyConflict, ticketNumberForReply,
} from "../lib/staffReplies";

const router = Router();
const ID = /^\d{1,10}$/;

function schemaError(req: Request, res: Response, err: unknown): boolean {
  const code = (err as { code?: string })?.code;
  if (code === "42P01" || code === "42703") {
    req.log.error({ code }, "Staff replies schema missing — run migrations");
    res.status(503).json({ error: "Staff replies are not available until the latest database migration is applied." });
    return true;
  }
  return false;
}

router.get("/inbox/:id/thread", async (req, res) => {
  if (!ID.test(req.params.id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const conv = await getConversationForStaffByInbox(req.params.id);
    if (!conv) { res.status(404).json({ error: "Conversation not found" }); return; }
    const { rows } = await getPool().query(
      `SELECT id, role, content, created_at AS "createdAt" FROM messages WHERE conversation_id=$1 ORDER BY created_at ASC, id ASC LIMIT 500`, [conv.id]);
    const replies = await listReplies({ conversationId: conv.id });
    const byMessage = new Map(replies.filter((r) => r.messageId != null).map((r) => [r.messageId, r]));
    res.json({
      notifyEmail: conv.notifyEmail,
      messages: rows.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: new Date(m.createdAt).toISOString(), reply: byMessage.get(m.id) ?? null })),
    });
  } catch (err) { if (!schemaError(req, res, err)) throw err; }
});

router.post("/inbox/:id/replies", async (req, res) => {
  if (!ID.test(req.params.id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = parseReplyInput(req.body);
  if (!parsed.ok) { res.status(400).json({ error: parsed.error }); return; }
  const staff = await session(req);
  if (!staff) { res.status(401).json({ error: "Staff sign-in required" }); return; }
  try {
    const conv = await getConversationForStaffByInbox(req.params.id);
    if (!conv) { res.status(404).json({ error: "Conversation not found" }); return; }
    const out = await createReply({ input: parsed.value, staff, target: "chat", conversationId: conv.id, ticketId: null, notifyEmail: conv.notifyEmail });
    res.status(out.replayed ? 200 : 201).json(out);
  } catch (err) {
    if (err instanceof ReplyConflict) { res.status(409).json({ error: err.message }); return; }
    if (!schemaError(req, res, err)) throw err;
  }
});

router.get("/tickets/:id/replies", async (req, res) => {
  if (!ID.test(req.params.id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const t = await getTicketForStaff(req.params.id);
    if (!t) { res.status(404).json({ error: "Ticket not found" }); return; }
    res.json({ recipientEmail: t.email || null, linkedChat: t.conversationId != null, replies: await listReplies({ ticketId: t.id }) });
  } catch (err) { if (!schemaError(req, res, err)) throw err; }
});

router.post("/tickets/:id/replies", async (req, res) => {
  if (!ID.test(req.params.id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = parseReplyInput(req.body);
  if (!parsed.ok) { res.status(400).json({ error: parsed.error }); return; }
  const staff = await session(req);
  if (!staff) { res.status(401).json({ error: "Staff sign-in required" }); return; }
  try {
    const t = await getTicketForStaff(req.params.id);
    if (!t) { res.status(404).json({ error: "Ticket not found" }); return; }
    const out = await createReply({ input: parsed.value, staff, target: "ticket", conversationId: t.conversationId, ticketId: t.id, ticketEmail: t.email, ticketNumber: t.ticketNumber });
    res.status(out.replayed ? 200 : 201).json(out);
  } catch (err) {
    if (err instanceof ReplyConflict) { res.status(409).json({ error: err.message }); return; }
    if (!schemaError(req, res, err)) throw err;
  }
});

router.post("/replies/:id/retry-email", async (req, res) => {
  if (!ID.test(req.params.id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const { rows } = await getPool().query(`SELECT email_status FROM staff_replies WHERE id=$1`, [req.params.id]);
    if (!rows[0]) { res.status(404).json({ error: "Reply not found" }); return; }
    if (rows[0].email_status !== "failed") { res.status(409).json({ error: "Only failed emails can be retried" }); return; }
    const id = Number(req.params.id);
    const reply = await deliverEmail(id, await ticketNumberForReply(id));
    res.json({ reply });
  } catch (err) { if (!schemaError(req, res, err)) throw err; }
});

export default router;
