import { useState } from "react";
import {
  Clock,
  Target,
  UserCircle,
  Banknote,
  UserPlus,
  CalendarCheck,
  ShieldCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const moduleIcons = [Clock, Target, UserCircle, Banknote, UserPlus, CalendarCheck, ShieldCheck, BarChart3];

const moduleColors = [
  { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-500"    },
  { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-500"   },
  { bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-500"  },
  { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  { bg: "bg-sky-50",     text: "text-sky-600",     dot: "bg-sky-500"     },
  { bg: "bg-teal-50",    text: "text-teal-600",    dot: "bg-teal-500"    },
  { bg: "bg-rose-50",    text: "text-rose-600",    dot: "bg-rose-500"    },
  { bg: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-500"  },
];

const content = {
  en: {
    eyebrow: "The Platform",
    title: "Every module. One direction.",
    subtitle: "Eight focused modules, each engineered to eliminate a specific source of HR waste.",
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
        name: "Incentives & KPIs",
        tagline: "Performance tied to results, not paperwork.",
        how: "Set goals, run structured review cycles, and link performance outcomes to rewards — all inside one system, with no spreadsheets.",
        returns: "Drives results without adding admin overhead. No manual bonus calculations, no separate tools, no HR time wasted on reviews.",
      },
      {
        name: "AI Self-Service",
        tagline: "HR queue reduced to zero.",
        how: "Employees update their own data, view payslips, and request HR documents through a conversational AI interface — without waiting for HR.",
        returns: "Cuts the HR queue to zero. Your team handles strategy, not repetitive employee requests.",
      },
      {
        name: "Payroll & WPS",
        tagline: "SAMA-compliant. Autopilot.",
        how: "Payroll runs automatically using time and attendance data. WPS files are generated and submitted to SAMA each month without manual steps.",
        returns: "No late penalties. No manual errors. No dedicated payroll clerk needed for routine processing.",
      },
      {
        name: "Digital Onboarding",
        tagline: "From offer to productive in two minutes.",
        how: "New hires complete contracts, data collection, and documentation in a fully digital flow — from offer to first day in under two minutes.",
        returns: "Productive from day one. No paper, no chasing signatures, no HR time spent on admin before the first shift.",
      },
      {
        name: "Leave & Absence",
        tagline: "Zero leave disputes.",
        how: "Employees request leave digitally. Managers approve in one tap. Balances update automatically and sync directly to payroll.",
        returns: "Zero leave disputes. Accurate deductions without manual cross-checking or end-of-month reconciliation.",
      },
      {
        name: "GOSI & HRDF",
        tagline: "Compliance without consultants.",
        how: "Contributions are calculated automatically from salary and employee data, then submitted to the relevant authorities each month.",
        returns: "No late-filing penalties. No consultant fees. Compliance handled without lifting a finger.",
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
    subtitle: "ثماني وحدات مركّزة، كل منها مُصمَّمة للقضاء على مصدر محدد من مصادر هدر الموارد البشرية.",
    howLabel: "كيف تعمل",
    returnsLabel: "العائد",
    modules: [
      {
        name: "الحضور والوقت",
        tagline: "لا مزيد من الجداول اليدوية.",
        how: "يسجّل الموظفون حضورهم عبر التطبيق أو البصمة. كل تسجيل يتدفق مباشرة إلى الرواتب — دون مطابقة يدوية أو إدخال بيانات مكرر.",
        returns: "يلغي أخطاء الرواتب الناجمة عن التسجيل الخاطئ. كل دقيقة تُتتبع بدقة تعني كل ريال يُصرف بشكل صحيح.",
      },
      {
        name: "الحوافز ومؤشرات الإنجاز",
        tagline: "الأداء مرتبط بالنتائج لا بالأوراق.",
        how: "ضع الأهداف، وأدِر دورات تقييم منظمة، واربط نتائج الأداء بالمكافآت — كل ذلك داخل منصة واحدة دون جداول بيانات.",
        returns: "يحقق نتائج دون إضافة عبء إداري. لا حسابات مكافآت يدوية، لا أدوات منفصلة.",
      },
      {
        name: "الخدمة الذاتية بالذكاء الاصطناعي",
        tagline: "طابور الموارد البشرية وصل الصفر.",
        how: "يحدث الموظفون بياناتهم ويطلعون على قسائم الراتب ويطلبون مستندات الموارد البشرية عبر واجهة ذكاء اصطناعي — دون انتظار.",
        returns: "يلغي طابور الموارد البشرية كلياً. فريقك يركز على الاستراتيجية، لا على الطلبات المتكررة.",
      },
      {
        name: "الرواتب ونظام حماية الأجور",
        tagline: "متوافق مع ساما. تلقائي بالكامل.",
        how: "تُعالَج الرواتب تلقائياً باستخدام بيانات الحضور. تُولَّد ملفات WPS وتُرسَل إلى ساما شهرياً دون خطوات يدوية.",
        returns: "لا غرامات تأخير. لا أخطاء يدوية. لا حاجة لمحاسب مخصص للمعالجة الاعتيادية.",
      },
      {
        name: "الإعداد الرقمي للموظف",
        tagline: "من العرض إلى الإنتاجية في دقيقتين.",
        how: "يُكمل الموظف الجديد عقوده وإدخال بياناته والتوثيق في مسار رقمي متكامل — من العرض حتى اليوم الأول في أقل من دقيقتين.",
        returns: "منتج من اليوم الأول. لا أوراق، لا ملاحقة للتوقيعات، لا وقت موارد بشرية يُهدَر في الإجراءات.",
      },
      {
        name: "الإجازات والغياب",
        tagline: "صفر نزاعات إجازات.",
        how: "يطلب الموظفون الإجازة رقمياً. يوافق المديرون بنقرة. تُحدَّث الأرصدة تلقائياً وتُزامَن مباشرة مع الرواتب.",
        returns: "لا نزاعات إجازات. استقطاعات دقيقة دون مطابقة يدوية في نهاية الشهر.",
      },
      {
        name: "التأمينات الاجتماعية وهدف",
        tagline: "امتثال بلا استشاريين.",
        how: "تُحتسب الاشتراكات تلقائياً من بيانات الراتب والموظف، ثم تُودَع لدى الجهات المعنية كل شهر.",
        returns: "لا غرامات تأخير. لا رسوم استشارية. الامتثال يسير من تلقاء نفسه.",
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
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className={`absolute ${isRtl ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 w-1 h-6 rounded-full ${c.dot}`} />
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive ? "bg-white shadow-sm" : "bg-muted group-hover:bg-white"
                    }`}>
                      <Icon size={16} className={isActive ? c.text : "text-muted-foreground"} />
                    </div>
                    <span className={`leading-snug ${isActive ? "" : ""} ${isRtl ? "pe-2" : "ps-2"}`}>
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
              {/* Subtle glow behind icon */}
              <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-48 h-48 blur-[80px] rounded-full opacity-30 ${activeColor.dot}`} />

              <div className="relative z-10">
                {/* Icon + tagline */}
                <div className="flex items-start gap-4 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${activeColor.bg}`}>
                    <ActiveIcon size={30} className={activeColor.text} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-white mb-1">{activeModule.name}</h3>
                    <p className={`text-sm font-medium ${activeColor.text}`}>{activeModule.tagline}</p>
                  </div>
                </div>

                {/* How it works */}
                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                    {t.howLabel}
                  </div>
                  <p className="text-white/70 leading-relaxed text-[15px]">{activeModule.how}</p>
                </div>

                {/* The return — prominent */}
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
