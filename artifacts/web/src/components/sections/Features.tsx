import {
  Banknote,
  CalendarCheck,
  Clock,
  UserCircle,
  ShieldCheck,
  Target,
  UserPlus,
  BarChart3,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "The Platform",
    titlePart1: "Full HR operations,",
    titlePart2: " not just a calculator.",
    subtitle:
      "Mr-Hr runs the day-to-day HR work so your team leads can lead — not push paperwork.",
    services: [
      {
        icon: <Banknote size={22} />,
        title: "Payroll & WPS",
        desc: "Automated monthly payroll with SAMA-compliant WPS file generation.",
      },
      {
        icon: <CalendarCheck size={22} />,
        title: "Leave & Absence",
        desc: "Digital leave requests, manager approvals, and balance tracking.",
      },
      {
        icon: <Clock size={22} />,
        title: "Attendance & Time",
        desc: "Mobile or biometric check-in linked directly to payroll.",
      },
      {
        icon: <UserCircle size={22} />,
        title: "Employee Self-Service",
        desc: "Staff update their own data, view payslips, and request documents — no HR queue.",
      },
      {
        icon: <ShieldCheck size={22} />,
        title: "GOSI & HRDF",
        desc: "Automatic contribution calculations and compliance filings, every month.",
      },
      {
        icon: <Target size={22} />,
        title: "Performance & KPIs",
        desc: "Structured review cycles, goal setting, and performance tracking.",
      },
      {
        icon: <UserPlus size={22} />,
        title: "Digital Onboarding",
        desc: "Hire and onboard new employees fully digitally in under two minutes.",
      },
      {
        icon: <BarChart3 size={22} />,
        title: "HR Analytics",
        desc: "Real-time dashboards on headcount, turnover, costs, and compliance status.",
      },
    ],
  },
  ar: {
    eyebrow: "المنصة",
    titlePart1: "عمليات الموارد البشرية الكاملة،",
    titlePart2: " وليس مجرد حاسبة.",
    subtitle:
      "مستر إتش آر يدير العمليات اليومية للموارد البشرية — حتى يتفرغ فريقك لما يهم.",
    services: [
      {
        icon: <Banknote size={22} />,
        title: "الرواتب ونظام حماية الأجور",
        desc: "رواتب شهرية آلية مع توليد ملف WPS المتوافق مع متطلبات ساما.",
      },
      {
        icon: <CalendarCheck size={22} />,
        title: "الإجازات والغياب",
        desc: "طلبات الإجازة الرقمية، موافقة المدير، وتتبع الرصيد في مكان واحد.",
      },
      {
        icon: <Clock size={22} />,
        title: "الحضور والوقت",
        desc: "تسجيل الحضور عبر الجوال أو البصمة مرتبط مباشرة بالراتب.",
      },
      {
        icon: <UserCircle size={22} />,
        title: "الخدمة الذاتية للموظف",
        desc: "الموظف يحدث بياناته وتصفح قسائم الراتب وطلب المستندات دون انتظار.",
      },
      {
        icon: <ShieldCheck size={22} />,
        title: "التأمينات الاجتماعية وهدف",
        desc: "احتساب الاشتراكات تلقائياً والإيداع الإلزامي كل شهر بدون أخطاء.",
      },
      {
        icon: <Target size={22} />,
        title: "الأداء ومؤشرات الإنجاز",
        desc: "دورات تقييم منظمة، وضع الأهداف، ومتابعة الأداء الوظيفي.",
      },
      {
        icon: <UserPlus size={22} />,
        title: "الإعداد الرقمي للموظف",
        desc: "استقطاب وتهيئة الموظفين الجدد رقمياً بالكامل في أقل من دقيقتين.",
      },
      {
        icon: <BarChart3 size={22} />,
        title: "تحليلات الموارد البشرية",
        desc: "لوحات معلومات فورية للقوى العاملة، التكاليف، ووضع الامتثال.",
      },
    ],
  },
};

export function Features() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full mb-4">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl leading-tight mb-4">
            <span className="text-foreground">{t.titlePart1}</span>
            <span className="text-gradient-primary">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden max-w-6xl mx-auto shadow-sm">
          {t.services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-7 hover:bg-accent/30 transition-colors duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                {service.icon}
              </div>
              <h3 className="font-bold text-base mb-2 text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
