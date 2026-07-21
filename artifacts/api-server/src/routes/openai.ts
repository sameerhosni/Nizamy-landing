import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody } from "@workspace/api-zod";
import { getDb, conversations, messages } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RATE_LIMITS = {
  create: { windowMs: 60 * 60 * 1000, max: 10 },
  send: { windowMs: 5 * 60 * 1000, max: 20 },
};

const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string, limit: { windowMs: number; max: number }): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return false;
  }
  bucket.count += 1;
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }
  return bucket.count > limit.max;
}

const SYSTEM_PROMPT = `You are the friendly AI assistant for Nizamy HR (نظامي اتش آر), an AI-powered HR system built for Saudi small and medium businesses.

Key facts about Nizamy:
- A complete HR platform: smart leave requests handled by an AI assistant (leave, salary letters, advances, excuses — all in chat), biometric check-in/out (fingerprint, face, or voice), automatic work-hours calculation, attendance from anywhere, employee rewards and incentives, AI-generated reports, and self-onboarding with no training needed.
- Setup is fast: self-serve, ready within minutes, no technical experience required.
- Currently accepting early-access clients. Offer: 3 months free for the first 50 clients (3 أشهر مجانًا لأول 50 عميل). Visitors apply through the contact form on the website.

Pricing (per employee per month, billed as an annual subscription):
- Standard (أساسي): 3 SAR — biometric check-in, self-service, discount codes, regular reports.
- Growth (نمو): 5 SAR — everything in Standard plus AI assistant for HR requests, smart gift cards and rewards, 6 months of history, face check-in with liveness detection, one-click payroll reports, priority support.
- Pro (احترافي): 8 SAR — everything in Growth plus deep AI reports, smart per-employee alerts, a full year of history, voice check-in (privacy-friendly for women), offline mode, wider rewards, unlimited AI task management.

The return model (ROI) — this is Nizamy's main value, learn it well:
- Nizamy gives back up to 30% of the annual subscription value to the customer. The better the team commits and performs on the platform, the bigger the return.
- The return comes from three layers, as percentages of the annual subscription: Performance up to 15%, Rewards up to 10%, Points up to 5% — together up to 30%.
- How to explain it with numbers: annual subscription = employees × price per employee × 12. Example: 100 employees on Growth (5 SAR) = 100 × 5 × 12 = 6,000 SAR per year. Maximum return = 30% = 1,800 SAR, so the effective cost can go as low as 4,200 SAR per year.
- If a visitor gives you their employee count and tier, you may calculate their example the same way. Always present it as an illustrative estimate, not a promise: the actual return depends on the team's real commitment and performance during the year.
- Common question "how do I actually get the money back?": the return is earned through the team's measured performance, engagement with rewards, and points collected on the platform, and it reduces what the customer effectively pays. For the exact mechanics and contract details, invite them to leave their contact info in the form so the team can walk them through it.
- There is a return calculator on the website (section "قدّر عائدك / Estimate Your Return") — encourage visitors to try it with their own numbers.

Rules:
- Answer in the same language the visitor writes in (Arabic or English). For Arabic, use a warm, simple Saudi-friendly tone.
- Be concise (2-4 short sentences unless more detail is asked for).
- Reply in plain text only — no markdown, no asterisks, no headings.
- Only answer questions related to Nizamy, HR, and the offering. If asked about something unrelated, politely steer the conversation back to Nizamy.
- If a visitor wants a demo, a contract, exact guaranteed numbers, or to sign up, encourage them to fill the contact form on the page — the team replies with full details.
- Never invent features, prices, or promises not listed above. Never guarantee a specific return amount. If unsure, say the team can answer in detail after they leave their contact info in the form.`;

router.post("/openai/conversations", async (req, res) => {
  if (rateLimited(`create:${req.ip}`, RATE_LIMITS.create)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const db = getDb();
    const [conversation] = await db
      .insert(conversations)
      .values({ title: parsed.data.title.slice(0, 200) })
      .returning();
    res.status(201).json({
      id: conversation.publicId,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  const publicId = req.params.id;
  if (!UUID_RE.test(publicId)) {
    res.status(400).json({ error: "Invalid conversation id" });
    return;
  }

  try {
    const db = getDb();
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.publicId, publicId))
      .limit(1);

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversation.id))
      .orderBy(asc(messages.createdAt));

    res.json(
      rows.map((m) => ({
        id: m.id,
        conversationId: conversation.publicId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  const publicId = req.params.id;
  if (!UUID_RE.test(publicId)) {
    res.status(400).json({ error: "Invalid conversation id" });
    return;
  }

  if (rateLimited(`send:${req.ip}`, RATE_LIMITS.send)) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  const parsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  let conversationDbId: number;
  let history: Array<{ role: string; content: string }>;

  try {
    const db = getDb();

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.publicId, publicId))
      .limit(1);

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    conversationDbId = conversation.id;

    history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationDbId))
      .orderBy(asc(messages.createdAt));

    await db.insert(messages).values({
      conversationId: conversationDbId,
      role: "user",
      content: parsed.data.content,
    });
  } catch (err) {
    req.log.error({ err }, "Database unavailable — chat message not stored");
    res.status(503).json({ error: "Service temporarily unavailable" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-20).map((m) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
        { role: "user", content: parsed.data.content },
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    if (fullResponse) {
      try {
        const db = getDb();
        await db.insert(messages).values({
          conversationId: conversationDbId,
          role: "assistant",
          content: fullResponse,
        });
      } catch (err) {
        req.log.error({ err }, "Failed to persist assistant message");
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Chat completion failed");
    res.write(`data: ${JSON.stringify({ error: "AI service unavailable" })}\n\n`);
    res.end();
  }
});

export default router;
