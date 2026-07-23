export type TicketLang = "en" | "ar";

const FONT =
  "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif";
const BLUE = "#2563EB";
const NAVY = "#0F172A";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(dir: "rtl" | "ltr", inner: string, hasLogo: boolean): string {
  const logo = hasLogo
    ? `<tr><td align="center" style="padding:28px 0 8px;"><img src="cid:nizamy-logo" alt="Nizamy HR" width="72" style="display:block;border:0;"/></td></tr>`
    : "";
  return `<!DOCTYPE html><html dir="${dir}"><body style="margin:0;padding:0;background-color:#F1F5F9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
${logo}
${inner}
<tr><td style="padding:20px 32px 28px;border-top:1px solid #E2E8F0;">
<p style="margin:0;font-family:${FONT};font-size:12px;color:#94A3B8;text-align:center;">Nizamy HR — نظامي اتش آر · nizamy.app</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function renderClientTicketEmail(params: {
  lang: TicketLang;
  name: string | null;
  ticketNumber: string;
  subject: string;
  summary: string;
  hasLogo: boolean;
}): { subject: string; html: string; text: string } {
  const { lang, name, ticketNumber, subject, summary, hasLogo } = params;
  const safeName = name ? escapeHtml(name.trim().split(/\s+/)[0] ?? "") : "";

  if (lang === "en") {
    const emailSubject = `Your support ticket ${ticketNumber} — Nizamy HR`;
    const inner = `
<tr><td style="padding:20px 32px 0;">
<h1 style="margin:0;font-family:${FONT};font-size:22px;line-height:1.4;color:${NAVY};text-align:left;">${safeName ? `Hi ${safeName}, we` : "We"} received your request</h1>
</td></tr>
<tr><td style="padding:16px 32px 0;">
<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.7;color:#334155;text-align:left;">Your support ticket has been created. Our team will review it and get back to you at this email address.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFF6FF;border-radius:12px;">
<tr><td style="padding:18px 22px;">
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;text-align:left;">Ticket number</p>
<p style="margin:0 0 14px;font-family:${FONT};font-size:24px;font-weight:bold;color:${BLUE};text-align:left;">${escapeHtml(ticketNumber)}</p>
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;text-align:left;">Topic</p>
<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;font-weight:bold;color:${NAVY};text-align:left;">${escapeHtml(subject)}</p>
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;text-align:left;">Summary</p>
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:#334155;text-align:left;">${escapeHtml(summary)}</p>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:20px 32px 26px;">
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:#334155;text-align:left;">Please keep the ticket number for reference. You can reply to this email to add more details.</p>
</td></tr>`;
    const text = `${safeName ? `Hi ${safeName},` : "Hello,"}\n\nYour support ticket has been created.\n\nTicket number: ${ticketNumber}\nTopic: ${subject}\nSummary: ${summary}\n\nOur team will get back to you at this email address. You can reply to this email to add more details.\n\nNizamy HR — nizamy.app`;
    return { subject: emailSubject, html: shell("ltr", inner, hasLogo), text };
  }

  const emailSubject = `تذكرة الدعم ${ticketNumber} — نظامي اتش آر`;
  const inner = `
<tr><td style="padding:20px 32px 0;">
<h1 style="margin:0;font-family:${FONT};font-size:22px;line-height:1.5;color:${NAVY};text-align:right;">${safeName ? `أهلًا ${safeName}، ` : ""}استلمنا طلبك</h1>
</td></tr>
<tr><td style="padding:16px 32px 0;">
<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.8;color:#334155;text-align:right;">تم إنشاء تذكرة الدعم الخاصة بك، وسيراجعها فريقنا ويتواصل معك على هذا البريد الإلكتروني.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFF6FF;border-radius:12px;">
<tr><td style="padding:18px 22px;">
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;text-align:right;">رقم التذكرة</p>
<p style="margin:0 0 14px;font-family:${FONT};font-size:24px;font-weight:bold;color:${BLUE};text-align:right;" dir="ltr">${escapeHtml(ticketNumber)}</p>
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;text-align:right;">الموضوع</p>
<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;font-weight:bold;color:${NAVY};text-align:right;">${escapeHtml(subject)}</p>
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;text-align:right;">الملخص</p>
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.8;color:#334155;text-align:right;">${escapeHtml(summary)}</p>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:20px 32px 26px;">
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.8;color:#334155;text-align:right;">احتفظ برقم التذكرة للمراجعة، ويمكنك الرد على هذا البريد لإضافة أي تفاصيل.</p>
</td></tr>`;
  const text = `${safeName ? `أهلًا ${safeName}،` : "أهلًا،"}\n\nتم إنشاء تذكرة الدعم الخاصة بك.\n\nرقم التذكرة: ${ticketNumber}\nالموضوع: ${subject}\nالملخص: ${summary}\n\nسيتواصل معك فريقنا على هذا البريد الإلكتروني. يمكنك الرد على هذا البريد لإضافة أي تفاصيل.\n\nنظامي اتش آر — nizamy.app`;
  return { subject: emailSubject, html: shell("rtl", inner, hasLogo), text };
}

export function renderTeamTicketEmail(params: {
  ticketNumber: string;
  subject: string;
  summary: string;
  email: string;
  name: string | null;
  language: string;
  transcript: Array<{ role: string; content: string }>;
  createdAt: string;
  hasLogo: boolean;
}): { subject: string; html: string; text: string } {
  const {
    ticketNumber,
    subject,
    summary,
    email,
    name,
    language,
    transcript,
    createdAt,
    hasLogo,
  } = params;

  const transcriptHtml = transcript
    .map((m) => {
      const who = m.role === "user" ? "Visitor" : "Shahad";
      const bg = m.role === "user" ? "#EFF6FF" : "#F8FAFC";
      return `<tr><td style="padding:4px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bg};border-radius:8px;"><tr><td style="padding:10px 14px;"><p style="margin:0 0 2px;font-family:${FONT};font-size:11px;font-weight:bold;color:#64748B;">${who}</p><p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.6;color:${NAVY};white-space:pre-wrap;">${escapeHtml(m.content)}</p></td></tr></table></td></tr>`;
    })
    .join("");

  const row = (label: string, value: string, dirAttr = "") =>
    `<tr><td style="padding:3px 12px 3px 0;font-family:${FONT};font-size:13px;color:#64748B;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:3px 0;font-family:${FONT};font-size:13px;color:${NAVY};font-weight:bold;"${dirAttr}>${value}</td></tr>`;

  const inner = `
<tr><td style="padding:20px 32px 0;">
<h1 style="margin:0;font-family:${FONT};font-size:20px;line-height:1.4;color:${NAVY};">New support ticket ${escapeHtml(ticketNumber)}</h1>
</td></tr>
<tr><td style="padding:16px 32px 0;">
<table role="presentation" cellpadding="0" cellspacing="0">
${row("Ticket", escapeHtml(ticketNumber))}
${row("Topic", escapeHtml(subject))}
${row("Visitor name", escapeHtml(name || "—"))}
${row("Visitor email", `<a href="mailto:${escapeHtml(email)}" style="color:${BLUE};">${escapeHtml(email)}</a>`)}
${row("Language", language === "en" ? "English" : "Arabic")}
${row("Created", escapeHtml(createdAt))}
</table>
</td></tr>
<tr><td style="padding:18px 32px 0;">
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;">AI summary of the issue</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FEF9C3;border-radius:10px;"><tr><td style="padding:14px 18px;">
<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:${NAVY};">${escapeHtml(summary)}</p>
</td></tr></table>
</td></tr>
<tr><td style="padding:18px 32px 26px;">
<p style="margin:0 0 6px;font-family:${FONT};font-size:13px;color:#64748B;">Full chat transcript</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${transcriptHtml}</table>
</td></tr>`;

  const textTranscript = transcript
    .map((m) => `[${m.role === "user" ? "Visitor" : "Shahad"}] ${m.content}`)
    .join("\n");
  const text = `New support ticket ${ticketNumber}\n\nTopic: ${subject}\nVisitor: ${name || "—"} <${email}>\nLanguage: ${language}\nCreated: ${createdAt}\n\nSummary:\n${summary}\n\nTranscript:\n${textTranscript}`;

  return {
    subject: `[Ticket ${ticketNumber}] ${subject}`,
    html: shell("ltr", inner, hasLogo),
    text,
  };
}
