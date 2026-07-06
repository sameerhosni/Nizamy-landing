import { Clock, Target, Bot, UserCog, BarChart3, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const moduleIcons = [Clock, Target, Bot, UserCog, BarChart3];

const moduleColors = [
  { bg: "bg-blue-50",   text: "text-blue-600",   ring: "group-hover:border-blue-200"   },
  { bg: "bg-amber-50",  text: "text-amber-600",  ring: "group-hover:border-amber-200"  },
  { bg: "bg-violet-50", text: "text-violet-600", ring: "group-hover:border-violet-200" },
  { bg: "bg-sky-50",    text: "text-sky-600",    ring: "group-hover:border-sky-200"    },
  { bg: "bg-indigo-50", text: "text-indigo-600", ring: "group-hover:border-indigo-200" },
];

const content = {
  en: {
    eyebrow: "How Mr-Hr Works",
    title: "A performance system first. A return because of it.",
    subtitle: "Five services that make your team sharper, faster, and more engaged. The return is simply what follows when performance improves.",
    modules: [
      {
        name: "Attendance & Time",
        tagline: "No more manual timesheets.",
        desc: "Employees clock in via mobile or biometric device, and every check-in flows straight into payroll — no manual reconciliation, ever.",
        highlight: "Real-time, always accurate",
      },
      {
        name: "Incentives & Success KPIs",
        tagline: "Performance tied to results, not paperwork.",
        desc: "Set goals, run structured review cycles, and link outcomes directly to rewards — all inside one system, no spreadsheets.",
        highlight: "Every win tracked & rewarded",
      },
      {
        name: "AI Self-Service",
        tagline: "HR queue reduced to zero.",
        desc: "A Saudi-dialect AI agent handles payslip questions, document requests, and policy questions around the clock — no HR involved.",
        highlight: "Instant answers, 24/7",
      },
      {
        name: "AI Task Management",
        tagline: "Every task, handled before you ask.",
        desc: "An AI assistant organizes tasks, follows up on approvals, and keeps requests moving — so nothing sits waiting in someone's inbox.",
        highlight: "Work that moves itself",
      },
      {
        name: "HR Analytics",
        tagline: "See performance before it slips.",
        desc: "Live dashboards surface attendance, goals, and engagement in real time, so managers can act early instead of reacting late.",
        highlight: "Trends, not surprises",
      },
    ],
  },
  ar: {
    eyebrow: "كيف يعمل مستر إتش آر",
    title: "نظام لإدارة الأداء أولاً، والعائد نتيجة طبيعية له.",
    subtitle: "خمس خدمات تجعل فريقك أكثر تركيزاً وسرعة وتفاعلاً. أما العائد المالي، فهو ببساطة النتيجة الطبيعية لتحسّن هذا الأداء.",
    modules: [
      {
        name: "الحضور والانصراف",
        tagline: "لا مزيد من الجداول اليدوية.",
        desc: "يسجّل الموظفون حضورهم عبر التطبيق أو البصمة، وكل تسجيل يتدفق مباشرة إلى الرواتب — دون مطابقة يدوية على الإطلاق.",
        highlight: "بيانات لحظية ودقيقة دائماً",
      },
      {
        name: "الحوافز ومؤشرات النجاح",
        tagline: "الأداء مرتبط بالنتائج لا بالأوراق.",
        desc: "ضع الأهداف، وأدِر دورات تقييم منظمة، واربط نتائج الأداء بالمكافآت مباشرة — كل ذلك داخل منصة واحدة دون جداول بيانات.",
        highlight: "كل إنجاز يُرصد ويُكافأ",
      },
      {
        name: "الخدمات الذاتية بالذكاء الاصطناعي",
        tagline: "طابور الموارد البشرية وصل الصفر.",
        desc: "وكيل ذكاء اصطناعي باللهجة السعودية يتولى استفسارات الراتب وطلبات المستندات وأسئلة السياسات على مدار الساعة — دون تدخل الموارد البشرية.",
        highlight: "إجابات فورية على مدار الساعة",
      },
      {
        name: "إدارة المهام بالذكاء الاصطناعي",
        tagline: "كل مهمة تُنجز قبل أن تسأل عنها.",
        desc: "مساعد ذكاء اصطناعي ينظّم المهام، ويتابع الموافقات، ويبقي الطلبات في حركة مستمرة — فلا يبقى شيء عالقاً في صندوق أحد.",
        highlight: "عمل يتحرك من تلقاء نفسه",
      },
      {
        name: "تحليلات الموارد البشرية",
        tagline: "شاهد الأداء قبل أن يتراجع.",
        desc: "لوحات معلومات حية تجمع بيانات الحضور والأهداف والتفاعل فورياً، لتصرّف المديرون مبكراً بدلاً من التأخر في الاستجابة.",
        highlight: "اتجاهات لا مفاجآت",
      },
    ],
  },
};

export function Features() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const t = content[language];

  return (
    <section id="features" className="py-24 bg-white scroll-mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full mb-4">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.modules.map((mod, idx) => {
            const Icon = moduleIcons[idx];
            const c = moduleColors[idx];
            const isFeatured = idx === 0;
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl border border-border/50 bg-[#F8F9FE] p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${c.ring} ${
                  isFeatured ? "md:col-span-2" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${c.bg}`}>
                  <Icon size={22} className={c.text} />
                </div>

                <h3 className="text-xl font-bold mb-1.5">{mod.name}</h3>
                <p className={`text-sm font-semibold mb-3 ${c.text}`}>{mod.tagline}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{mod.desc}</p>

                <div className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground bg-white border border-border/60 rounded-full px-3 py-1.5">
                  <ArrowUpRight size={14} className={`${c.text} ${isRtl ? "rotate-90" : ""}`} />
                  {mod.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
