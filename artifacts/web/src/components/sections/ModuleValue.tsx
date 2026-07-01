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

const content = {
  en: {
    eyebrow: "The Return Breakdown",
    title: "What each module gives back",
    subtitle: "Every feature is built to reduce waste — not add to it.",
    modules: [
      {
        icon: <Clock size={18} />,
        name: "Attendance & Time",
        value: "Eliminates payroll errors from manual tracking. Every check-in reconciled automatically.",
      },
      {
        icon: <Target size={18} />,
        name: "Incentives & KPIs",
        value: "Performance tied to results, not paperwork. No extra admin cost to run a rewards cycle.",
      },
      {
        icon: <UserCircle size={18} />,
        name: "AI Self-Service",
        value: "Employees handle their own HR needs. No queue, no rework, no back-and-forth.",
      },
      {
        icon: <Banknote size={18} />,
        name: "Payroll & WPS",
        value: "Zero WPS penalties. Zero delays. SAMA-compliant payroll on autopilot every month.",
      },
      {
        icon: <UserPlus size={18} />,
        name: "Digital Onboarding",
        value: "New hires productive in minutes, not days. Faster ROI on every hire from day one.",
      },
      {
        icon: <CalendarCheck size={18} />,
        name: "Leave & Absence",
        value: "Accurate deductions, zero disputes. Leave managed digitally without the back-and-forth.",
      },
      {
        icon: <ShieldCheck size={18} />,
        name: "GOSI & HRDF",
        value: "No late-filing penalties. No consultant fees. Contributions calculated and filed automatically.",
      },
      {
        icon: <BarChart3 size={18} />,
        name: "HR Analytics",
        value: "Spot cost leaks before they grow. Real-time clarity on headcount, turnover, and spend.",
      },
    ],
  },
  ar: {
    eyebrow: "تفصيل العائد",
    title: "ما تُعيده كل وحدة",
    subtitle: "كل ميزة مُصمَّمة لتقليل الهدر — لا لإضافته.",
    modules: [
      {
        icon: <Clock size={18} />,
        name: "الحضور والوقت",
        value: "يلغي أخطاء الرواتب الناجمة عن التتبع اليدوي. كل تسجيل حضور يُحتسب تلقائياً.",
      },
      {
        icon: <Target size={18} />,
        name: "الحوافز ومؤشرات الإنجاز",
        value: "الأداء مرتبط بالنتائج لا بالأوراق. لا تكلفة إدارية إضافية لإدارة دورة المكافآت.",
      },
      {
        icon: <UserCircle size={18} />,
        name: "الخدمة الذاتية بالذكاء الاصطناعي",
        value: "الموظف يدير احتياجاته بنفسه. لا طابور انتظار، لا إعادة عمل، لا مراسلات مكررة.",
      },
      {
        icon: <Banknote size={18} />,
        name: "الرواتب ونظام حماية الأجور",
        value: "لا غرامات WPS. لا تأخير في الرواتب. متوافق مع ساما تلقائياً كل شهر.",
      },
      {
        icon: <UserPlus size={18} />,
        name: "الإعداد الرقمي للموظف",
        value: "الموظف الجديد منتج في دقائق لا أيام. وقت توقف أقل وعائد أسرع منذ اليوم الأول.",
      },
      {
        icon: <CalendarCheck size={18} />,
        name: "الإجازات والغياب",
        value: "استقطاعات دقيقة، لا نزاعات. إدارة الإجازات رقمياً بلا ذهاب وإياب.",
      },
      {
        icon: <ShieldCheck size={18} />,
        name: "التأمينات الاجتماعية وهدف",
        value: "لا غرامات تأخير. لا رسوم استشارية. الاشتراكات تُحتسب وتُودَع تلقائياً.",
      },
      {
        icon: <BarChart3 size={18} />,
        name: "تحليلات الموارد البشرية",
        value: "اكتشف تسرب التكاليف قبل أن يتفاقم. وضوح فوري على القوى العاملة والإنفاق.",
      },
    ],
  },
};

export function ModuleValue() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="py-16 bg-muted/40 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full mb-3">
            {t.eyebrow}
          </div>
          <h2 className="text-3xl font-bold leading-tight mb-3">{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
          {t.modules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-accent text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  {mod.icon}
                </div>
                <span className="font-semibold text-sm text-foreground leading-tight">{mod.name}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{mod.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
