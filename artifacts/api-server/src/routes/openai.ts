import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody } from "@workspace/api-zod";
import { getDb, getPool, conversations, messages } from "@workspace/db";
import { chatAccess, historyForModel, maskEmail, normalizeEmail } from "../lib/staffReplyCore";
import { newChatToken, sha256, tokenDigest } from "../lib/staffReplies";
import { openai } from "@workspace/integrations-openai-ai-server";
import { buildSupportSystemPrompt, supportKnowledge } from "../lib/supportKnowledge";
import { classifyChatScope } from "../lib/chatScope";
import { queueChatNotification } from "../lib/chatNotifications";
import { sendNewChatNotification } from "../lib/mailer";
import { chatIntake } from "../lib/chatIntake";

const router: IRouter = Router();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RATE_LIMITS = {
  create: { windowMs: 60 * 60 * 1000, max: 10 },
  send: { windowMs: 5 * 60 * 1000, max: 20 },
  poll: { windowMs: 5 * 60 * 1000, max: 240 },
  notify: { windowMs: 60 * 60 * 1000, max: 10 },
};

type Access = { status: "ok" | "denied" | "missing"; id?: number; notifyEmail?: string | null };
/** Verifies the visitor capability token (X-Chat-Token) against the stored digest. */
async function visitorAccess(publicId: string, token: string | undefined): Promise<Access> {
  const presented = tokenDigest(token);
  try {
    const { rows } = await getPool().query(
      "SELECT id, access_token_hash, notify_email FROM conversations WHERE public_id=$1", [publicId]);
    if (!rows[0]) return { status: "missing" };
    return { status: chatAccess(rows[0].access_token_hash, presented), id: rows[0].id, notifyEmail: rows[0].notify_email };
  } catch (err) {
    // Missing columns mean the required migration has not run: fail closed (callers return 503).
    throw err;
  }
}

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

// In-memory fallback store so the chat keeps working when no database is
// configured (e.g. self-hosted deployments without DATABASE_URL).
type MemMessage = { role: "user" | "assistant"; content: string; createdAt: Date };
type MemConversation = { title: string; createdAt: Date; messages: MemMessage[]; tokenHash: string };
function memAccess(conv: MemConversation, token: string | undefined): boolean {
  return chatAccess(conv.tokenHash, tokenDigest(token)) === "ok";
}
const memConversations = new Map<string, MemConversation>();
const MEM_MAX_CONVERSATIONS = 1000;
const MEM_MAX_MESSAGES = 100;

function memCreateConversation(title: string, tokenHash: string): { publicId: string; conv: MemConversation } {
  if (memConversations.size >= MEM_MAX_CONVERSATIONS) {
    const oldestKey = [...memConversations.entries()].sort(
      (a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime(),
    )[0]?.[0];
    if (oldestKey) memConversations.delete(oldestKey);
  }
  const publicId = randomUUID();
  const conv: MemConversation = { title, createdAt: new Date(), messages: [], tokenHash };
  memConversations.set(publicId, conv);
  return { publicId, conv };
}

function memAppend(conv: MemConversation, role: "user" | "assistant", content: string): void {
  conv.messages.push({ role, content, createdAt: new Date() });
  if (conv.messages.length > MEM_MAX_MESSAGES) {
    conv.messages.splice(0, conv.messages.length - MEM_MAX_MESSAGES);
  }
}

export const SYSTEM_PROMPT = `You are the friendly AI assistant for Nizamy HR (نظامي اتش آر), an AI-powered HR system built for Saudi small and medium businesses.

Key facts about Nizamy:
- A complete HR platform: smart leave requests handled by an AI assistant (leave, salary letters, advances, excuses — all in chat), biometric check-in/out (fingerprint, face, or voice), automatic work-hours calculation, attendance from anywhere, employee rewards and incentives, AI-generated reports, and self-onboarding with no training needed.
- Setup is fast: self-serve, ready within minutes, no technical experience required.
- Currently accepting early-access clients. Offer: 3 months free for the first 50 clients (3 أشهر مجانًا لأول 50 عميل). Visitors apply through the contact form on the website.

Current public pricing (per user/employee per month; paid plans billed annually, not month-to-month):
- Free (مجانية): 0 SAR — instant fingerprint or face check-in with no training needed, employee self-service, discount codes, and regular reports.
- Starter (ستارتر): 3 SAR — everything in Free plus face check-in with liveness detection, AI assistant for HR requests, AI-assisted account setup without training or help, AI shift configuration, exclusive discount coupons, smart gift cards and rewards, one-click payroll reports, 6 months of securely stored history, limited-use AI task management, and priority support through tickets.
- Growth (نمو): 7 SAR — everything in Starter, with full payroll management, voice attendance (check-in and check-out), employee performance evaluation, unlimited AI task management replacing Starter's limited use, 12 months of securely stored history replacing Starter's 6 months, free early access to new features, and offline attendance. Recruitment (attract, screen and hire) is coming soon, NOT currently available.
- Starter does NOT include full payroll management, voice attendance, employee evaluation, unlimited AI tasks, 12-month archives, free early access, or offline attendance. Its payroll reports are not full payroll management. Do not invent numerical limits for its limited AI tasks.
- Arabic feature distinctions: Starter — إدارة المهام بالذكاء الاصطناعي باستخدام محدود، أرشفة ٦ أشهر، وتقارير رواتب بنقرة واحدة؛ لا يشمل بصمة الصوت أو الوصول المبكر المجاني. Growth — إدارة الرواتب بالكامل، حضور وانصراف ببصمة الصوت، تقييم أداء الموظفين، مهام ذكاء اصطناعي دون قيود، أرشفة ١٢ شهراً، وصول مبكر مجاني، وحضور دون اتصال. التوظيف قريباً وليس متاحاً حالياً.
- These are the current public offers in both languages. Do not quote the old Standard 3 SAR, Growth 3 SAR, or Pro 8 SAR offers, even if an earlier conversation mentions them; politely clarify the current pricing instead.

Operational savings — the product value:
- Nizamy helps businesses save time and reduce administrative effort through mobile attendance, AI-assisted employee requests, organized records and payroll reports.
- Savings come from operational efficiency, NOT subscription refunds, cashback, guaranteed cash payments or a discount earned through performance. Never promise a 30% subscription return.
- Explain estimated time value using explicit assumptions about time saved and hourly cost. Actual savings depend on usage and the business's starting point. Free users can also benefit from time savings.
- If asked how to get money back, clarify that this is not a money-back offer; it describes the value of reduced manual work.

- There is a return calculator on the website (section "قدّر عائدك / Estimate Your Return") — encourage visitors to try it with their own numbers.

Rules:
- Answer in the same language the visitor writes in (Arabic or English). For Arabic, use a warm, simple Saudi-friendly tone.
- Keep simple answers brief (1-3 short sentences). For broad questions such as "what do you offer?" or answers with three or more distinct details, use a short introduction followed by a scannable list instead of a dense paragraph, even if the visitor did not explicitly request a list.
- For features or benefits, use 3-6 concise bullets, each on its own line starting with "• ". Group related details under a short descriptive label followed by a colon. For instructions that must be followed in order, use numbered steps instead.
- Separate the introduction, list, and any short closing sentence with blank lines. If a longer answer needs sections, use short plain-text labels on their own lines. Include only relevant, supported details; formatting is never a reason to add extra claims, offers, or a sales pitch.
- Apply the same structure in Arabic and English, using labels in the visitor's language. Reply in plain text with real line breaks — no markdown heading markers, asterisks, tables, or HTML. The chat displays plain-text bullets and spacing directly.
- Only answer questions about Nizamy's product and offering, including how to use its HR features. Do not give general HR, labor-law, career or resignation-letter advice. Merely mentioning Nizamy does not make an unrelated request relevant. For mixed requests, answer only the product-related portion and politely decline the rest. Never use historical off-topic replies as permission to answer off-topic.
- If a visitor wants a demo, a contract, exact guaranteed numbers, to contact sales, or to sign up, invite them to say "contact sales" (Arabic: "التواصل مع المبيعات") here so you can collect their name, email and request and automatically open a ticket. Do not send them to the website contact form. Never claim a ticket exists until the application confirms its creation.
- Never invent features, prices, or promises not listed above. Never guarantee a specific return amount. If unsure, say the team can answer in detail after they leave their contact info in the form.
- If the visitor asks a Nizamy question you cannot confidently answer from the available information, do not guess. Briefly explain that the team needs to confirm it and offer follow-up by email or WhatsApp. Also offer follow-up for a problem, complaint, bug, error, or something not working. In either situation append the exact token [[OFFER_TICKET]] at the very end of your reply, at most once. Never mention or explain the token: the website displays a small contact form. Do not claim a request has been submitted until the visitor submits that form. Do not use this offer for unrelated questions or greetings.`;

export function supportResponsePolicy(knowledge: string) {
  return buildSupportSystemPrompt(SYSTEM_PROMPT, knowledge);
}

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

  // Never persist unclassified visitor text as a conversation title.
  const title = "Nizamy chat";

  if (process.env["DATABASE_URL"]) {
    try {
      const db = getDb();
      const [conversation] = await db
        .insert(conversations)
        .values({ title })
        .returning();
      const accessToken = newChatToken();
      try {
        await getPool().query("UPDATE conversations SET access_token_hash=$2 WHERE id=$1", [conversation.id, sha256(accessToken)]);
      } catch (err) {
        req.log.error({ err }, "Chat capability token could not be stored (migration required) — refusing tokenless conversation");
        await db.delete(conversations).where(eq(conversations.id, conversation.id)).catch(() => undefined);
        res.status(503).json({ error: "Chat is temporarily unavailable" });
        return;
      }
      res.status(201).json({
        id: conversation.publicId,
        accessToken,
        title: conversation.title,
        createdAt: conversation.createdAt.toISOString(),
      });
      return;
    } catch (err) {
      req.log.error({ err }, "Database error — falling back to in-memory conversation");
    }
  } else {
    req.log.warn("DATABASE_URL not set — using in-memory conversation");
  }

  const memToken = newChatToken();
  const { publicId, conv } = memCreateConversation(title, sha256(memToken));
  res.status(201).json({
    id: publicId,
    accessToken: memToken,
    title: conv.title,
    createdAt: conv.createdAt.toISOString(),
  });
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  const publicId = req.params.id;
  if (!UUID_RE.test(publicId)) {
    res.status(400).json({ error: "Invalid conversation id" });
    return;
  }

  const memConv = memConversations.get(publicId);
  if (memConv) {
    if (!memAccess(memConv, req.get("X-Chat-Token"))) { res.status(404).json({ error: "Conversation not found" }); return; }
    res.json(
      memConv.messages.map((m, i) => ({
        id: i + 1,
        conversationId: publicId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    );
    return;
  }

  try {
    const access = await visitorAccess(publicId, req.get("X-Chat-Token"));
    if (access.status === "missing" || access.status === "denied") {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
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

  let conversationDbId: number | null = null;
  let history: Array<{ role: string; content: string }>;
  const memConv = memConversations.get(publicId);

  if (memConv) {
    if (!memAccess(memConv, req.get("X-Chat-Token"))) { res.status(404).json({ error: "Conversation not found" }); return; }
    history = memConv.messages.map((m) => ({ role: m.role, content: m.content }));
  } else {
    try {
      const access = await visitorAccess(publicId, req.get("X-Chat-Token"));
      if (access.status === "missing" || access.status === "denied") {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
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

      history = historyForModel(await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationDbId))
        .orderBy(asc(messages.createdAt)));

    } catch (err) {
      req.log.error({ err }, "Database unavailable — chat message not stored");
      res.status(503).json({ error: "Service temporarily unavailable" });
      return;
    }
  }

  try {
    const scope=await classifyChatScope(parsed.data.content,history);
    if(scope!=="related"){
      const arabic=/[\u0600-\u06ff]/.test(parsed.data.content);
      const content=scope==="greeting"
        ? (arabic?"أهلًا! أساعدك في نظامي: المميزات والباقات واستخدام النظام وحل مشكلاته. كيف أقدر أساعدك؟":"Hello! I can help with Nizamy features, plans, using the system and troubleshooting. How can I help?")
        : (arabic?"أقدر أساعدك في نظامي ومميزاته وباقاته وطريقة استخدامه فقط. لا أقدّم استشارات عامة أو صياغة خطابات خارج استخدام النظام. هل عندك سؤال عن نظامي؟":"I can help with Nizamy features, plans, usage and troubleshooting only—not general advice or unrelated writing. What would you like to know about Nizamy?");
      res.setHeader("Content-Type","text/event-stream");
      res.setHeader("Cache-Control","no-cache");
      res.write(`data: ${JSON.stringify({content})}\n\n`);
      res.end(`data: ${JSON.stringify({done:true})}\n\n`);
      return;
    }
    if (memConv && !history.some(m => m.role === "user")) {
      await sendNewChatNotification(publicId, parsed.data.content, new Date().toISOString());
    } else if (!memConv && !history.some(m => m.role === "user")) {
      await queueChatNotification(publicId, parsed.data.content);
    }
    if(memConv)memAppend(memConv,"user",parsed.data.content);
    else if(conversationDbId!==null)await getDb().insert(messages).values({conversationId:conversationDbId,role:"user",content:parsed.data.content});
  } catch(err) {
    req.log.error({err},"Chat relevance check or persistence failed");
    res.status(503).json({error:"Unable to check your message right now. Please try again."});
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const intakeReply = await chatIntake(publicId, history, parsed.data.content);
    if (intakeReply) {
      if (memConv) memAppend(memConv, "assistant", intakeReply);
      else if (conversationDbId !== null) await getDb().insert(messages).values({conversationId: conversationDbId, role:"assistant", content:intakeReply});
      res.write(`data: ${JSON.stringify({content: intakeReply, ticketCreated:/NZ-[A-F0-9]{8}/.test(intakeReply)})}\n\n`);
      res.end(`data: ${JSON.stringify({done:true})}\n\n`);
      return;
    }
    let knowledge = "";
    if (process.env.DATABASE_URL) {
      try { knowledge = await supportKnowledge(parsed.data.content, history.slice(-6).filter(m=>m.role==="user").map(m=>m.content).join(" ")); }
      catch(err) {
        req.log.error({err},"Approved support knowledge unavailable");
        res.end(`data: ${JSON.stringify({error:"Unable to load current approved answers. Please try again.",done:true})}\n\n`);
        return;
      }
    }
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: supportResponsePolicy(knowledge) },
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
      if (memConv) {
        memAppend(memConv, "assistant", fullResponse);
      } else if (conversationDbId !== null) {
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
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Chat completion failed");
    res.write(`data: ${JSON.stringify({ error: "AI service unavailable" })}\n\n`);
    res.end();
  }
});

router.get("/openai/conversations/:id/thread", async (req, res) => {
  const publicId = req.params.id;
  if (!UUID_RE.test(publicId)) { res.status(400).json({ error: "Invalid conversation id" }); return; }
  if (rateLimited(`poll:${req.ip}`, RATE_LIMITS.poll)) { res.status(429).json({ error: "Too many requests" }); return; }
  res.setHeader("Cache-Control", "no-store");
  const memConv = memConversations.get(publicId);
  if (memConv) {
    if (!memAccess(memConv, req.get("X-Chat-Token"))) { res.status(404).json({ error: "Conversation not found" }); return; }
    res.json({ notifyEmail: null, emailAvailable: false, messages: memConv.messages.map((m, i) => ({ id: i + 1, role: m.role, content: m.content, createdAt: m.createdAt.toISOString() })) });
    return;
  }
  try {
    const access = await visitorAccess(publicId, req.get("X-Chat-Token"));
    if (access.status !== "ok") { res.status(404).json({ error: "Conversation not found" }); return; }
    const { rows } = await getPool().query(
      `SELECT id, role, content, created_at AS "createdAt" FROM messages WHERE conversation_id=$1 ORDER BY created_at ASC, id ASC LIMIT 300`, [access.id]);
    res.json({
      notifyEmail: maskEmail(access.notifyEmail ?? null),
      emailAvailable: true,
      messages: rows.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: new Date(m.createdAt).toISOString() })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to load chat thread");
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

router.put("/openai/conversations/:id/notify-email", async (req, res) => {
  const publicId = req.params.id;
  if (!UUID_RE.test(publicId)) { res.status(400).json({ error: "Invalid conversation id" }); return; }
  if (rateLimited(`notify:${req.ip}`, RATE_LIMITS.notify)) { res.status(429).json({ error: "Too many requests" }); return; }
  const email = normalizeEmail(req.body?.email);
  if (!email || req.body?.consent !== true) { res.status(400).json({ error: "A valid email and consent are required" }); return; }
  try {
    const access = await visitorAccess(publicId, req.get("X-Chat-Token"));
    if (access.status !== "ok") { res.status(404).json({ error: "Conversation not found" }); return; }
    await getPool().query("UPDATE conversations SET notify_email=$2, notify_email_set_at=now() WHERE id=$1", [access.id, email]);
    res.json({ notifyEmail: maskEmail(email) });
  } catch (err) {
    req.log.error({ err }, "Failed to save notification email");
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

router.delete("/openai/conversations/:id/notify-email", async (req, res) => {
  const publicId = req.params.id;
  if (!UUID_RE.test(publicId)) { res.status(400).json({ error: "Invalid conversation id" }); return; }
  try {
    const access = await visitorAccess(publicId, req.get("X-Chat-Token"));
    if (access.status !== "ok") { res.status(404).json({ error: "Conversation not found" }); return; }
    await getPool().query("UPDATE conversations SET notify_email=NULL, notify_email_set_at=now() WHERE id=$1", [access.id]);
    res.json({ notifyEmail: null });
  } catch (err) {
    req.log.error({ err }, "Failed to remove notification email");
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
});

export default router;
