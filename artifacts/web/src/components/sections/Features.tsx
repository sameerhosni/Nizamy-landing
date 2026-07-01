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
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const moduleIcons = [Clock, Target, UserCircle, Banknote, UserPlus, CalendarCheck, ShieldCheck, BarChart3];

const moduleColors = [
  { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-100"    },
  { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-100"   },
  { bg: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-100"  },
  { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  { bg: "bg-sky-50",     text: "text-sky-600",     ring: "ring-sky-100"     },
  { bg: "bg-teal-50",    text: "text-teal-600",    ring: "ring-teal-100"    },
  { bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-100"    },
  { bg: "bg-indigo-50",  text: "text-indigo-600",  ring: "ring-indigo-100"  },
];

const content = {
  en: {
    eyebrow: "The Platform",
    title: "How each module closes the gap",
    subtitle: "Eight modules. One objective: turn your HR spend into a measurable return.",
    howLabel: "How it works",
    returnsLabel: "The return",
    modules: [
      {
        name: "Attendance & Time",
        how: "Employees clock in via mobile app or biometric device. Every check-in flows directly into payroll — no manual reconciliation, no data re-entry.",
        returns: "Eliminates payroll errors from missed or wrong punches. Every minute tracked accurately means every riyal paid correctly.",
      },
      {
        name: "Incentives & KPIs",
        how: "Set goals, run structured review cycles, and link performance outcomes to rewards — all inside one system, with no spreadsheets.",
        returns: "Drives results without adding admin overhead. No manual bonus calculations, no separate tools, no HR time wasted on reviews.",
      },
      {
        name: "AI Self-Service",
        how: "Employees update their own data, view payslips, and request HR documents through a conversational AI interface — without waiting for HR.",
        returns: "Cuts the HR queue to zero. Your team handles strategy, not repetitive employee requests.",
      },
      {
        name: "Payroll & WPS",
        how: "Payroll runs automatically using time and attendance data. WPS files are generated and submitted to SAMA each month without manual steps.",
        returns: "No late penalties. No manual errors. No dedicated payroll clerk needed for routine processing.",
      },
      {
        name: "Digital Onboarding",
        how: "New hires complete contracts, data collection, and documentation in a fully digital flow — from offer to first day in under two minutes.",
        returns: "Productive from day one. No paper, no chasing signatures, no HR time spent on admin before the first shift.",
      },
      {
        name: "Leave & Absence",
        how: "Employees request leave digitally. Managers approve in one tap. Balances update automatically and sync directly to payroll.",
        returns: "Zero leave disputes. Accurate deductions without manual cross-checking or end-of-month reconciliation.",
      },
      {
        name: "GOSI & HRDF",
        how: "Contributions are calculated automatically from salary and employee data, then submitted to the relevant authorities each month.",
        returns: "No late-filing penalties. No consultant fees. Compliance handled without lifting a finger.",
      },
      {
        name: "HR Analytics",
        how: "Live dashboards aggregate attendance, headcount, turnover, and cost data in real time — accessible to managers without needing IT.",
        returns: "Spot cost leaks before they grow. Make workforce decisions with data, not gut feeling.",
      },
    ],
  },
  ar: {
    eyebrow: "المنصة",
    title: "كيف تُغلق كل وحدة الفجوة",
    subtitle: "ثماني وحدات. هدف واحد: تحويل إنفاقك على الموارد البشرية إلى عائد قابل للقياس.",
    howLabel: "كيف تعمل",
    returnsLabel: "العائد",
    modules: [
      {
        name: "الحضور والوقت",
        how: "يسجّل الموظفون حضورهم عبر التطبيق أو البصمة. كل تسجيل يتدفق مباشرة إلى الرواتب — دون مطابقة يدوية أو إدخال بيانات مكرر.",
        returns: "يلغي أخطاء الرواتب الناجمة عن التسجيل الخاطئ. كل دقيقة تُتتبع بدقة تعني كل ريال يُصرف بشكل صحيح.",
      },
      {
        name: "الحوافز ومؤشرات الإنجاز",
        how: "ضع الأهداف، وأدِر دورات تقييم منظمة، واربط نتائج الأداء بالمكافآت — كل ذلك داخل منصة واحدة دون جداول بيانات.",
        returns: "يحقق نتائج دون إضافة عبء إداري. لا حسابات مكافآت يدوية، لا أدوات منفصلة.",
      },
      {
        name: "الخدمة الذاتية بالذكاء الاصطناعي",
        how: "يحدث الموظفون بياناتهم ويطلعون على قسائم الراتب ويطلبون مستندات الموارد البشرية عبر واجهة ذكاء اصطناعي — دون انتظار.",
        returns: "يلغي طابور الموارد البشرية كلياً. فريقك يركز على الاستراتيجية، لا على الطلبات المتكررة.",
      },
      {
        name: "الرواتب ونظام حماية الأجور",
        how: "تُعالَج الرواتب تلقائياً باستخدام بيانات الحضور. تُولَّد ملفات WPS وتُرسَل إلى ساما شهرياً دون خطوات يدوية.",
        returns: "لا غرامات تأخير. لا أخطاء يدوية. لا حاجة لمحاسب مخصص للمعالجة الاعتيادية.",
      },
      {
        name: "الإعداد الرقمي للموظف",
        how: "يُكمل الموظف الجديد عقوده وإدخال بياناته والتوثيق في مسار رقمي متكامل — من العرض حتى اليوم الأول في أقل من دقيقتين.",
        returns: "منتج من اليوم الأول. لا أوراق، لا ملاحقة للتوقيعات، لا وقت موارد بشرية يُهدَر في الإجراءات.",
      },
      {
        name: "الإجازات والغياب",
        how: "يطلب الموظفون الإجازة رقمياً. يوافق المديرون بنقرة. تُحدَّث الأرصدة تلقائياً وتُزامَن مباشرة مع الرواتب.",
        returns: "لا نزاعات إجازات. استقطاعات دقيقة دون مطابقة يدوية في نهاية الشهر.",
      },
      {
        name: "التأمينات الاجتماعية وهدف",
        how: "تُحتسب الاشتراكات تلقائياً من بيانات الراتب والموظف، ثم تُودَع لدى الجهات المعنية كل شهر.",
        returns: "لا غرامات تأخير. لا رسوم استشارية. الامتثال يسير من تلقاء نفسه.",
      },
      {
        name: "تحليلات الموارد البشرية",
        how: "لوحات معلومات حية تجمع بيانات الحضور والقوى العاملة والتكاليف فورياً — يصل إليها المديرون مباشرة دون الحاجة لتقنية معلومات.",
        returns: "اكتشف تسرب التكاليف قبل أن يتفاقم. اتخذ قرارات القوى العاملة بالبيانات لا بالحدس.",
      },
    ],
  },
};

export function Features() {
  const { language } = useLanguage();
  const t = content[language];
  const [active, setActive] = useState(0);

  const ActiveIcon = moduleIcons[active];
  const activeColor = moduleColors[active];
  const activeModule = t.modules[active];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full mb-4">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Mobile: horizontal scrollable tab bar */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden">
            {t.modules.map((mod, idx) => {
              const Icon = moduleIcons[idx];
              const c = moduleColors[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                    active === idx
                      ? `${c.bg} ${c.text} ring-1 ${c.ring}`
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {mod.name}
                </button>
              );
            })}
          </div>

          {/* Desktop: sidebar + detail panel */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-6 items-start">
            {/* Sidebar */}
            <div className="hidden lg:flex flex-col gap-0.5">
              {t.modules.map((mod, idx) => {
                const Icon = moduleIcons[idx];
                const c = moduleColors[idx];
                const isActive = active === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-start transition-all ${
                      isActive
                        ? `${c.bg} ${c.text} font-semibold`
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? `${c.text} bg-white/70` : "bg-muted"
                    }`}>
                      <Icon size={13} />
                    </div>
                    <span className="leading-snug">{mod.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 md:p-10 min-h-[340px]">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ring-1 ${activeColor.bg} ${activeColor.ring}`}>
                <ActiveIcon size={28} className={activeColor.text} />
              </div>

              {/* Module name */}
              <h3 className="text-2xl font-bold text-foreground mb-6">{activeModule.name}</h3>

              {/* How it works */}
              <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  {t.howLabel}
                </div>
                <p className="text-foreground leading-relaxed">{activeModule.how}</p>
              </div>

              {/* The return */}
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  {t.returnsLabel}
                </div>
                <p className="text-foreground leading-relaxed">{activeModule.returns}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
