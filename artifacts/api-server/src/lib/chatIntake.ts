import { randomUUID } from "node:crypto";
import { getDb, ticketsTable } from "@workspace/db";
import { sendTicketEmails } from "./mailer";
import { logger } from "./logger";
import { acquisitionText, recordAcquisition, identifyAcquiredVisitor } from "./attribution";

const prompts = {
  ar: [
    "أكيد، أقدر أفتح لك تذكرة ويتواصل معك فريق نظامي. وش اسمك؟",
    "شكرًا لك. وش بريدك الإلكتروني عشان يتواصل معك الفريق؟",
    "وش اسم منشأتك، وكم عدد الموظفين تقريبًا، ووش التفاصيل اللي تحب تناقشها مع الفريق؟ تقدر تذكر أي تفاصيل إضافية. بعد ردك بسجّل الطلب تلقائيًا.",
  ],
  en: [
    "I can create a ticket so the Nizamy team can follow up. What is your name?",
    "Thank you. What email address should the team contact you at?",
    "What is your company name, roughly how many employees do you have, and what would you like to discuss? Include any other useful details. I’ll create the ticket automatically after your reply.",
  ],
};
type Message = { role: string; content: string };
export async function chatIntake(id: string, history: Message[], content: string): Promise<string | null> {
  const last = history.at(-1);
  let language: "ar" | "en" = /[\u0600-\u06ff]/.test(content) ? "ar" : "en";
  let stage = -1;
  for (const lang of ["ar", "en"] as const) {
    const index = last?.role === "assistant" ? prompts[lang].indexOf(last.content) : -1;
    if (index >= 0) { stage = index; language = lang; }
  }
  if (stage < 0) {
    const contact = /(?:تواصل|اكلم|أكلم|اتصل|أتصل|مبيعات|عرض توضيحي|contact|speak|talk|sales|demo)/i.test(content);
    return contact ? prompts[language][0] : null;
  }
  if (/^(cancel|stop|إلغاء|الغاء|توقف)$/i.test(content.trim())) {
    return language === "ar" ? "تم إلغاء الطلب. كيف أساعدك في نظامي؟" : "Request cancelled. How can I help with Nizamy?";
  }
  if (stage === 0) return content.trim().length >= 2 ? prompts[language][1] : prompts[language][0];
  if (stage === 1) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.trim()) ? prompts[language][2] : prompts[language][1];
  if (content.trim().length < 5) return prompts[language][2];
  const email = history.at(-2)?.content.trim() ?? "";
  const namePrompt = history.map(m => m.role === "assistant" ? m.content : "").lastIndexOf(prompts[language][0]);
  const name = history[namePrompt + 1]?.content ?? null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return prompts[language][1];
  const transcript = [...history, {role: "user", content}];
  const ticketNumber = `NZ-${randomUUID().slice(0, 8).toUpperCase()}`;
  const subject = language === "ar" ? "طلب تواصل من محادثة نظامي" : "Nizamy chat follow-up request";
  await getDb().insert(ticketsTable).values({
    ticketNumber, name, email, subject, summary: content + acquisitionText(),
    transcript: JSON.stringify(transcript), language, conversationPublicId: id,
  });
  await recordAcquisition("automatic_ticket",ticketNumber).catch(err=>logger.error({err},"Ticket attribution could not be stored"));
  await identifyAcquiredVisitor({email,name}).catch(err=>logger.error({err},"Could not link chat visitor"));
  try {
    await sendTicketEmails({ticketNumber, name, email, subject, summary: content, transcript, language, createdAt: new Date().toISOString()});
  } catch (err) { logger.error({err, ticketNumber}, "Automatic ticket saved but email delivery failed"); }
  return language === "ar"
    ? `تم إنشاء تذكرتك ${ticketNumber}. سجّلنا التفاصيل وبريدك ${email} ليتواصل معك فريق نظامي.`
    : `Your ticket ${ticketNumber} has been created. We saved your details and email ${email} for the Nizamy team to follow up.`;
}

export function isIntakeReply(history: Message[]) {
  const last = history.at(-1);
  return last?.role === "assistant" && Object.values(prompts).some(list => list.includes(last.content));
}
