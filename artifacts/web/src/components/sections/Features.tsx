import { useState } from "react";
import {
  Clock,
  Target,
  Bot,
  UserCog,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const moduleIcons = [Clock, Target, Bot, UserCog, BarChart3];

const moduleColors = [
  { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-500"    },
  { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-500"   },
  { bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-500"  },
  { bg: "bg-sky-50",     text: "text-sky-600",     dot: "bg-sky-500"     },
  { bg: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-500"  },
];

const content = {
  en: {
    eyebrow: "The Platform",
    title: "Every module. One direction.",
    subtitle: "Five focused modules, each engineered to eliminate a specific source of HR waste and turn it into a measurable return.",
    howLabel: "How it works",
    returnsLabel: "The return",
    modules: [
      {
        name: "Attendance & Time",
        tagline: "No more manual timesheets.",
        how: "Employees clock in via mobile app or biometric device. Every check-in flows directly into payroll — no manual reconciliation, no data re-entry.",
        returns: "Eliminates payroll errors from missed or wrong punches. Every minute tracked accurately means every riyal paid correctly.",
      },
      {
        name: "Incentives & Success KPIs",
        tagline: "Performance tied to results, not paperwork.",
        how: "Set goals, run structured review cycles, and link performance outcomes directly to rewards — all inside one system, with no spreadsheets.",
        returns: "Drives results without adding admin overhead. No manual bonus calculations, no separate tools, no HR time wasted on review cycles.",
      },
      {
        name: "AI Self-Service",
        tagline: "HR queue reduced to zero.",
        how: "A conversational AI handles employee requests around the clock — payslip queries, document requests, policy questions — without involving HR.",
        returns: "Your HR team handles strategy, not a queue. The AI resolves repetitive requests instantly, at any hour.",
      },
      {
        name: "Employee Self-Service",
        tagline: "Every employee, fully in control.",
        how: "Employees update their own data, view leave balances, access payslips, and submit requests through a clean self-service dashboard — no paper, no waiting.",
        returns: "HR spends less time on routine admin. Employees get instant answers without chasing anyone.",
      },
      {
        name: "HR Analytics",
        tagline: "See costs before they grow.",
        how: "Live dashboards aggregate attendance, headcount, turnover, and cost data in real time — accessible to managers without needing IT.",
        returns: "Spot cost leaks before they grow. Make workforce decisions with data, not gut feeling.",
      },
    ],
  },
  ar: {
    eyebrow: "المنصة",
    title: "كل وحدة. اتجاه واحد.",
    subtitle: "خمس وحدات مركّزة، كل منها مُصمَّمة للقضاء على مصدر محدد من مصادر هدر الموارد البشرية وتحويله إلى عائد قابل للقياس.",
    howLabel: "كيف تعمل",
    returnsLabel: "العائد",
    modules: [
      {
        name: "الحضور والانصراف",
        tagline: "لا مزيد من الجداول اليدوية.",
        how: "يسجّل الموظفون حضورهم عبر التطبيق أو البصمة. كل تسجيل يتدفق مباشرة إلى الرواتب — دون مطابقة يدوية أو إدخال بيانات مكرر.",
        returns: "يلغي أخطاء الرواتب الناجمة عن التسجيل الخاطئ. كل دقيقة تُتتبع بدقة تعني كل ريال يُصرف بشكل صحيح.",
      },
      {
        name: "الحوافز ومؤشرات النجاح",
        tagline: "الأداء مرتبط بالنتائج لا بالأوراق.",
        how: "ضع الأهداف، وأدِر دورات تقييم منظمة، واربط نتائج الأداء بالمكافآت مباشرة — كل ذلك داخل منصة واحدة دون جداول بيانات.",
        returns: "يحقق نتائج دون إضافة عبء إداري. لا حسابات مكافآت يدوية، لا أدوات منفصلة، لا وقت موارد بشرية يُهدَر في دورات التقييم.",
      },
      {
        name: "الخدمات الذاتية بالذكاء الاصطناعي",
        tagline: "طابور الموارد البشرية وصل الصفر.",
        how: "يتولى الذكاء الاصطناعي معالجة طلبات الموظفين على مدار الساعة — استفسارات الراتب، طلبات المستندات، أسئلة السياسات — دون الحاجة لتدخل الموارد البشرية.",
        returns: "فريق الموارد البشرية يركز على الاستراتيجية لا على الطابور. الذكاء الاصطناعي يحسم الطلبات المتكررة فورياً، في أي وقت.",
      },
      {
        name: "الخدمات الذاتية",
        tagline: "كل موظف في تحكم كامل.",
        how: "يحدّث الموظفون بياناتهم، ويطلعون على أرصدة إجازاتهم، ويصلون إلى قسائم رواتبهم، ويقدمون طلباتهم عبر لوحة خدمة ذاتية واضحة — دون أوراق أو انتظار.",
        returns: "تقضي الموارد البشرية وقتاً أقل في الإدارة الاعتيادية. يحصل الموظفون على إجاباتهم فوراً دون ملاحقة أحد.",
      },
      {
        name: "تحليلات الموارد البشرية",
        tagline: "شاهد التكاليف قبل أن تتفاقم.",
        how: "لوحات معلومات حية تجمع بيانات الحضور والقوى العاملة والتكاليف فورياً — يصل إليها المديرون مباشرة دون الحاجة لتقنية معلومات.",
        returns: "اكتشف تسرب التكاليف قبل أن يتفاقم. اتخذ قرارات القوى العاملة بالبيانات لا بالحدس.",
      },
    ],
  },
};

export function Features() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const t = content[language];
  const [active, setActive] = useState(0);

  const ActiveIcon = moduleIcons[active];
  const activeColor = moduleColors[active];
  const activeModule = t.modules[active];

  return (
    <section className="py-24 bg-[#F8F9FE] border-y border-border/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full mb-4">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Mobile: horizontal scrollable tab bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 lg:hidden">
            {t.modules.map((mod, idx) => {
              const Icon = moduleIcons[idx];
              const c = moduleColors[idx];
              const isActive = active === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? `${c.bg} ${c.text} shadow-sm`
                      : "bg-white border border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {mod.name}
                </button>
              );
            })}
          </div>

          {/* Desktop: sidebar + detail panel */}
          <div className="grid lg:grid-cols-[260px_1fr] gap-4 items-start">
            {/* Sidebar */}
            <div className="hidden lg:flex flex-col gap-1 bg-white rounded-2xl border border-border/40 p-2 shadow-sm">
              {t.modules.map((mod, idx) => {
                const Icon = moduleIcons[idx];
                const c = moduleColors[idx];
                const isActive = active === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-start transition-all duration-150 group ${
                      isActive
                        ? `${c.bg} ${c.text} font-semibold shadow-sm`
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute ${isRtl ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 w-1 h-6 rounded-full ${c.dot}`} />
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive ? "bg-white shadow-sm" : "bg-muted group-hover:bg-white"
                    }`}>
                      <Icon size={16} className={isActive ? c.text : "text-muted-foreground"} />
                    </div>
                    <span className={`leading-snug ${isRtl ? "pe-2" : "ps-2"}`}>
                      {mod.name}
                    </span>
                    {isActive && (
                      <ArrowRight
                        size={14}
                        className={`ms-auto shrink-0 opacity-60 ${isRtl ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detail panel — dark */}
            <div className="bg-[#0A0B14] rounded-2xl p-8 md:p-10 min-h-[380px] border border-white/[0.08] relative overflow-hidden">
              <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-48 h-48 blur-[80px] rounded-full opacity-25 ${activeColor.dot}`} />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${activeColor.bg}`}>
                    <ActiveIcon size={30} className={activeColor.text} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-white mb-1">{activeModule.name}</h3>
                    <p className={`text-sm font-medium ${activeColor.text}`}>{activeModule.tagline}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                    {t.howLabel}
                  </div>
                  <p className="text-white/70 leading-relaxed text-[15px]">{activeModule.how}</p>
                </div>

                <div className="relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-indigo-500/10" />
                  <div className="absolute inset-0 border border-white/10 rounded-xl" />
                  <div className="relative p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-orange-400 to-indigo-500" />
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/50">
                        {t.returnsLabel}
                      </div>
                    </div>
                    <p className="text-white font-medium leading-relaxed">{activeModule.returns}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
