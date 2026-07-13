import nodemailer from "nodemailer";
import { logger } from "./logger";

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
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendLeadConfirmation(lead: LeadEmailData): Promise<void> {
  if (!isMailerConfigured()) {
    logger.warn("SMTP not configured; skipping lead confirmation email");
    return;
  }

  const firstName = lead.name.trim().split(/\s+/)[0] ?? lead.name;

  const subject = "أهلاً بك في نظامي — استلمنا طلبك | Welcome to Nizamy";

  const html = `
    <div style="font-family:Arial,Tahoma,sans-serif;font-size:15px;line-height:1.8;color:#1e293b;max-width:560px;margin:0 auto">
      <div dir="rtl" style="text-align:right">
        <h2 style="color:#1d4ed8;margin-bottom:4px">أهلاً ${escapeHtml(firstName)} 👋</h2>
        <p>شكراً لتسجيل اهتمامك بالانضمام إلى <strong>نظامي</strong> كشريك تصميم.</p>
        <p>استلمنا طلبك لشركة <strong>${escapeHtml(lead.company)}</strong> وسيتواصل معك فريقنا قريباً عبر البريد أو الواتساب لإكمال الخطوات التالية.</p>
      </div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
      <div dir="ltr" style="text-align:left">
        <h2 style="color:#1d4ed8;margin-bottom:4px">Hi ${escapeHtml(firstName)} 👋</h2>
        <p>Thank you for your interest in joining <strong>Nizamy</strong> as a Design Partner.</p>
        <p>We received your request for <strong>${escapeHtml(lead.company)}</strong> and our team will reach out shortly via email or WhatsApp with the next steps.</p>
        <p style="color:#64748b;font-size:13px;margin-top:24px">Nizamy — AI-powered HR for Saudi SMEs · www.nizamy.app</p>
      </div>
    </div>
  `;

  const text = [
    `أهلاً ${firstName}،`,
    `شكراً لتسجيل اهتمامك بالانضمام إلى نظامي كشريك تصميم. استلمنا طلبك لشركة ${lead.company} وسيتواصل معك فريقنا قريباً.`,
    "",
    `Hi ${firstName},`,
    `Thank you for your interest in joining Nizamy as a Design Partner. We received your request for ${lead.company} and our team will reach out shortly.`,
    "",
    "Nizamy — www.nizamy.app",
  ].join("\n");

  const transport = createTransport();
  await transport.sendMail({
    from: `Nizamy <${fromAddress}>`,
    to: lead.email,
    subject,
    text,
    html,
  });
}
