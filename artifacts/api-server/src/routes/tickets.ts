import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { CreateTicketBody } from "@workspace/api-zod";
import { getDb, ticketsTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { sendTicketEmails } from "../lib/mailer";

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
  const language = input.language === "en" ? ("en" as const) : ("ar" as const);
  const transcript = input.transcript.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const createdAt = new Date();

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
          email: input.email,
          subject,
          summary,
          transcript: JSON.stringify(transcript),
          language,
          conversationPublicId: input.conversationId ?? null,
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
        "Database error — ticket NOT stored, continuing with emails only",
      );
    }
  } else {
    req.log.warn(
      { ticketNumber, email: input.email, subject, summary },
      "DATABASE_URL not set — ticket NOT stored, continuing with emails only",
    );
  }

  sendTicketEmails({
    ticketNumber,
    subject,
    summary,
    email: input.email,
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
