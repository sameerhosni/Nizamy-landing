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
    subjectAr: "أهلًا بك في نظامي — نظام الموارد البشرية اللي يرجّع لك جزءًا من تكلفته السنوية",
    subjectEn: "Welcome to Nizamy — the HR system that returns part of its annual cost back to you",
    ctaLabel: "ابدأ تجربتك المجانية | Start Your Free Trial",
    ar: {
      greeting: "السلام عليكم {{name}}،",
      blocks: [
        { type: "p", text: "وصل طلبك — ويسعدنا إنك اخترت نظامي." },
        {
          type: "callout",
          text: "خلّنا نكون صريحين معك من البداية: كل ريال تدفعه على إدارة الموظفين — المفروض يرجع لك بشكل أو بآخر.",
        },
        {
          type: "p",
          text: "الشركات اللي عندها 50 موظف وراتب شهري بـ 150,000 ريال — تخسر ما يقارب 18,000 ريال سنويًا من الإنتاجية الضايعة، دوران الموظفين، والمتابعة اليدوية. نظامي مصمّم يرجّع لك هذا الرقم.",
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
          text: "نظامي يسير مع رؤية 2030 — يساعدك تبني فريق منتج، محفّز، ومؤهّل للنمو في بيئة العمل السعودية الجديدة.",
        },
        { type: "p", text: "جرّب الحين — مجانًا، بدون التزام." },
        { type: "sign", text: "في أمان الله،\nفريق نظامي" },
      ],
    },
    en: {
      greeting: "Assalamu Alaikum {{name}},",
      blocks: [
        { type: "p", text: "Your request came through — and we're glad you chose Nizamy." },
        {
          type: "callout",
          text: "Let's be direct with you from the start: every riyal you spend managing your team should come back to you in one form or another.",
        },
        {
          type: "p",
          text: "A company with 50 employees and a monthly payroll of SAR 150,000 loses approximately SAR 18,000 per year to lost productivity, staff turnover, and manual follow-up. Nizamy is designed to recover that number for you.",
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
          text: "Nizamy is aligned with Vision 2030 — helping you build a productive, motivated Saudi workforce ready for the new economy.",
        },
        { type: "p", text: "Start now — free, no commitment." },
        { type: "sign", text: "With best regards,\nThe Nizamy Team" },
      ],
    },
  },
  "02": {
    subjectAr: "أهلًا في نظامي — لأن فريقك يستاهل أكثر من مجرد متابعة",
    subjectEn: "Welcome to Nizamy — because your team deserves more than just tracking",
    ctaLabel: "ابدأ تجربتك المجانية الآن | Try Nizamy Free",
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
          text: "نظامي مبني على فكرة بسيطة: التزام الموظف لازم يُكافأ — مش يُعاقَب.",
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
          text: "في إطار رؤية 2030، بناء بيئة عمل جاذبة للكوادر الوطنية هو استثمار استراتيجي — ونظامي يساعدك تبني هذه البيئة بدون تعقيد.",
        },
        { type: "sign", text: "مع خالص التحية،\nفريق نظامي" },
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
          text: "Nizamy is built on a simple idea: employee commitment should be rewarded — not just monitored.",
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
          text: "Under Vision 2030, building an attractive environment for Saudi talent is a strategic investment — and Nizamy helps you build it without complexity.",
        },
        { type: "sign", text: "With warm regards,\nThe Nizamy Team" },
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
          text: "نظامي يقلب المعادلة: نفس الموظف، نفس الميزانية — نتيجة معاكسة تمامًا.",
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
        { type: "sign", text: "تحياتي،\nفريق نظامي" },
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
          text: "Nizamy flips the equation: same employee, same budget — completely opposite outcome.",
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
        { type: "sign", text: "Best regards,\nThe Nizamy Team" },
      ],
    },
  },
};

export function resolveTemplateId(raw: string | undefined): TemplateId {
  return raw === "02" || raw === "03" ? raw : "01";
}

const fontStack = "'Segoe UI',Tahoma,Arial,Helvetica,sans-serif";
const bodyStyle = `font-family:${fontStack};font-size:15px;color:#2A3660;line-height:1.8;`;

const colors = {
  pageBg: "#EEF1FF",
  navy: "#0D1F5C",
  blue: "#1A6BF5",
  blueDark: "#1250C4",
  pink: "#E0339A",
  sky: "#EEF2FF",
  muted: "#6B7FBA",
  rule: "#DDE3F8",
  headerBg: "#F3F2FF",
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
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px 0"><tr><td style="background:#FFFFFF;border:1px solid ${colors.rule};border-${side}:4px solid ${colors.blue};border-radius:14px;padding:16px 20px"><div style="font-family:${fontStack};font-size:26px;font-weight:bold;color:${colors.blue};line-height:1">&#8220;</div><div style="${bodyStyle}font-weight:bold;color:${colors.navy};text-align:${align}"><em>${escapeHtml(block.text)}</em></div></td></tr></table>`;
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
    pill: "وصول مبكر مجاني",
    headline1: "كل أنظمة الموارد البشرية <span style=\"color:#1A6BF5\">تُكلّفك.</span>",
    headline2: "نظامي <span style=\"color:#E0339A\">يعيد لك.</span>",
    tagline: "مساعدك الذكي في الموارد البشرية. أنت تقود. نظامي يتولى الباقي.",
    stats: [
      ["+1,440 ر.س", "عائد سنوي تلقائي"],
      ["70%", "توفير في وقت الإدارة"],
      ["حتى 30%", "استرداد من الاشتراك"],
      ["3 ر.س", "يبدأ من / للموظف"],
    ],
    footerSub: "نظام موارد بشرية بالذكاء الاصطناعي للمنشآت السعودية",
    ctaNote: "بدون التزام · بدون بطاقة ائتمان",
  },
  en: {
    pill: "Free early access",
    headline1: "Every HR system <span style=\"color:#1A6BF5\">costs you.</span>",
    headline2: "Nizamy <span style=\"color:#E0339A\">pays you back.</span>",
    tagline: "Your smart HR assistant. You lead. Nizamy handles the rest.",
    stats: [
      ["+SAR 1,440", "Automatic annual return"],
      ["70%", "Less admin time"],
      ["Up to 30%", "Of subscription back"],
      ["SAR 3", "Starting / employee"],
    ],
    footerSub: "AI-powered HR for Saudi SMEs",
    ctaNote: "No commitment · No credit card",
  },
} as const;

export function getEmailHTML(
  templateId: TemplateId,
  name: string,
  trialLink: string,
  lang: EmailLang,
  hasLogo = true,
): string {
  const t = templates[templateId];
  const safeLink = escapeHtml(trialLink);
  const rtl = lang === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";
  const c = chrome[lang];
  const body = rtl ? renderLang(t.ar, name, true) : renderLang(t.en, name, false);
  const ctaLabel = splitCtaLabel(t.ctaLabel, lang);
  const wordmark = rtl
    ? `<span style="color:${colors.blue}">نظا</span><span style="color:${colors.navy}">مي</span>`
    : `<span style="color:${colors.navy}">Niza</span><span style="color:${colors.blue}">my</span>`;

  const statCells = c.stats
    .map(
      ([num, lbl]) =>
        `<td align="center" width="25%" style="padding:6px 4px"><div style="font-family:${fontStack};font-size:22px;font-weight:800;color:#FFFFFF;white-space:nowrap">${escapeHtml(num)}</div><div style="font-family:${fontStack};font-size:11px;color:#CFE0FF;margin-top:4px">${escapeHtml(lbl)}</div></td>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html dir="${dir}">
<body style="margin:0;padding:0;background:${colors.pageBg}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.pageBg}">
    <tr><td align="center" style="padding:28px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;border-radius:22px;overflow:hidden;background:#FFFFFF">

        <tr><td dir="${dir}" style="background:${colors.headerBg};padding:36px 40px 30px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td align="${align}" style="vertical-align:middle">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  ${hasLogo ? `<td style="vertical-align:middle;padding-${rtl ? "left" : "right"}:10px"><img src="cid:nizamy-logo" width="34" height="38" alt="Nizamy" style="display:block;border:0" /></td>` : ""}
                  <td style="vertical-align:middle;font-family:${fontStack};font-size:21px;font-weight:800">${wordmark}</td>
                </tr></table>
              </td>
              <td align="${rtl ? "left" : "right"}" style="vertical-align:middle">
                <span style="display:inline-block;background:${colors.blue};color:#FFFFFF;font-family:${fontStack};font-size:12px;font-weight:bold;padding:8px 18px;border-radius:20px">${escapeHtml(c.pill)}</span>
              </td>
            </tr>
          </table>
          <div style="margin-top:32px;font-family:${fontStack};font-size:30px;font-weight:800;line-height:1.3;color:${colors.navy};text-align:${align}">${c.headline1}<br/>${c.headline2}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px"><tr>
            <td style="width:24px;height:3px;background:${colors.blue};border-radius:2px;font-size:0;line-height:0">&nbsp;</td>
            <td style="padding-${rtl ? "right" : "left"}:10px;font-family:${fontStack};font-size:13px;color:${colors.muted};text-align:${align}">${escapeHtml(c.tagline)}</td>
          </tr></table>
        </td></tr>

        <tr><td dir="${dir}" style="background:${colors.blue};padding:22px 24px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>${statCells}</tr></table>
        </td></tr>

        <tr><td dir="${dir}" style="background:#FFFFFF;padding:38px 40px">
          ${body}
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px"><tr><td align="center">
            <a href="${safeLink}" style="display:inline-block;background:${colors.blue};background-image:linear-gradient(135deg,${colors.blue},${colors.blueDark});color:#FFFFFF;font-family:${fontStack};font-size:17px;font-weight:800;text-decoration:none;border-radius:14px;padding:18px 52px">${escapeHtml(ctaLabel)}</a>
            <div style="margin-top:12px;font-family:${fontStack};font-size:12px;color:${colors.muted}">${escapeHtml(c.ctaNote)}</div>
          </td></tr></table>
        </td></tr>

        <tr><td dir="${dir}" style="background:${colors.navy};padding:26px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td align="${align}">
              <div style="font-family:${fontStack};font-size:16px;font-weight:800;color:#FFFFFF">${rtl ? "نظامي" : "Nizamy"} <span style="color:#90CAF9">· ${rtl ? "Nizamy" : "نظامي"}</span></div>
              <div style="font-family:${fontStack};font-size:11px;color:#AAB8E8;margin-top:4px">${escapeHtml(c.footerSub)}</div>
            </td>
            <td align="${rtl ? "left" : "right"}" style="vertical-align:middle">
              <a href="https://www.nizamy.app" style="font-family:${fontStack};font-size:12px;color:#90CAF9;text-decoration:none">www.nizamy.app</a>
            </td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const returningChrome = {
  ar: {
    subject: "أهلًا بعودتك إلى نظامي — أنت على القائمة",
    greeting: "أهلًا بعودتك {{name}}،",
    intro: "طلبك وصلنا من قبل وأنت محجوز معنا — هذا تذكير سريع بما ينتظرك.",
    headline1: "نظام موارد بشرية",
    headline2: "يرجع لك <span style=\"color:#1A6BF5\">قيمة.</span>",
    sub: "ربط الحضور والأداء والمكافآت يحوّل التشغيل اليومي إلى عائد حقيقي لمنشأتك.",
    statPill: "عائد سنوي محتمل",
    statNum: "حتى 30%",
    statSub: "من اشتراكك يرجع لك",
    cta: "احجز وصولك المجاني",
    ctaNote: "بدون التزام · بدون بطاقة ائتمان",
    features: [
      ["&#128101;", "الحضور بذكاء"],
      ["&#128203;", "إدارة الموظفين"],
      ["&#127873;", "مكافآت تحفّز الفريق"],
      ["&#9889;", "أتمتة ذكية"],
    ],
    footerTag: "نظام موارد بشرية بالذكاء الاصطناعي للمنشآت السعودية",
    website: "الموقع",
    contact: "تواصل معنا",
    rights: "© 2026 نظامي. جميع الحقوق محفوظة.",
  },
  en: {
    subject: "Welcome back to Nizamy — you're already on the list",
    greeting: "Welcome back {{name}},",
    intro: "We already have your request and your spot is saved — here's a quick reminder of what's waiting for you.",
    headline1: "An HR system that",
    headline2: "pays you <span style=\"color:#1A6BF5\">value.</span>",
    sub: "Connecting attendance, performance, and rewards turns daily operations into real returns for your business.",
    statPill: "Potential annual return",
    statNum: "Up to 30%",
    statSub: "of your subscription back",
    cta: "Reserve your free access",
    ctaNote: "No commitment · No credit card",
    features: [
      ["&#128101;", "Smart attendance"],
      ["&#128203;", "Employee management"],
      ["&#127873;", "Rewards that motivate"],
      ["&#9889;", "Smart automation"],
    ],
    footerTag: "AI-powered HR for Saudi SMEs",
    website: "Website",
    contact: "Contact",
    rights: "© 2026 Nizamy. All rights reserved.",
  },
} as const;

export function getReturningEmailHTML(
  name: string,
  trialLink: string,
  lang: EmailLang,
  hasLogo = true,
): string {
  const rtl = lang === "ar";
  const dir = rtl ? "rtl" : "ltr";
  const align = rtl ? "right" : "left";
  const c = returningChrome[lang];
  const safeLink = escapeHtml(trialLink);
  const greeting = escapeHtml(c.greeting.replace("{{name}}", name));
  const logoCell = hasLogo
    ? `<td style="vertical-align:middle;padding-${rtl ? "left" : "right"}:10px"><img src="cid:nizamy-logo" width="30" height="34" alt="Nizamy" style="display:block;border:0" /></td>`
    : "";

  const featureCells = c.features
    .map(
      ([icon, label]) =>
        `<td align="center" width="25%" style="padding:6px 4px"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="background:${colors.sky};border:1px solid ${colors.rule};border-radius:12px;padding:14px 6px"><div style="font-size:20px;line-height:1">${icon}</div><div style="font-family:${fontStack};font-size:11px;font-weight:bold;color:${colors.navy};margin-top:8px">${escapeHtml(label)}</div></td></tr></table></td>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html dir="${dir}">
<body style="margin:0;padding:0;background:${colors.pageBg}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.pageBg}">
    <tr><td align="center" style="padding:28px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;border-radius:22px;overflow:hidden;background:#FFFFFF">

        <tr><td dir="${dir}" style="background:${colors.navy};padding:18px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            ${logoCell}
            <td style="vertical-align:middle;font-family:${fontStack};font-size:19px;font-weight:800;color:#FFFFFF">${rtl ? "نظامي" : "Nizamy"}</td>
          </tr></table>
        </td></tr>

        <tr><td dir="${dir}" style="background:#FFFFFF;padding:36px 40px 30px 40px">
          <p style="margin:0 0 6px 0;${bodyStyle}font-weight:bold;font-size:16px;color:${colors.navy};text-align:${align}">${greeting}</p>
          <p style="margin:0 0 26px 0;${bodyStyle}font-size:13px;color:${colors.muted};text-align:${align}">${escapeHtml(c.intro)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="52%" style="vertical-align:middle;padding-${rtl ? "left" : "right"}:16px">
                <div style="font-family:${fontStack};font-size:26px;font-weight:800;line-height:1.4;color:${colors.navy};text-align:${align}">${c.headline1}<br/>${c.headline2}</div>
                <p style="margin:14px 0 22px 0;${bodyStyle}font-size:13px;color:${colors.muted};text-align:${align}">${escapeHtml(c.sub)}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td>
                  <a href="${safeLink}" style="display:inline-block;background:${colors.blue};background-image:linear-gradient(135deg,${colors.blue},${colors.blueDark});color:#FFFFFF;font-family:${fontStack};font-size:14px;font-weight:800;text-decoration:none;border-radius:12px;padding:13px 30px">${escapeHtml(c.cta)}</a>
                </td></tr></table>
              </td>
              <td width="48%" align="center" style="vertical-align:middle">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="background:linear-gradient(160deg,#F3F6FF,#EAF0FF);background-color:#F0F4FF;border-radius:18px;padding:28px 16px">
                  <span style="display:inline-block;background:${colors.blue};color:#FFFFFF;font-family:${fontStack};font-size:11px;font-weight:bold;padding:6px 16px;border-radius:16px">${escapeHtml(c.statPill)}</span>
                  <div style="font-family:${fontStack};font-size:46px;font-weight:800;color:${colors.blue};margin-top:14px;line-height:1">${escapeHtml(c.statNum)}</div>
                  <div style="font-family:${fontStack};font-size:12px;color:${colors.muted};margin-top:10px">${escapeHtml(c.statSub)}</div>
                </td></tr></table>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td dir="${dir}" style="background:#FFFFFF;padding:0 40px 34px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>${featureCells}</tr></table>
          <div style="text-align:center;margin-top:18px;font-family:${fontStack};font-size:12px;color:${colors.muted}">${escapeHtml(c.ctaNote)}</div>
        </td></tr>

        <tr><td dir="${dir}" style="background:${colors.navy};padding:26px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td align="${align}">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                ${logoCell}
                <td style="vertical-align:middle;font-family:${fontStack};font-size:16px;font-weight:800;color:#FFFFFF">${rtl ? "نظامي" : "Nizamy"}</td>
              </tr></table>
              <div style="font-family:${fontStack};font-size:11px;color:#AAB8E8;margin-top:6px">${escapeHtml(c.footerTag)}</div>
            </td>
            <td align="${rtl ? "left" : "right"}" style="vertical-align:middle">
              <a href="https://www.nizamy.app" style="font-family:${fontStack};font-size:12px;color:#90CAF9;text-decoration:none">${escapeHtml(c.website)}</a>
              <span style="font-family:${fontStack};font-size:12px;color:#3D5299">&nbsp;·&nbsp;</span>
              <a href="mailto:sales@muntej.app" style="font-family:${fontStack};font-size:12px;color:#90CAF9;text-decoration:none">${escapeHtml(c.contact)}</a>
            </td>
          </tr></table>
          <div style="text-align:center;font-family:${fontStack};font-size:10px;color:#5A6CB0;margin-top:18px">${escapeHtml(c.rights)}</div>
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
): RenderedEmail {
  const c = returningChrome[lang];
  const html = getReturningEmailHTML(name, trialLink, lang, hasLogo);
  const text = [
    c.greeting.replace("{{name}}", name),
    "",
    c.intro,
    "",
    `${c.statPill}: ${c.statNum} — ${c.statSub}`,
    "",
    `${c.cta}: ${trialLink}`,
    "",
    "نظامي · Nizamy — www.nizamy.app",
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
): RenderedEmail {
  const t = templates[templateId];
  const subject = lang === "ar" ? t.subjectAr : t.subjectEn;
  const html = getEmailHTML(templateId, name, trialLink, lang, hasLogo);
  const text = [
    renderText(lang === "ar" ? t.ar : t.en, name),
    "",
    `${splitCtaLabel(t.ctaLabel, lang)}: ${trialLink}`,
    "",
    "نظامي · Nizamy — www.nizamy.app",
  ].join("\n");
  return { subject, html, text };
}
