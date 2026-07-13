import nodemailer from "nodemailer";
import { logger } from "./logger";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;
const fromAddress = process.env.SMTP_FROM;
const notifyEmail = process.env.LEADS_NOTIFY_EMAIL;

export function isMailerConfigured(): boolean {
  return Boolean(smtpHost && smtpUser && smtpPass && fromAddress && notifyEmail);
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

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  if (!isMailerConfigured()) {
    logger.warn("SMTP not configured; skipping lead notification email");
    return;
  }

  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Email", lead.email],
    ["WhatsApp", lead.whatsapp],
    ["Employees", lead.employees != null ? String(lead.employees) : "—"],
    ["Tier", lead.tier ?? "—"],
    ["Tier price (SAR)", lead.tierPrice != null ? String(lead.tierPrice) : "—"],
    ["Annual subscription (SAR)", lead.subscription != null ? String(lead.subscription) : "—"],
    ["Estimated annual return (SAR)", lead.totalReturn != null ? String(lead.totalReturn) : "—"],
    ["Submitted at", lead.createdAt],
  ];

  const html = `
    <h2>New Design Partner lead — Nizamy</h2>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">${escapeHtml(label)}</td><td style="border:1px solid #e2e8f0">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
  `;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const transport = createTransport();
  await transport.sendMail({
    from: `Nizamy Website <${fromAddress}>`,
    to: notifyEmail,
    replyTo: lead.email,
    subject: `New lead: ${lead.name} — ${lead.company}`,
    text,
    html,
  });
}
