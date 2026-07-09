import { Fingerprint, CalendarCheck, Bot, Activity, Gift, BarChart3, ListChecks } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "What Mr-Hr Helps You Manage",
    titlePart1: "A practical HR system ",
    titlePart2: "for your daily operations.",
    subtitle: "Attendance, employee services, performance, rewards, and insights — everything a Saudi business needs to run its team, in one place.",
    comingSoon: "Coming soon",
    cards: [
      {
        name: "Attendance & Time Tracking",
        desc: "Record attendance with trusted verification — location, face, fingerprint, or voice.",
      },
      {
        name: "Employee Self-Service",
        desc: "Leave, permissions, shift swaps, and daily requests — all from one place.",
      },
      {
        name: "Smart HR Assistant",
        desc: "An assistant that understands employees and managers in Saudi dialect and answers questions and requests.",
      },
      {
        name: "Performance & Commitment",
        desc: "Track working hours, commitment, attendance, and team KPIs with clarity.",
      },
      {
        name: "Rewards & Motivation",
        desc: "Motivate employees with points, recognition, gift cards, and rewards.",
      },
      {
        name: "Smart Reports & Summaries",
        desc: "Reports that help management understand team performance and decide faster.",
      },
      {
        name: "Task Tracking",
        desc: "AI-powered task management and follow-up, coming as part of the next product phase.",
        soon: true,
      },
    ],
  },
  ar: {
    eyebrow: "وش يساعدك مستر إتش آر تدير",
    titlePart1: "نظام موارد بشرية عملي ",
    titlePart2: "لعملياتك اليومية.",
    subtitle: "الحضور، خدمات الموظفين، الأداء، المكافآت، والتقارير — كل ما تحتاجه منشأتك السعودية لإدارة فريقها، في مكان واحد.",
    comingSoon: "قريباً",
    cards: [
      {
        name: "إدارة الحضور والانصراف",
        desc: "سجّل حضور الموظفين بطرق تحقق موثوقة مثل الموقع، الوجه، البصمة، أو الصوت.",
      },
      {
        name: "خدمات الموظفين الذاتية",
        desc: "الإجازات، الاستئذان، تبديل الشفتات، والطلبات اليومية من مكان واحد.",
      },
      {
        name: "مساعد موارد بشرية ذكي",
        desc: "مساعد يفهم الموظفين والمدراء باللهجة السعودية ويجاوب على الأسئلة والطلبات.",
      },
      {
        name: "متابعة الأداء والالتزام",
        desc: "تابع ساعات العمل، الالتزام، الحضور، ومؤشرات أداء الفريق بوضوح.",
      },
      {
        name: "المكافآت والتحفيز",
        desc: "حفّز الموظفين بالنقاط، التقدير، بطاقات الهدايا، والمكافآت.",
      },
      {
        name: "تقارير وملخصات ذكية",
        desc: "تقارير تساعد الإدارة تفهم أداء الفريق وتتخذ قرارات أسرع.",
      },
      {
        name: "متابعة المهام",
        desc: "إدارة ومتابعة المهام بالذكاء الاصطناعي كجزء من تطوير المنتج القادم.",
        soon: true,
      },
    ],
  },
};

const icons = [
  { icon: Fingerprint, bg: "bg-blue-100", color: "text-blue-600" },
  { icon: CalendarCheck, bg: "bg-sky-100", color: "text-sky-600" },
  { icon: Bot, bg: "bg-indigo-100", color: "text-indigo-600" },
  { icon: Activity, bg: "bg-cyan-100", color: "text-cyan-600" },
  { icon: Gift, bg: "bg-violet-100", color: "text-violet-600" },
  { icon: BarChart3, bg: "bg-blue-100", color: "text-blue-600" },
  { icon: ListChecks, bg: "bg-slate-100", color: "text-slate-500" },
];

export function Services() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="services" className="py-24 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-black leading-tight mb-6">
            <span className="text-slate-900">{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">{t.subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.cards.map((card, idx) => {
            const { icon: Icon, bg, color } = icons[idx];
            const soon = "soon" in card && card.soon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  soon ? "border-dashed border-slate-200" : "border-slate-100 shadow-sm hover:border-blue-200"
                }`}
              >
                {soon && (
                  <span className="absolute top-4 end-4 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                    {t.comingSoon}
                  </span>
                )}
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="text-lg font-heading font-black text-slate-900 mb-2">{card.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
