import { Fingerprint, CalendarCheck, Bot, Activity, Gift, BarChart3, ListChecks, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    title: "Our Services",
    subtitle: "Smart HR solutions that help you manage your team with ease and clarity.",
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
        desc: "Understands employees and managers in Saudi dialect and answers questions and requests.",
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
    title: "خدماتنا",
    subtitle: "حلول موارد بشرية ذكية تساعدك تدير فريقك بسهولة ووضوح.",
    comingSoon: "قريباً",
    cards: [
      {
        name: "الحضور والانصراف",
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

const cardMeta: { image: string; icon: typeof Fingerprint }[] = [
  { image: "/images/services/attendance.png", icon: Fingerprint },
  { image: "/images/services/self-service-v2.png", icon: CalendarCheck },
  { image: "/images/services/ai-assistant.png", icon: Bot },
  { image: "/images/services/performance.png", icon: Activity },
  { image: "/images/services/rewards-v2.png", icon: Gift },
  { image: "/images/services/reports.png", icon: BarChart3 },
  { image: "/images/services/tasks.png", icon: ListChecks },
];

export function Services() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-blue-50/60 via-white to-white scroll-mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={28} className="text-blue-400" />
            <h2 className="text-4xl md:text-5xl font-heading font-black text-gradient-primary leading-tight">
              {t.title}
            </h2>
          </div>

          <p className="text-lg text-slate-500 leading-relaxed font-medium">{t.subtitle}</p>
        </div>

        {/* Compact service cards */}
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-5">
          {t.cards.map((card, idx) => {
            const meta = cardMeta[idx];
            const Icon = meta.icon;
            const soon = "soon" in card && card.soon;
            return (
              <div
                key={card.name}
                className={`relative w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] rounded-3xl border bg-gradient-to-b from-white to-blue-50/50 p-6 pt-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  soon ? "border-dashed border-slate-200" : "border-slate-100 shadow-sm hover:border-blue-200"
                }`}
              >
                {soon && (
                  <span className="absolute top-4 end-4 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                    {t.comingSoon}
                  </span>
                )}

                {/* 3D icon */}
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <div className="absolute inset-2 rounded-full bg-blue-100/60 blur-xl" />
                  <img
                    src={meta.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="relative w-full h-full object-contain drop-shadow-md"
                  />
                </div>

                {/* Small icon badge + title */}
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-blue-600" />
                  </span>
                  <h3 className="text-base font-heading font-black text-slate-900">{card.name}</h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
