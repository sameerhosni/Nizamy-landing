import nodemailer from "nodemailer";
import { acquisitionText } from "./attribution";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "./logger";
import { appDownloadConfirmation } from "./appDownloadConfirmation";
import { requestContacts } from "./requestContacts";
import {
  renderLeadEmail,
  resolveTemplateId,
  type EmailLang,
} from "./emailTemplates";
import {
  renderClientTicketEmail,
  renderTeamTicketEmail,
  renderTeamLeadEmail,
} from "./ticketEmails";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USERNAME;
const smtpPass = process.env.SMTP_PASSWORD;
const salesAddress = "sales@nizamy.app";
const formNotificationBcc = [
  "149373460@bcc.eu1.hubspot.com",
  "149373460@forward.eu1.hubspot.com",
];

export function isMailerConfigured(): boolean {
  return Boolean(smtpHost && smtpUser && smtpPass);
}

export async function sendNewChatNotification(id: string, message: string, createdAt: string, contactMessages: string[] = [message], savedEmail?: string | null): Promise<void> {
  if (!isMailerConfigured()) throw new Error("SMTP not configured");
  const contacts = requestContacts(contactMessages, savedEmail);
  await createTransport().sendMail({
    from: `Nizamy Support <${salesAddress}>`,
    to: salesAddress,
    replyTo: contacts.replyTo,
    subject: `New Nizamy chat ticket — ${id}`,
    messageId: `<chat-${id}@nizamy.app>`,
    text: `New Nizamy product inquiry\n\nChat reference: ${id}\nReceived: ${createdAt}\n\n${contacts.text}\n\nVisitor message:\n${message}\n\nOpen the staff support workspace to review the conversation. Contact details reflect what was available when this alert was sent.`,
  });
}

export async function sendStaffLoginCode(email: string, code: string): Promise<void> {
  if (!isMailerConfigured()) throw new Error("SMTP not configured");
  await createTransport().sendMail({
    from: `Nizamy Support <${salesAddress}>`,
    to: email,
    subject: "Nizamy staff sign-in code | رمز دخول فريق نظامي",
    text: `Your sign-in code is ${code}. It expires in 10 minutes. Do not share it.\nرمز الدخول: ${code}. صالح لمدة ١٠ دقائق. لا تشاركه مع أحد.`,
  });
}

function createTransport() {
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  transport.use("compile", (mail, done) => {
    const source = acquisitionText();
    if (mail.data.to === salesAddress && source) {
      if (typeof mail.data.text === "string") mail.data.text += source;
      if (typeof mail.data.html === "string") mail.data.html += `<pre>${escapeHtmlText(source)}</pre>`;
    }
    done();
  });
  return transport;
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
  screenshots?: Array<{filename:string;content:Buffer;contentType:string}>;
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
  if (ticket.email) await transport.sendMail({
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
  const contacts = requestContacts(ticket.transcript.filter(m => m.role === "user").map(m => m.content), ticket.email);
  await transport.sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: ticket.email || undefined,
    to: salesAddress,
    bcc: formNotificationBcc,
    subject: team.subject,
    text: `${team.text}\n\n${contacts.text}`,
    html: `${team.html}<pre>${escapeHtmlText(contacts.text)}</pre>`,
    attachments: [...attachments,...(ticket.screenshots??[])],
  });

  logger.info(
    { ticketNumber: ticket.ticketNumber, email: ticket.email },
    "Ticket emails sent (client + team)",
  );
}

function escapeHtmlText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface IncentiveSignupEmailData {
  intent: "existing_hr" | "seeking_hr" | "exploring";
  email: string;
  language: "ar" | "en";
  status: "awarded" | "already_claimed";
  pointsAwarded: number;
  createdAt: string;
}

export async function sendIncentiveSignupNotification(
  signup: IncentiveSignupEmailData,
): Promise<void> {
  if (!isMailerConfigured()) {
    logger.warn("SMTP not configured; skipping incentive signup notification");
    return;
  }

  const senderName = process.env.SENDER_NAME || "نظامي اتش آر | Nizamy HR";
  const intentLabels = {
    existing_hr: "Already uses an HR system",
    seeking_hr: "Looking for a new HR system",
    exploring: "Just exploring",
  } as const;
  const statusLabel =
    signup.status === "awarded" ? "New entitlement awarded" : "Already claimed";
  const rows = [
    ["Intent", intentLabels[signup.intent]],
    ["Email", signup.email],
    ["Language", signup.language === "ar" ? "Arabic" : "English"],
    ["Claim result", statusLabel],
    ["Points entitlement", String(signup.pointsAwarded)],
    ["Submitted at", signup.createdAt],
  ] as const;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtmlText(label)}</th><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtmlText(value)}</td></tr>`,
    )
    .join("");

  const transport = createTransport();
  await transport.sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: signup.email ?? salesAddress,
    to: salesAddress,
    bcc: formNotificationBcc,
    subject: `Landing incentive signup — ${statusLabel}`,
    text,
    html: `<div style="font-family:Arial,sans-serif;color:#0f172a"><h2>Landing incentive signup</h2><table style="border-collapse:collapse;width:100%;max-width:640px">${htmlRows}</table></div>`,
  });

  logger.info(
    { status: signup.status, intent: signup.intent },
    "Incentive signup notification email sent",
  );
}

export interface WebsiteFormEmailData {
  language: "ar" | "en";
  intent?: "existing_hr" | "exploring" | "seeking_hr";
  intents?: ("existing_hr" | "exploring" | "seeking_hr")[];
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  message?: string;
  pageUri: string;
  submittedAt: string;
}

export function renderWebsiteFormNotification(submission: WebsiteFormEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const intentLabels = {
    existing_hr: "Already using HR system",
    exploring: "Just exploring",
    seeking_hr: "Looking for HR system",
  } as const;
  const fullName =
    ([submission.firstname, submission.lastname]
      .filter(Boolean)
      .join(" ")
      .replace(/[\r\n]+/g, " ")
      .trim() || "—");
  const rows = [
    ["Source", "Nizamy landing page"],
    ["Reason", [...new Set(submission.intents ?? (submission.intent ? [submission.intent] : []))].map(reason => intentLabels[reason]).join("; ") || "—"],
    ["Name", fullName],
    ["Email", submission.email],
    ["Phone", submission.phone || "—"],
    ["Message", submission.message || "—"],
    ["Language", submission.language === "ar" ? "Arabic" : "English"],
    ["Page", submission.pageUri],
    ["Submitted at", submission.submittedAt],
  ] as const;
  const heading = "New lead from Nizamy landing page";
  const intro = "A visitor submitted their details on the Nizamy landing page. Reply to this email to contact them.";
  const text = `${heading}\n\n${intro}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}`;
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #e5e7eb;vertical-align:top">${escapeHtmlText(label)}</th><td style="padding:8px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtmlText(value)}</td></tr>`,
    )
    .join("");

  return {
    subject: `${heading} — ${fullName === "—" ? submission.email : fullName}`,
    text,
    html: `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:640px"><h2 style="font-size:22px;color:#0284c7">${heading}</h2><p style="font-size:14px;line-height:1.6">${intro}</p><table style="border-collapse:collapse;width:100%">${htmlRows}</table></div>`,
  };
}

export async function sendWebsiteFormNotification(
  submission: WebsiteFormEmailData,
): Promise<void> {
  if (!isMailerConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const senderName = process.env.SENDER_NAME || "نظامي اتش آر | Nizamy HR";
  const rendered = renderWebsiteFormNotification(submission);

  await createTransport().sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: submission.email,
    to: salesAddress,
    bcc: formNotificationBcc,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  });

  logger.info(
    { language: submission.language },
    "Website form notification email sent",
  );
}

function loadCustomWelcomeTemplate(
  lang: EmailLang,
  resolveAsset: (rel: string) => string | undefined,
): {
  subject: string;
  html: string;
  text: string;
  attachments: { filename: string; path: string; cid: string }[];
} | null {
  const htmlPath = resolveAsset(`assets/email-custom/welcome-${lang}.html`);
  const headerPath = resolveAsset(`assets/email-custom/welcome-${lang}-header.png`);
  const footerPath = resolveAsset(`assets/email-custom/welcome-${lang}-footer.png`);
  const headlinePath = resolveAsset(`assets/email-custom/welcome-${lang}-headline.png`);
  if (!htmlPath || !headerPath || !footerPath) return null;

  const raw = readFileSync(htmlPath, "utf-8");
  const subject =
    /<title>([^<]+)<\/title>/.exec(raw)?.[1]?.trim() ??
    (lang === "ar" ? "حياك في نظامي" : "Welcome to Nizamy");
  return {
    subject,
    html: raw,
    text: "",
    attachments: [
      { filename: "welcome-header.png", path: headerPath, cid: "nz-welcome-header" },
      { filename: "welcome-footer.png", path: footerPath, cid: "nz-welcome-footer" },
      ...(headlinePath
        ? [{ filename: "welcome-headline.png", path: headlinePath, cid: "nz-welcome-headline" }]
        : []),
    ],
  };
}

export async function sendWebsiteWelcome(email: string, lang: "en" | "ar"): Promise<void> {
  if (!isMailerConfigured()) throw new Error("Welcome email delivery is unavailable");
  const { subject, html, text } = appDownloadConfirmation(lang);
  await createTransport().sendMail({
    from: `Nizamy <${salesAddress}>`, replyTo: salesAddress,
    to: email, subject, html, text,
  });
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

  // Always send the same confirmation email, no matter how many times the
  // client submits the form.
  const textImageSpecs: { cid: string; file: string }[] = [
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

  const custom = loadCustomWelcomeTemplate(lang, resolveAsset);

  let subject: string;
  let html: string;
  let text: string;
  let attachments: { filename: string; path: string; cid: string }[] = [];

  if (custom) {
    subject = custom.subject;
    html = custom.html
      .replaceAll("{{first_name}}", escapeHtmlText(firstName))
      .replaceAll("{{cta_url}}", trialLink)
      .replaceAll("{{website_url}}", "https://nizamy.app")
      .replaceAll(
        "{{unsubscribe_url}}",
        "mailto:sales@nizamy.app?subject=Unsubscribe",
      );
    text =
      lang === "ar"
        ? `أهلًا،\n\nشكرًا لاهتمامك بنظامي، ويسعدنا نأكد لك إن طلبك وصلنا.\nحاليًا نعمل على اللمسات الأخيرة استعدادًا للإطلاق، وبمجرد جاهزية الوصول بنتواصل معك مباشرة حتى تكون من أول المستخدمين.\n\nما يحتاج تسوي أي شيء الآن — بنرسل لك تفاصيل الوصول والخطوات القادمة على نفس بريدك.\n\nشكرًا لثقتك،\nفريق نظامي — nizamy.app`
        : `Hi ${firstName},\n\nThanks for your interest in Nizamy — we've received your request.\nWe're putting the final touches on the product, and we'll contact you directly as soon as access is ready so you can be among the first users.\n\nNo action needed right now.\n\nThanks for your trust,\nThe Nizamy team — nizamy.app`;
    attachments = custom.attachments;
  } else {
    ({ subject, html, text } = renderLeadEmail(
      templateId,
      firstName,
      trialLink,
      lang,
      hasLogo,
      hasTextImages,
    ));

    if (hasLogo && logoPath) {
      attachments.push({ filename: "nizamy-logo.png", path: logoPath, cid: "nizamy-logo" });
    }
    if (hasTextImages) {
      for (const img of textImages) {
        attachments.push({ filename: img.file, path: img.path!, cid: img.cid });
      }
    }
  }

  // All welcome-template variants lead to the app, never a waiting list or callback.
  ({ subject, html, text } = appDownloadConfirmation(lang));
  attachments = [];
  const transport = createTransport();
  try {
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
        template: isReturning ? "returning" : custom ? "custom" : templateId,
        lang,
        name: lead.name,
        email: lead.email,
        company: lead.company,
      },
      "Lead confirmation email sent",
    );
  } catch (err) {
    logger.error(
      { err, email: lead.email },
      "Failed to send lead confirmation email; still sending team notification",
    );
  }

  const team = renderTeamLeadEmail({
    name: lead.name,
    company: lead.company,
    email: lead.email,
    whatsapp: lead.whatsapp,
    employees: lead.employees,
    tier: lead.tier,
    tierPrice: lead.tierPrice,
    subscription: lead.subscription,
    totalReturn: lead.totalReturn,
    language: lang,
    isReturning,
    createdAt: lead.createdAt,
    hasLogo,
  });
  await transport.sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: lead.email,
    to: salesAddress,
    subject: team.subject,
    bcc: formNotificationBcc,
    text: team.text,
    html: team.html,
    attachments: hasLogo && logoPath
      ? [{ filename: "nizamy-logo.png", path: logoPath, cid: "nizamy-logo" }]
      : [],
  });

  logger.info(
    { name: lead.name, email: lead.email },
    "Team lead notification email sent",
  );
}

export interface StaffReplyEmailData {
  to: string;
  body: string;
  idempotencyKey: string;
  ticketNumber?: string | null;
}

/** Sends one staff reply. The Message-ID is derived from the idempotency key so a resend is recognisable. */
export async function sendStaffReplyEmail(reply: StaffReplyEmailData): Promise<void> {
  if (!isMailerConfigured()) throw new Error("SMTP not configured");
  const ar = /[\u0600-\u06ff]/.test(reply.body);
  const senderName = process.env.SENDER_NAME || "نظامي اتش آر | Nizamy HR";
  const ref = reply.ticketNumber ? ` ${reply.ticketNumber}` : "";
  const subject = ar ? `رد من فريق نظامي${ref}` : `A reply from the Nizamy team${ref}`;
  const footer = ar
    ? "يمكنك الرد على هذا البريد، أو متابعة المحادثة من نافذة الدردشة على موقع نظامي من نفس المتصفح."
    : "You can reply to this email, or continue the conversation in the chat on the Nizamy website from the same browser.";
  await createTransport().sendMail({
    from: `${senderName} <${salesAddress}>`,
    replyTo: salesAddress,
    to: reply.to,
    subject,
    messageId: `<staff-reply-${reply.idempotencyKey}@nizamy.app>`,
    text: `${reply.body}\n\n—\n${footer}`,
  });
}
