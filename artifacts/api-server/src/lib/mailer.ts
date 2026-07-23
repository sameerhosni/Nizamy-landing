import nodemailer from "nodemailer";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "./logger";
import {
  renderLeadEmail,
  renderReturningLeadEmail,
  resolveTemplateId,
  type EmailLang,
} from "./emailTemplates";
import { renderClientTicketEmail, renderTeamTicketEmail } from "./ticketEmails";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;
const salesAddress = "sales@nizamy.app";

export function isMailerConfigured(): boolean {
  return Boolean(smtpHost && smtpUser && smtpPass);
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

export interface TicketEmailData {
  ticketNumber: string;
  subject: string;
  summary: string;
  email: string;
  name: string | null;
  language: EmailLang;
  transcript: Array<{ role: string; content: string }>;
  createdAt: string;
}

export async function sendTicketEmails(ticket: TicketEmailData): Promise<void> {
  if (!isMailerConfigured()) {
    logger.warn("SMTP not configured; skipping ticket emails");
    return;
  }

  const senderName = process.env.SENDER_NAME || "نظامي اتش آر | Nizamy HR";

  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const logoPath = [
    resolve(moduleDir, "..", "assets/logo-mascot.png"),
    resolve(process.cwd(), "assets/logo-mascot.png"),
  ].find((p) => existsSync(p));
  const hasLogo = logoPath !== undefined;
  const attachments = hasLogo
    ? [{ filename: "nizamy-logo.png", path: logoPath, cid: "nizamy-logo" }]
    : [];

  const transport = createTransport();

  const client = renderClientTicketEmail({
    lang: ticket.language,
    name: ticket.name,
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    summary: ticket.summary,
    hasLogo,
  });
  await transport.sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: salesAddress,
    to: ticket.email,
    subject: client.subject,
    text: client.text,
    html: client.html,
    attachments,
  });

  const team = renderTeamTicketEmail({
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    summary: ticket.summary,
    email: ticket.email,
    name: ticket.name,
    language: ticket.language,
    transcript: ticket.transcript,
    createdAt: ticket.createdAt,
    hasLogo,
  });
  await transport.sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: ticket.email,
    to: salesAddress,
    subject: team.subject,
    text: team.text,
    html: team.html,
    attachments,
  });

  logger.info(
    { ticketNumber: ticket.ticketNumber, email: ticket.email },
    "Ticket emails sent (client + team)",
  );
}

export async function sendLeadConfirmation(
  lead: LeadEmailData,
  isReturning = false,
): Promise<void> {
  if (!isMailerConfigured()) {
    logger.warn("SMTP not configured; skipping lead confirmation email");
    return;
  }

  const templateId = resolveTemplateId(process.env.ACTIVE_TEMPLATE);
  const trialLink = process.env.TRIAL_LINK || "https://nizamy.app";
  const senderName = process.env.SENDER_NAME || "نظامي اتش آر | Nizamy HR";
  const firstName = lead.name.trim().split(/\s+/)[0] ?? lead.name;
  const lang: EmailLang = lead.language === "en" ? "en" : "ar";

  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const resolveAsset = (rel: string): string | undefined =>
    [resolve(moduleDir, "..", rel), resolve(process.cwd(), rel)].find((p) => existsSync(p));

  const logoPath = resolveAsset("assets/logo-mascot.png");
  const hasLogo = logoPath !== undefined;
  if (!hasLogo) {
    logger.warn("Logo asset not found; sending email without embedded logo");
  }

  const textImageSpecs: { cid: string; file: string }[] = isReturning
    ? [
        { cid: "nz-headline", file: `returning-headline-${lang}.png` },
        { cid: "nz-stat", file: `stat-${lang}.png` },
      ]
    : [
        { cid: "nz-headline", file: `welcome-headline-${lang}.png` },
        { cid: "nz-banner", file: `banner-${lang}.png` },
      ];
  const textImages = textImageSpecs.map((spec) => ({
    ...spec,
    path: resolveAsset(`assets/email-text/${spec.file}`),
  }));
  const hasTextImages = textImages.every((img) => img.path !== undefined);
  if (!hasTextImages) {
    logger.warn(
      { missing: textImages.filter((img) => !img.path).map((img) => img.file) },
      "Email text images not found; falling back to HTML text headlines",
    );
  }

  const { subject, html, text } = isReturning
    ? renderReturningLeadEmail(firstName, trialLink, lang, hasLogo, hasTextImages)
    : renderLeadEmail(templateId, firstName, trialLink, lang, hasLogo, hasTextImages);

  const attachments: { filename: string; path: string; cid: string }[] = [];
  if (hasLogo && logoPath) {
    attachments.push({ filename: "nizamy-logo.png", path: logoPath, cid: "nizamy-logo" });
  }
  if (hasTextImages) {
    for (const img of textImages) {
      attachments.push({ filename: img.file, path: img.path!, cid: img.cid });
    }
  }

  const transport = createTransport();
  await transport.sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: salesAddress,
    to: lead.email,
    subject,
    text,
    html,
    attachments,
  });

  logger.info(
    {
      template: isReturning ? "returning" : templateId,
      lang,
      name: lead.name,
      email: lead.email,
      company: lead.company,
    },
    "Lead confirmation email sent",
  );
}
