import nodemailer from "nodemailer";
import { logger } from "./logger";
import { renderLeadEmail, resolveTemplateId, type EmailLang } from "./emailTemplates";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;
const fromAddress = process.env.SMTP_FROM;

export function isMailerConfigured(): boolean {
  return Boolean(smtpHost && smtpUser && smtpPass && fromAddress);
}

function createTransport() {
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export interface LeadEmailData {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  employees?: number | null;
  tier?: string | null;
  tierPrice?: number | null;
  subscription?: number | null;
  totalReturn?: number | null;
  createdAt: string;
  language?: EmailLang;
}

export async function sendLeadConfirmation(lead: LeadEmailData): Promise<void> {
  if (!isMailerConfigured()) {
    logger.warn("SMTP not configured; skipping lead confirmation email");
    return;
  }

  const templateId = resolveTemplateId(process.env.ACTIVE_TEMPLATE);
  const trialLink = process.env.TRIAL_LINK || "https://www.nizamy.app";
  const senderName = process.env.SENDER_NAME || "فريق نظامي | Nizamy Team";
  const firstName = lead.name.trim().split(/\s+/)[0] ?? lead.name;
  const lang: EmailLang = lead.language === "en" ? "en" : "ar";

  const { subject, html, text } = renderLeadEmail(templateId, firstName, trialLink, lang);

  const transport = createTransport();
  await transport.sendMail({
    from: `${senderName} <${fromAddress}>`,
    to: lead.email,
    subject,
    text,
    html,
  });

  logger.info(
    { template: templateId, lang, name: lead.name, email: lead.email, company: lead.company },
    "Lead confirmation email sent",
  );
}
