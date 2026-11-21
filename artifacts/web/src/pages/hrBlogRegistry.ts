import info from "./informationPagesContent.json";
import services from "./serviceLandingContent.json";
import detailsData from "./hrBlogDetails.json";
import storiesData from "./hrBlogStories.json";

export type Lang = "ar" | "en";
type Item = { title: string; text: string };
type RawSection = { id: string; title: string; paragraphs?: string[]; items?: Item[] };

export type Block = { id: string; heading: string; paragraphs?: string[]; items?: Item[] };
export type Article = {
  title: string;
  eyebrow: string;
  intro: string;
  blocks: Block[];
  faqs?: { q: string; a: string }[];
};

export type CategoryKey = "attendance" | "ai" | "security" | "software" | "payroll" | "people";

export const categories: Record<CategoryKey, { ar: string; en: string; accent: string; soft: string; emoji: string }> = {
  attendance: { ar: "الحضور", en: "Attendance", accent: "#E5484D", soft: "#FFE5E6", emoji: "⏱️" },
  ai: { ar: "الذكاء الاصطناعي", en: "AI in HR", accent: "#1689DC", soft: "#E3F2FD", emoji: "✨" },
  security: { ar: "الأمان والخصوصية", en: "Security & privacy", accent: "#0F9D74", soft: "#E1F6EE", emoji: "🛡️" },
  payroll: { ar: "الرواتب", en: "Payroll", accent: "#5B6CDB", soft: "#ECEEFF", emoji: "🧾" },
  people: { ar: "الفريق", en: "People", accent: "#0F9D74", soft: "#E1F6EE", emoji: "🤝" },
  software: { ar: "برامج وأدوات", en: "Software & tools", accent: "#E8890C", soft: "#FFF1DC", emoji: "🧰" },
};

export type BlogEntry = {
  slug: string;
  /** Key of this article's entry in seo.config.json. */
  seoKey: string;
  category: CategoryKey;
  /** Existing standalone page this content comes from (kept for reference). */
  sourcePath: string;
  /** Hand-designed article rendered by its own component instead of the generic reader. */
  custom?: boolean;
  /** Catchy card copy for the index; the article keeps its real title. */
  teaser: Record<Lang, { title: string; excerpt: string }>;
  load: (lang: Lang) => Article;
};

const fromSections = (prefix: string, sections: RawSection[]): Block[] =>
  sections.map((s) => ({ id: `${prefix}-${s.id}`, heading: s.title, paragraphs: s.paragraphs, items: s.items }));

const storyArticle = (slug: string, lang: Lang): Article => {
  const t = (storiesData as Record<string, Record<Lang, { kicker: string; title: string; hot: string; sub: string }>>)[slug][lang];
  return { title: `${t.title} ${t.hot}`, eyebrow: t.kicker, intro: t.sub, blocks: [] };
};

/**
 * To add a new blog page: append one entry here. It shows up on the index,
 * in the category filter, in the reader's "next article" card — nothing else to touch.
 */
export const blogEntries: BlogEntry[] = [
  {
    slug: "face-attendance-system-saudi-arabia",
    seoKey: "hrBlogAttendance",
    category: "attendance",
    sourcePath: "/services/attendance-performance",
    custom: true,
    teaser: {
      ar: { title: "وجهك يثبت إنك حضرت.. وموقعك يثبت وين 😎", excerpt: "بدون جهاز بصمة وبدون «بصّمني يا فلان». جرّب بنفسك: من يقدر يسجّل الحضور؟" },
      en: { title: "Your face proves you showed up. Your location proves where. 😎", excerpt: "No scanner, no “clock me in, bro”. Try it yourself: who gets to check in?" },
    },
    load: (lang) => ({
      title: lang === "ar" ? "الحضور… بدون دراما" : "Attendance… minus the drama",
      eyebrow: lang === "ar" ? "الحضور والانصراف" : "Attendance",
      intro: lang === "ar" ? "وجه واحد. ثانية واحدة. حضور صادق." : "One face. One second. Honest check-in.",
      blocks: [],
    }),
  },
  {
    slug: "ai-hr-assistant-employee-requests",
    seoKey: "hrBlogAi",
    category: "ai",
    sourcePath: "/services/ai-hr",
    custom: true,
    teaser: {
      ar: { title: "المساعد يشيل التكرار.. وأنت تتفرّغ للناس 🤝", excerpt: "الأسئلة والطلبات المتكررة يتولاها المساعد، والقرار يبقى بيدك. اسأله وشف الإجابة." },
      en: { title: "The assistant takes the repeats. You take the people. 🤝", excerpt: "Repeated questions and requests are handled by the assistant, and the decision stays with you. Ask it and see the answer." },
    },
    load: (lang) => {
      const a = services.aiHrService[lang];
      return {
        title: a.title,
        eyebrow: a.eyebrow,
        intro: a.intro,
        blocks: [
          { id: "ai-intro", heading: "", paragraphs: a.body },
          ...a.sections.map((s) => ({ id: `ai-${s.id}`, heading: s.heading, paragraphs: s.paragraphs, items: s.items })),
        ],
        faqs: a.faqs,
      };
    },
  },
  {
    slug: "replace-excel-whatsapp-hr-management",
    seoKey: "hrBlogSmallBiz",
    category: "software",
    sourcePath: "/small-business-hr-software-saudi-arabia",
    custom: true,
    teaser: {
      ar: { title: "منشأة صغيرة؟ لا تخلّي الموارد البشرية تضيع بين الواتساب والإكسل 😅", excerpt: "الحضور والطلبات والتقارير في مكان واحد بدل ملفات ورسائل متفرقة. اكتشف كيف تريّح فريقك وتوفّر وقتك." },
      en: { title: "Small business? Don’t let HR get lost between WhatsApp and Excel 😅", excerpt: "Attendance, requests and reports in one place instead of scattered files and chats. Find out how to save your team time." },
    },
    load: (lang) => {
      const a = info.hrSoftware[lang] as typeof info.hrSoftware.ar;
      return { title: a.title, eyebrow: a.eyebrow, intro: a.intro, blocks: fromSections("sb", a.sections as RawSection[]), faqs: a.faqs };
    },
  },
  {
    slug: "payroll-readiness-checklist-saudi",
    seoKey: "hrBlogPayroll",
    category: "payroll",
    sourcePath: "/services/payroll-inputs",
    custom: true,
    teaser: {
      ar: { title: "آخر الشهر بدون زحمة.. علّم على القائمة وشف الدائرة تكتمل ✅", excerpt: "قائمة قصيرة تجهّز فيها مسير الرواتب قبل لا يداهمك الوقت." },
      en: { title: "Month-end without the rush: tick the list and watch the ring close ✅", excerpt: "A short checklist to get payroll ready before time catches you." },
    },
    load: (lang) => storyArticle("payroll-readiness-checklist-saudi", lang),
  },
  {
    slug: "ramadan-working-hours-saudi-attendance",
    seoKey: "hrBlogRamadan",
    category: "attendance",
    sourcePath: "/services/attendance-performance",
    custom: true,
    teaser: {
      ar: { title: "رمضان جاي.. كم ساعة وكم يوم يناسب النظام؟ 🌙", excerpt: "جرّب حاسبة ساعات الأسبوع وشف المجموع مقابل الحد النظامي." },
      en: { title: "Ramadan is coming: how many hours and days fit the law? 🌙", excerpt: "Try the weekly hours calculator and see the total against the legal limit." },
    },
    load: (lang) => storyArticle("ramadan-working-hours-saudi-attendance", lang),
  },
  {
    slug: "annual-leave-days-saudi-calculator",
    seoKey: "hrBlogLeave",
    category: "people",
    sourcePath: "/services/attendance-performance",
    custom: true,
    teaser: {
      ar: { title: "إجازتك السنوية كم يوم بالضبط؟ 🏖️", excerpt: "٢١ يومًا أو ٣٠.. حرّك الشريط وشف الحد الأدنى بحسب سنوات خدمتك." },
      en: { title: "How many annual leave days exactly? 🏖️", excerpt: "21 or 30... slide to see the minimum for your years of service." },
    },
    load: (lang) => storyArticle("annual-leave-days-saudi-calculator", lang),
  },
  {
    slug: "read-attendance-signals-fairly-saudi",
    seoKey: "hrBlogSignals",
    category: "people",
    sourcePath: "/services/employee-rewards",
    custom: true,
    teaser: {
      ar: { title: "التأخير مو حكم.. اقرأ الإشارة قبل لا تقرر 💓", excerpt: "أسئلة تسألها أولًا، وخطوة عادلة بعدها." },
      en: { title: "Lateness isn't a verdict: read the signal before you decide 💓", excerpt: "Questions to ask first, then a fair next step." },
    },
    load: (lang) => storyArticle("read-attendance-signals-fairly-saudi", lang),
  },
  {
    slug: "ai-hr-small-steps-saudi-teams",
    seoKey: "hrBlogAiSteps",
    category: "ai",
    sourcePath: "/services/ai-hr",
    custom: true,
    teaser: {
      ar: { title: "الذكاء الاصطناعي ما يحتاج مشروع ضخم.. ابدأ بدرجة وحدة 🪜", excerpt: "من أول تجربة إلى استخدام يومي بثقة." },
      en: { title: "AI doesn't need a giant project: start with one rung 🪜", excerpt: "From a first trial to confident daily use." },
    },
    load: (lang) => storyArticle("ai-hr-small-steps-saudi-teams", lang),
  },
  {
    slug: "end-of-service-benefits-calculator-saudi",
    seoKey: "hrBlogEosb",
    category: "payroll",
    sourcePath: "/services/payroll-inputs",
    custom: true,
    teaser: {
      ar: { title: "مكافأة نهاية الخدمة.. احسبها قبل لا يسألك أحد 🏁", excerpt: "نصف شهر عن كل سنة ثم شهر كامل. أدخل الراتب والسنوات وشف الناتج." },
      en: { title: "End-of-service award: work it out before anyone asks 🏁", excerpt: "Half a month per year, then a full month. Enter the wage and years and see the result." },
    },
    load: (lang) => storyArticle("end-of-service-benefits-calculator-saudi", lang),
  },
  {
    slug: "sick-leave-pay-saudi-labor-law",
    seoKey: "hrBlogSick",
    category: "people",
    sourcePath: "/services/attendance-performance",
    custom: true,
    teaser: {
      ar: { title: "الإجازة المرضية.. كم يُدفع لك فعلًا؟ 🩺", excerpt: "٣٠ يومًا بأجر كامل ثم ٦٠ بثلاثة أرباع. حرّك الأيام وشف." },
      en: { title: "Sick leave: how much are you actually paid? 🩺", excerpt: "30 days on full pay, then 60 at three quarters. Move the days and see." },
    },
    load: (lang) => storyArticle("sick-leave-pay-saudi-labor-law", lang),
  },
];

export function readMinutes(article: Article, extra: string[] = []): number {
  const words = [
    ...extra,
    article.intro,
    ...article.blocks.flatMap((b) => [b.heading, ...(b.paragraphs ?? []), ...(b.items ?? []).flatMap((i) => [i.title, i.text])]),
    ...(article.faqs ?? []).flatMap((f) => [f.q, f.a]),
  ].join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export type Details = { kicker: string; updated?: string; tldr?: string; related?: string[]; sources?: { label: string; url: string }[]; sections: { h: string; p: string }[]; faqs: { q: string; a: string }[] };
/** Full, indexable explanation shown under each designed story (also used by the prerender script). */
export const getDetails = (slug: string, lang: Lang): Details | undefined =>
  (detailsData as Record<string, Record<Lang, Details>>)[slug]?.[lang];
