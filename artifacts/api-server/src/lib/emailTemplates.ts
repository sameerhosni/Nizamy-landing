export type TemplateId = "01" | "02" | "03";
export type EmailLang = "en" | "ar";

type Block =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "vision"; text: string }
  | { type: "sign"; text: string };

interface LangContent {
  greeting: string;
  blocks: Block[];
}

interface TemplateContent {
  subjectAr: string;
  subjectEn: string;
  ctaLabel: string;
  ar: LangContent;
  en: LangContent;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const templates: Record<TemplateId, TemplateContent> = {
  "01": {
    subjectAr: "أهلًا بك في نظامي اتش آر — نظام الموارد البشرية اللي يرجّع لك جزءًا من تكلفته السنوية",
    subjectEn: "Welcome to Nizamy HR — the HR system that returns part of its annual cost back to you",
    ctaLabel: "ابدأ تجربتك المجانية | Start Your Free Trial",
    ar: {
      greeting: "السلام عليكم {{name}}،",
      blocks: [
        { type: "p", text: "وصل طلبك — ويسعدنا إنك اخترت نظامي اتش آر." },
        {
          type: "callout",
          text: "خلّنا نكون صريحين معك من البداية: كل ريال تدفعه على إدارة الموظفين — المفروض يرجع لك بشكل أو بآخر.",
        },
        {
          type: "p",
          text: "الشركات اللي عندها 50 موظف وراتب شهري بـ 150,000 ريال — تخسر ما يقارب 18,000 ريال سنويًا من الإنتاجية الضايعة، دوران الموظفين، والمتابعة اليدوية. نظامي اتش آر مصمّم يرجّع لك هذا الرقم.",
        },
        { type: "p", text: "كيف؟" },
        {
          type: "bullets",
          items: [
            "فريقك يحضر ويشتغل بشوق — لأن الالتزام يساوي نقاط ومكافآت حقيقية.",
            "أنت توقف المتابعة اليدوية — النظام يتابع بدلك ويرسل تنبيهات ذكية.",
            "الخصومات والغرامات تتحوّل إلى حوافز — وهذا وحده يغيّر ثقافة الفريق.",
          ],
        },
        {
          type: "vision",
          text: "نظامي اتش آر يسير مع رؤية 2030 — يساعدك تبني فريق منتج، محفّز، ومؤهّل للنمو في بيئة العمل السعودية الجديدة.",
        },
        { type: "p", text: "جرّب الحين — مجانًا، بدون التزام." },
        { type: "sign", text: "في أمان الله،\nفريق نظامي اتش آر" },
      ],
    },
    en: {
      greeting: "Assalamu Alaikum {{name}},",
      blocks: [
        { type: "p", text: "Your request came through — and we're glad you chose Nizamy HR." },
        {
          type: "callout",
          text: "Let's be direct with you from the start: every riyal you spend managing your team should come back to you in one form or another.",
        },
        {
          type: "p",
          text: "A company with 50 employees and a monthly payroll of SAR 150,000 loses approximately SAR 18,000 per year to lost productivity, staff turnover, and manual follow-up. Nizamy HR is designed to recover that number for you.",
        },
        { type: "p", text: "Here's how:" },
        {
          type: "bullets",
          items: [
            "Your team shows up committed — because consistent attendance earns real rewards, not warnings.",
            "You stop chasing people daily — the system monitors automatically and sends smart alerts.",
            "Deductions and penalties become motivation — and that alone changes the culture of your team.",
          ],
        },
        {
          type: "vision",
          text: "Nizamy HR is aligned with Vision 2030 — helping you build a productive, motivated Saudi workforce ready for the new economy.",
        },
        { type: "p", text: "Start now — free, no commitment." },
        { type: "sign", text: "With best regards,\nThe Nizamy HR Team" },
      ],
    },
  },
  "02": {
    subjectAr: "أهلًا في نظامي اتش آر — لأن فريقك يستاهل أكثر من مجرد متابعة",
    subjectEn: "Welcome to Nizamy HR — because your team deserves more than just tracking",
    ctaLabel: "ابدأ تجربتك المجانية الآن | Try Nizamy HR Free",
    ar: {
      greeting: "السلام عليكم {{name}}،",
      blocks: [
        { type: "p", text: "أهلًا فيك — ويسعدنا إنك هنا." },
        {
          type: "callout",
          text: "نحن نؤمن بشيء واحد: الموظف اللي يحسّ بالتقدير، يشتغل بشكل مختلف تمامًا.",
        },
        {
          type: "p",
          text: "في سوق العمل السعودي، الاحتفاظ بالكوادر الوطنية المميزة مش رفاهية — هو ضرورة. وتكلفة فقدان موظف سعودي واحد تتجاوز 23,000 ريال لما تحسب التوظيف، التدريب، وفقدان الإنتاجية.",
        },
        {
          type: "p",
          text: "نظامي اتش آر مبني على فكرة بسيطة: التزام الموظف لازم يُكافأ — مش يُعاقَب.",
        },
        { type: "p", text: "تخيّل بيئة عمل فيها:" },
        {
          type: "bullets",
          items: [
            "موظفيك السعوديين يكسبون نقاط على الحضور والإنجاز — مكافآت حقيقية يختارونها بأنفسهم.",
            "المدير يوقف المتابعة اليدوية ويرجع يركّز على تطوير الفريق.",
            "معدل دوران الموظفين ينخفض — وأنت توفّر 23,000 ريال في كل موظف تحتفظ فيه.",
          ],
        },
        {
          type: "vision",
          text: "في إطار رؤية 2030، بناء بيئة عمل جاذبة للكوادر الوطنية هو استثمار استراتيجي — ونظامي اتش آر يساعدك تبني هذه البيئة بدون تعقيد.",
        },
        { type: "sign", text: "مع خالص التحية،\nفريق نظامي اتش آر" },
      ],
    },
    en: {
      greeting: "Assalamu Alaikum {{name}},",
      blocks: [
        { type: "p", text: "Welcome — and we're genuinely glad you're here." },
        {
          type: "callout",
          text: "We believe in one thing: an employee who feels valued works completely differently.",
        },
        {
          type: "p",
          text: "In the Saudi labour market, retaining talented Saudi nationals is not a luxury — it is a business necessity. The cost of losing a single Saudi employee exceeds SAR 23,000 when you factor in hiring, onboarding, and lost productivity.",
        },
        {
          type: "p",
          text: "Nizamy HR is built on a simple idea: employee commitment should be rewarded — not just monitored.",
        },
        { type: "p", text: "Imagine a workplace where:" },
        {
          type: "bullets",
          items: [
            "Your Saudi employees earn points for attendance and performance — real rewards they choose themselves.",
            "Managers stop daily follow-up and go back to developing the team.",
            "Employee turnover drops — and you save SAR 23,000 for every person you keep.",
          ],
        },
        {
          type: "vision",
          text: "Under Vision 2030, building an attractive environment for Saudi talent is a strategic investment — and Nizamy HR helps you build it without complexity.",
        },
        { type: "sign", text: "With warm regards,\nThe Nizamy HR Team" },
      ],
    },
  },
  "03": {
    subjectAr: "كل ريال تدفعه على HR — المفروض يرجع لك. هل يرجع؟",
    subjectEn: "Every riyal you spend on HR should come back. Does it?",
    ctaLabel: "ابدأ الآن — بدون بطاقة ائتمان | Start Free — No Credit Card",
    ar: {
      greeting: "السلام عليكم {{name}}،",
      blocks: [
        {
          type: "callout",
          text: "سؤال صريح — وأبغى جواب صريح: كم تدفع شهريًا على إدارة الموظفين — واشتراكات، ووقت مدراء، وخسائر دوران؟ وكم يرجع منها؟",
        },
        { type: "p", text: "لو عندك 50 موظف في السعودية، الأرقام الواقعية تقول:" },
        {
          type: "bullets",
          items: [
            "مدير يقضّي ساعتين يوميًا في متابعة الحضور والغياب = 576 ريال شهريًا ضايعة.",
            "دوران موظف واحد يكلّفك بين 15,000 و23,000 ريال في التوظيف والتدريب من جديد.",
            "موظف حاسّ إنه مراقَب بس — إنتاجيته تنزل بدون ما تحسّ.",
          ],
        },
        { type: "p", text: "هذي مش مشكلة نظام. هذا نموذج خاطئ." },
        {
          type: "p",
          text: "نظامي اتش آر يقلب المعادلة: نفس الموظف، نفس الميزانية — نتيجة معاكسة تمامًا.",
        },
        {
          type: "bullets",
          items: [
            "بدل الخصم — نقاط ومكافآت يختارها الموظف بنفسه.",
            "بدل المتابعة — تنبيهات ذكية تصلك على الجوال بثانية واحدة.",
            "وفي نهاية السنة — الشركات اللي عندها 50 موظف توفّر ما بين 12,000 و18,000 ريال سنويًا.",
          ],
        },
        {
          type: "vision",
          text: "هذا النموذج يسير مع رؤية 2030 لرفع الإنتاجية وتطوير بيئة العمل السعودية.",
        },
        { type: "sign", text: "تحياتي،\nفريق نظامي اتش آر" },
      ],
    },
    en: {
      greeting: "Assalamu Alaikum {{name}},",
      blocks: [
        {
          type: "callout",
          text: "A direct question — and I want an honest answer: how much do you spend monthly managing your team — subscriptions, manager time, turnover losses? And how much comes back?",
        },
        { type: "p", text: "If you have 50 employees in Saudi Arabia, here is what the real numbers say:" },
        {
          type: "bullets",
          items: [
            "A manager spending two hours daily chasing attendance = SAR 576 per month lost.",
            "Losing one employee costs you between SAR 15,000 and SAR 23,000 in rehiring and retraining.",
            "An employee who feels only monitored — loses productivity quietly, steadily, invisibly.",
          ],
        },
        { type: "p", text: "This is not a software problem. It is a broken model." },
        {
          type: "p",
          text: "Nizamy HR flips the equation: same employee, same budget — completely opposite outcome.",
        },
        {
          type: "bullets",
          items: [
            "Instead of deductions — points and rewards the employee chooses themselves.",
            "Instead of daily follow-up — smart alerts delivered to your phone in seconds.",
            "And at year end — companies with 50 employees save between SAR 12,000 and SAR 18,000 annually.",
          ],
        },
        {
          type: "vision",
          text: "This model is aligned with Vision 2030's mandate for higher productivity and a stronger Saudi work environment.",
        },
        { type: "sign", text: "Best regards,\nThe Nizamy HR Team" },
      ],
    },
  },
};

export function resolveTemplateId(raw: string | undefined): TemplateId {
  return raw === "02" || raw === "03" ? raw : "01";
}

const fontStack = "'IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,Helvetica,sans-serif";
const headingFont = {
  ar: fontStack,
  en: fontStack,
} as const;
const fontHead = `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap" rel="stylesheet"><style>@font-face{font-family:'IBM Plex Sans Arabic';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3CZRtWPQCuHme67tEYUIx3Kh0PHR9N6Ys43PW5fslBEg0.woff2) format('woff2')}@font-face{font-family:'IBM Plex Sans Arabic';font-style:normal;font-weight:700;src:url(https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YOG-eCRXMRrKATtYV0.woff2) format('woff2')}</style>`;
const bodyStyle = `font-family:${fontStack};font-size:15px;color:#334155;line-height:1.9;`;

const colors = {
  pageBg: "#F1F5F9",
  navy: "#0F172A",
  blue: "#2563EB",
  blueDark: "#1D4ED8",
  sky: "#EFF6FF",
  muted: "#64748B",
  rule: "#E2E8F0",
  headerBg: "#F8FAFF",
};

function renderBlock(block: Block, rtl: boolean): string {
  const align = rtl ? "right" : "left";
  const side = rtl ? "right" : "left";
  switch (block.type) {
    case "p":
      return `<p style="margin:0 0 14px 0;${bodyStyle}text-align:${align}">${escapeHtml(block.text)}</p>`;
    case "bullets":
      return block.items
        .map(
          (item) =>
            `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 10px 0"><tr><td width="26" valign="top" style="font-family:${fontStack};font-size:15px;color:${colors.blue};line-height:1.8">&#9656;</td><td style="${bodyStyle}text-align:${align}">${escapeHtml(item)}</td></tr></table>`,
        )
        .join("");
    case "callout":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px 0"><tr><td style="background:${colors.sky};border-${side}:4px solid ${colors.blue};border-radius:10px;padding:14px 18px"><div style="${bodyStyle}font-weight:bold;color:${colors.navy};text-align:${align}">${escapeHtml(block.text)}</div></td></tr></table>`;
    case "vision":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px 0"><tr><td style="background:#E6F2EC;border-${side}:4px solid #006B3C;border-radius:10px;padding:14px 18px;font-family:${fontStack};font-size:15px;line-height:1.8;color:#006B3C;text-align:${align}">${escapeHtml(block.text)}</td></tr></table>`;
    case "sign":
      return `<p style="margin:16px 0 0 0;${bodyStyle}color:${colors.navy};text-align:${align}">${escapeHtml(block.text).replace(/\n/g, "<br/>")}</p>`;
  }
}

function renderLang(content: LangContent, name: string, rtl: boolean): string {
  const greeting = content.greeting.replace("{{name}}", name);
  const align = rtl ? "right" : "left";
  const inner = [
    `<p style="margin:0 0 16px 0;${bodyStyle}font-weight:bold;font-size:17px;color:${colors.navy};text-align:${align}">${escapeHtml(greeting)}</p>`,
    ...content.blocks.map((b) => renderBlock(b, rtl)),
  ].join("");
  return `<div dir="${rtl ? "rtl" : "ltr"}" style="text-align:${align}">${inner}</div>`;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

function splitCtaLabel(label: string, lang: EmailLang): string {
  const parts = label.split(" | ");
  if (parts.length !== 2) return label;
  return lang === "ar" ? parts[0] : parts[1];
}

const chrome = {
  ar: {
    headline: "نظامي اتش آر <span style=\"color:#2563EB\">يرجّع لك.</span>",
    banner: "حتى 30% من اشتراكك يرجع لك سنويًا",
    footerSub: "نظام موارد بشرية بالذكاء الاصطناعي للمنشآت السعودية",
    ctaNote: "بدون التزام · بدون بطاقة ائتمان",
  },
  en: {
    headline: "Nizamy HR <span style=\"color:#2563EB\">pays you back.</span>",
    banner: "Up to 30% of your subscription back every year",
    footerSub: "AI-powered HR for Saudi SMEs",
    ctaNote: "No commitment · No credit card",
  },
} as const;

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

export function getEmailHTML(
  templateId: TemplateId,
  name: string,
  trialLink: string,
  lang: EmailLang,
  hasLogo = true,
  hasTextImages = false,
): string {
  const t = templates[templateId];
  const safeLink = escapeHtml(trialLink);
  const rtl = lang === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const c = chrome[lang];
  const heading = headingFont[lang];
  const body = rtl ? renderLang(t.ar, name, true) : renderLang(t.en, name, false);
  const ctaLabel = splitCtaLabel(t.ctaLabel, lang);
  const wordmark = rtl
    ? `<span style="color:${colors.blue}">نظا</span><span style="color:${colors.navy}">مي اتش آر</span>`
    : `<span style="color:${colors.navy}">Niza</span><span style="color:${colors.blue}">my HR</span>`;
  const headlineHtml = hasTextImages
    ? `<div style="margin-top:22px"><img src="cid:nz-headline" width="${rtl ? 344 : 456}" alt="${escapeHtml(stripTags(c.headline))}" style="display:block;border:0;max-width:100%;margin:0 auto" /></div>`
    : `<div style="margin-top:22px;font-family:${heading};font-size:28px;font-weight:800;line-height:1.35;color:${colors.navy};text-align:center">${c.headline}</div>`;
  const bannerHtml = hasTextImages
    ? `<img src="cid:nz-banner" width="${rtl ? 322 : 470}" alt="${escapeHtml(c.banner)}" style="display:block;border:0;max-width:100%;margin:0 auto" />`
    : `<div style="font-family:${heading};font-size:16px;font-weight:800;color:#FFFFFF;text-align:center">${escapeHtml(c.banner)}</div>`;

  return `<!DOCTYPE html>
<html dir="${dir}">
<head>${fontHead}</head>
<body style="margin:0;padding:0;background:${colors.pageBg}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.pageBg}">
    <tr><td align="center" style="padding:28px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;border-radius:18px;overflow:hidden;background:#FFFFFF">

        <tr><td dir="${dir}" align="center" style="background:${colors.headerBg};padding:36px 40px 28px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            ${hasLogo ? `<td style="vertical-align:middle;padding-${rtl ? "left" : "right"}:10px"><img src="cid:nizamy-logo" width="34" height="38" alt="Nizamy HR" style="display:block;border:0" /></td>` : ""}
            <td style="vertical-align:middle;font-family:${heading};font-size:22px;font-weight:800">${wordmark}</td>
          </tr></table>
          ${headlineHtml}
        </td></tr>

        <tr><td dir="${dir}" align="center" style="background:${colors.blue};padding:14px 24px">
          ${bannerHtml}
        </td></tr>

        <tr><td dir="${dir}" style="background:#FFFFFF;padding:34px 40px">
          ${body}
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:30px"><tr><td align="center">
            <a href="${safeLink}" style="display:inline-block;background:${colors.blue};background-image:linear-gradient(135deg,${colors.blue},${colors.blueDark});color:#FFFFFF;font-family:${heading};font-size:16px;font-weight:800;text-decoration:none;border-radius:12px;padding:16px 48px">${escapeHtml(ctaLabel)}</a>
            <div style="margin-top:12px;font-family:${fontStack};font-size:12px;color:${colors.muted}">${escapeHtml(c.ctaNote)}</div>
          </td></tr></table>
        </td></tr>

        <tr><td dir="${dir}" align="center" style="background:${colors.navy};padding:22px 40px">
          <div style="font-family:${heading};font-size:15px;font-weight:800;color:#FFFFFF">${rtl ? "نظامي اتش آر" : "Nizamy HR"} <span style="color:#93C5FD">· ${rtl ? "Nizamy HR" : "نظامي اتش آر"}</span></div>
          <div style="font-family:${fontStack};font-size:11px;color:#94A3B8;margin-top:5px">${escapeHtml(c.footerSub)}</div>
          <div style="margin-top:8px"><a href="https://www.nizamy.app" style="font-family:${fontStack};font-size:12px;color:#93C5FD;text-decoration:none">www.nizamy.app</a></div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const returningChrome = {
  ar: {
    subject: "أهلًا بعودتك إلى نظامي اتش آر — أنت على القائمة",
    greeting: "أهلًا بعودتك {{name}}،",
    intro: "طلبك وصلنا من قبل وأنت محجوز معنا — هذا تذكير سريع بما ينتظرك.",
    headline: "نظام موارد بشرية <span style=\"color:#2563EB\">يرجع لك قيمة.</span>",
    sub: "ربط الحضور والأداء والمكافآت يحوّل التشغيل اليومي إلى عائد حقيقي لمنشأتك.",
    statPill: "عائد سنوي محتمل",
    statNum: "حتى 30%",
    statSub: "من اشتراكك يرجع لك",
    cta: "احجز وصولك المجاني",
    ctaNote: "بدون التزام · بدون بطاقة ائتمان",
    footerTag: "نظام موارد بشرية بالذكاء الاصطناعي للمنشآت السعودية",
    website: "الموقع",
    contact: "تواصل معنا",
    rights: "© 2026 نظامي اتش آر. جميع الحقوق محفوظة.",
  },
  en: {
    subject: "Welcome back to Nizamy HR — you're already on the list",
    greeting: "Welcome back {{name}},",
    intro: "We already have your request and your spot is saved — here's a quick reminder of what's waiting for you.",
    headline: "An HR system that <span style=\"color:#2563EB\">pays you value.</span>",
    sub: "Connecting attendance, performance, and rewards turns daily operations into real returns for your business.",
    statPill: "Potential annual return",
    statNum: "Up to 30%",
    statSub: "of your subscription back",
    cta: "Reserve your free access",
    ctaNote: "No commitment · No credit card",
    footerTag: "AI-powered HR for Saudi SMEs",
    website: "Website",
    contact: "Contact",
    rights: "© 2026 Nizamy HR. All rights reserved.",
  },
} as const;

export function getReturningEmailHTML(
  name: string,
  trialLink: string,
  lang: EmailLang,
  hasLogo = true,
  hasTextImages = false,
): string {
  const rtl = lang === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";
  const c = returningChrome[lang];
  const heading = headingFont[lang];
  const safeLink = escapeHtml(trialLink);
  const greeting = escapeHtml(c.greeting.replace("{{name}}", name));
  const logoCell = hasLogo
    ? `<td style="vertical-align:middle;padding-${rtl ? "left" : "right"}:10px"><img src="cid:nizamy-logo" width="30" height="34" alt="Nizamy HR" style="display:block;border:0" /></td>`
    : "";
  const headlineHtml = hasTextImages
    ? `<img src="cid:nz-headline" width="${rtl ? 444 : 554}" alt="${escapeHtml(stripTags(c.headline))}" style="display:block;border:0;max-width:100%;margin:0 auto" />`
    : `<div style="font-family:${heading};font-size:26px;font-weight:800;line-height:1.4;color:${colors.navy};text-align:center">${c.headline}</div>`;
  const statNumHtml = hasTextImages
    ? `<img src="cid:nz-stat" width="${rtl ? 246 : 294}" alt="${escapeHtml(c.statNum)}" style="display:block;border:0;max-width:100%;margin:14px auto 0 auto" />`
    : `<div style="font-family:${heading};font-size:46px;font-weight:800;color:${colors.blue};margin-top:14px;line-height:1">${escapeHtml(c.statNum)}</div>`;

  return `<!DOCTYPE html>
<html dir="${dir}">
<head>${fontHead}</head>
<body style="margin:0;padding:0;background:${colors.pageBg}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.pageBg}">
    <tr><td align="center" style="padding:28px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;border-radius:18px;overflow:hidden;background:#FFFFFF">

        <tr><td dir="${dir}" style="background:${colors.navy};padding:18px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            ${logoCell}
            <td style="vertical-align:middle;font-family:${heading};font-size:19px;font-weight:800;color:#FFFFFF">${rtl ? "نظامي اتش آر" : "Nizamy HR"}</td>
          </tr></table>
        </td></tr>

        <tr><td dir="${dir}" style="background:#FFFFFF;padding:36px 40px 34px 40px">
          <p style="margin:0 0 6px 0;${bodyStyle}font-weight:bold;font-size:16px;color:${colors.navy};text-align:${align}">${greeting}</p>
          <p style="margin:0 0 24px 0;${bodyStyle}font-size:13px;color:${colors.muted};text-align:${align}">${escapeHtml(c.intro)}</p>

          ${headlineHtml}
          <p style="margin:12px 0 24px 0;${bodyStyle}font-size:13px;color:${colors.muted};text-align:center">${escapeHtml(c.sub)}</p>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 26px 0"><tr><td align="center" style="background:${colors.sky};border-radius:16px;padding:26px 16px">
            <span style="display:inline-block;background:${colors.blue};color:#FFFFFF;font-family:${fontStack};font-size:11px;font-weight:bold;padding:6px 16px;border-radius:16px">${escapeHtml(c.statPill)}</span>
            ${statNumHtml}
            <div style="font-family:${fontStack};font-size:12px;color:${colors.muted};margin-top:10px">${escapeHtml(c.statSub)}</div>
          </td></tr></table>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center">
            <a href="${safeLink}" style="display:inline-block;background:${colors.blue};background-image:linear-gradient(135deg,${colors.blue},${colors.blueDark});color:#FFFFFF;font-family:${heading};font-size:15px;font-weight:800;text-decoration:none;border-radius:12px;padding:15px 42px">${escapeHtml(c.cta)}</a>
            <div style="margin-top:12px;font-family:${fontStack};font-size:12px;color:${colors.muted}">${escapeHtml(c.ctaNote)}</div>
          </td></tr></table>
        </td></tr>

        <tr><td dir="${dir}" align="center" style="background:${colors.navy};padding:22px 40px">
          <div style="font-family:${heading};font-size:15px;font-weight:800;color:#FFFFFF">${rtl ? "نظامي اتش آر" : "Nizamy HR"} <span style="color:#93C5FD">· ${rtl ? "Nizamy HR" : "نظامي اتش آر"}</span></div>
          <div style="font-family:${fontStack};font-size:11px;color:#94A3B8;margin-top:5px">${escapeHtml(c.footerTag)}</div>
          <div style="margin-top:8px">
            <a href="https://www.nizamy.app" style="font-family:${fontStack};font-size:12px;color:#93C5FD;text-decoration:none">${escapeHtml(c.website)}</a>
            <span style="font-family:${fontStack};font-size:12px;color:#475569">&nbsp;·&nbsp;</span>
            <a href="mailto:sales@muntej.app" style="font-family:${fontStack};font-size:12px;color:#93C5FD;text-decoration:none">${escapeHtml(c.contact)}</a>
          </div>
          <div style="font-family:${fontStack};font-size:10px;color:#64748B;margin-top:12px">${escapeHtml(c.rights)}</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderReturningLeadEmail(
  name: string,
  trialLink: string,
  lang: EmailLang,
  hasLogo = true,
  hasTextImages = false,
): RenderedEmail {
  const c = returningChrome[lang];
  const html = getReturningEmailHTML(name, trialLink, lang, hasLogo, hasTextImages);
  const text = [
    c.greeting.replace("{{name}}", name),
    "",
    c.intro,
    "",
    `${c.statPill}: ${c.statNum} — ${c.statSub}`,
    "",
    `${c.cta}: ${trialLink}`,
    "",
    "نظامي اتش آر · Nizamy HR — www.nizamy.app",
  ].join("\n");
  return { subject: c.subject, html, text };
}

function renderText(content: LangContent, name: string): string {
  const lines: string[] = [content.greeting.replace("{{name}}", name), ""];
  for (const block of content.blocks) {
    if (block.type === "bullets") {
      for (const item of block.items) lines.push(`- ${item}`);
      lines.push("");
    } else {
      lines.push(block.text, "");
    }
  }
  return lines.join("\n").trim();
}

export function renderLeadEmail(
  templateId: TemplateId,
  name: string,
  trialLink: string,
  lang: EmailLang,
  hasLogo = true,
  hasTextImages = false,
): RenderedEmail {
  const t = templates[templateId];
  const subject = lang === "ar" ? t.subjectAr : t.subjectEn;
  const html = getEmailHTML(templateId, name, trialLink, lang, hasLogo, hasTextImages);
  const text = [
    renderText(lang === "ar" ? t.ar : t.en, name),
    "",
    `${splitCtaLabel(t.ctaLabel, lang)}: ${trialLink}`,
    "",
    "نظامي اتش آر · Nizamy HR — www.nizamy.app",
  ].join("\n");
  return { subject, html, text };
}
