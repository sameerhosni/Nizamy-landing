import { conversationDigest, tokenDigest } from "../lib/staffReplies";
import { ticketLinkDecision } from "../lib/staffReplyCore";
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { CreateTicketBody } from "@workspace/api-zod";
import { getDb, ticketsTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { sendTicketEmails } from "../lib/mailer";
import { ticketScreenshots } from "../lib/ticketScreenshots";
import { acquisitionText } from "../lib/attribution";

const router: IRouter = Router();

const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 5 };
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  bucket.count += 1;
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }
  return bucket.count > RATE_LIMIT.max;
}

function fallbackTicketNumber(): string {
  return `NZ-${Date.now().toString(36).toUpperCase()}`;
}

async function summarize(
  transcript: Array<{ role: string; content: string }>,
  language: "en" | "ar",
): Promise<{ subject: string; summary: string }> {
  const plain = transcript
    .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You summarize customer support chats for Nizamy HR. Given a chat transcript, produce a JSON object with exactly two string fields: "subject" (max 10 words, the visitor's core issue) and "summary" (3-5 sentences describing the visitor's issue, what they tried, and what they need). Write both in ${language === "en" ? "English" : "Arabic"}. Respond with ONLY the JSON object, no markdown.`,
        },
        { role: "user", content: plain.slice(0, 12000) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonText = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    const parsed = JSON.parse(jsonText) as { subject?: string; summary?: string };
    if (parsed.subject && parsed.summary) {
      return { subject: parsed.subject, summary: parsed.summary };
    }
  } catch {
    // fall through to fallback below
  }

  const lastUser = [...transcript].reverse().find((m) => m.role === "user");
  return {
    subject:
      language === "en" ? "Support request from website chat" : "طلب دعم من محادثة الموقع",
    summary: lastUser?.content.slice(0, 500) ?? plain.slice(0, 500),
  };
}

router.post("/ticket", async (req, res) => {
  if (rateLimited(`ticket:${req.ip}`)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const input = parsed.data;
  if ((!input.email && !input.whatsapp) || (input.whatsapp && input.contactConsent !== true)) {
    res.status(400).json({ error: "Provide an email or WhatsApp number and consent to follow-up." });
    return;
  }
  let screenshots: ReturnType<typeof ticketScreenshots>;
  try { screenshots=ticketScreenshots(req.body.screenshots); }
  catch { res.status(400).json({error:"Invalid screenshots: maximum three PNG, JPEG or WebP files, 2MB each"}); return; }
  const language = input.language === "en" ? ("en" as const) : ("ar" as const);
  const transcript = input.transcript.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  if (input.whatsapp) transcript.push({ role: "user", content: `Follow-up contact — WhatsApp: ${input.whatsapp}. Consent to follow up on this request: yes.` });
  const createdAt = new Date();

  // Link to a chat only when the caller proves ownership with the chat capability token.
  // Unverified or absent links never block the ticket; it is stored unlinked.
  let linkedConversationId: string | null = null;
  if (input.conversationId && process.env["DATABASE_URL"]) {
    try {
      const stored = await conversationDigest(String(input.conversationId));
      if (ticketLinkDecision(String(input.conversationId), stored, tokenDigest(req.get("X-Chat-Token"))) === "link") {
        linkedConversationId = String(input.conversationId);
      } else {
        req.log.warn("Ticket conversation link not verified — storing ticket unlinked");
      }
    } catch (err) {
      req.log.error({ err }, "Ticket conversation link could not be verified — storing ticket unlinked");
    }
  }

  const { subject, summary } = await summarize(transcript, language);

  let ticketNumber = fallbackTicketNumber();

  if (process.env["DATABASE_URL"]) {
    try {
      const db = getDb();
      const [row] = await db
        .insert(ticketsTable)
        .values({
          ticketNumber,
          name: input.name ?? null,
          email: input.email ?? "",
          subject,
          summary: summary + acquisitionText(),
          transcript: JSON.stringify(transcript),
          language,
          conversationPublicId: linkedConversationId,
        })
        .returning();
      ticketNumber = `NZ-${100000 + row.id}`;
      await db
        .update(ticketsTable)
        .set({ ticketNumber })
        .where(eq(ticketsTable.id, row.id));
    } catch (err) {
      req.log.error(
        { err, ticketNumber, email: input.email },
        "Database error — ticket NOT stored",
      );
      res.status(503).json({ error: "Unable to save your request. Please try again." });
      return;
    }
  } else {
    req.log.error("DATABASE_URL not set — ticket NOT stored");
    res.status(503).json({ error: "Unable to save your request. Please try again." });
    return;
  }

  sendTicketEmails({
    screenshots,
    ticketNumber,
    subject,
    summary,
    email: input.email ?? "",
    name: input.name ?? null,
    language,
    transcript,
    createdAt: createdAt.toISOString(),
  }).catch((err) => {
    req.log.error({ err, ticketNumber }, "Failed to send ticket emails");
  });

  res.status(201).json({
    ticketNumber,
    subject,
    createdAt: createdAt.toISOString(),
  });
});

export default router;
