export type TemplateId = "01" | "02" | "03";

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
    subjectAr: "أهلًا بك في نظامي — نظام الموارد البشرية اللي يرجّع لك أكثر مما تدفع",
    subjectEn: "Welcome to Nizamy — the HR system that gives back more than it costs",
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

const bodyStyle = "font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1A1A1A;line-height:1.7;";

function renderBlock(block: Block, rtl: boolean): string {
  const align = rtl ? "right" : "left";
  switch (block.type) {
    case "p":
      return `<p style="margin:0 0 14px 0;${bodyStyle}text-align:${align}">${escapeHtml(block.text)}</p>`;
    case "bullets":
      return block.items
        .map(
          (item) =>
            `<p style="margin:0 0 8px 0;${bodyStyle}text-align:${align}">&#9656; ${escapeHtml(item)}</p>`,
        )
        .join("");
    case "callout":
      return `<div style="border-${rtl ? "right" : "left"}:4px solid #C8A86B;background:#FBF4E5;padding:12px 16px;margin:0 0 16px 0;${bodyStyle}text-align:${align}"><em><strong>${escapeHtml(block.text)}</strong></em></div>`;
    case "vision":
      return `<div style="border-${rtl ? "right" : "left"}:4px solid #006B3C;background:#E6F2EC;padding:12px 16px;margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#006B3C;text-align:${align}">${escapeHtml(block.text)}</div>`;
    case "sign":
      return `<p style="margin:16px 0 0 0;${bodyStyle}text-align:${align}">${escapeHtml(block.text).replace(/\n/g, "<br/>")}</p>`;
  }
}

function renderLang(content: LangContent, name: string, rtl: boolean): string {
  const greeting = content.greeting.replace("{{name}}", name);
  const align = rtl ? "right" : "left";
  const inner = [
    `<p style="margin:0 0 14px 0;${bodyStyle}font-weight:bold;text-align:${align}">${escapeHtml(greeting)}</p>`,
    ...content.blocks.map((b) => renderBlock(b, rtl)),
  ].join("");
  return `<div dir="${rtl ? "rtl" : "ltr"}" style="text-align:${align}">${inner}</div>`;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function getEmailHTML(templateId: TemplateId, name: string, trialLink: string): string {
  const t = templates[templateId];
  const safeLink = escapeHtml(trialLink);

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F4F6F9">
  <div style="max-width:600px;margin:0 auto;padding:24px 12px">
    <div style="background:#FFFFFF;border-radius:8px;overflow:hidden">
      <div style="background:#0A1628;padding:24px;text-align:center">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;color:#FFFFFF">نظامي · Nizamy</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#C8A86B;margin-top:6px">نظام الموارد البشرية اللي يرجّع لك · HR that pays you back</div>
      </div>
      <div style="padding:28px 24px">
        ${renderLang(t.ar, name, true)}
        <hr style="border:none;border-top:1px solid #D1D5DB;margin:28px 0" />
        ${renderLang(t.en, name, false)}
        <div style="text-align:center;margin:32px 0 8px 0">
          <a href="${safeLink}" style="display:inline-block;background:#166534;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;border-radius:6px;padding:14px 32px">${escapeHtml(t.ctaLabel)}</a>
        </div>
      </div>
      <div style="border-top:1px solid #E5E7EB;padding:16px 24px;text-align:center">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280">نظامي · Nizamy — www.nizamy.app</div>
      </div>
    </div>
  </div>
</body>
</html>`;
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

export function renderLeadEmail(templateId: TemplateId, name: string, trialLink: string): RenderedEmail {
  const t = templates[templateId];
  const subject = `${t.subjectAr} | ${t.subjectEn}`;
  const html = getEmailHTML(templateId, name, trialLink);
  const text = [
    renderText(t.ar, name),
    "",
    "------------------------------",
    "",
    renderText(t.en, name),
    "",
    `${t.ctaLabel}: ${trialLink}`,
    "",
    "نظامي · Nizamy — www.nizamy.app",
  ].join("\n");
  return { subject, html, text };
}
