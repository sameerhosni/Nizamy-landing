import { Fingerprint, CalendarCheck, Bot, Activity, Gift, BarChart3, ListChecks } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "What We Manage",
    title: "Everything your HR team handles — automated.",
    subtitle: "Seven modules that cover the full employee lifecycle, from first check-in to performance rewards.",
    comingSoon: "Coming soon",
    cards: [
      { name: "Attendance & Time Tracking", desc: "Verified check-in via face, fingerprint, or voice — accurate and fraud-proof." },
      { name: "Employee Self-Service", desc: "Leave, permissions, shift swaps — handled by an AI assistant, no HR middleman." },
      { name: "Smart HR Assistant", desc: "Speaks Saudi dialect. Answers payslip, document, and policy questions 24/7." },
      { name: "Performance & Commitment", desc: "Track hours, KPIs, and commitment rates across your entire team." },
      { name: "Rewards & Motivation", desc: "Points, recognition, and gift cards that make good performance worth pursuing." },
      { name: "Smart Reports", desc: "Reports that surface what's really happening — not just what you asked for." },
      { name: "Task Tracking", desc: "AI-powered task management and follow-up, part of the next product phase.", soon: true },
    ],
  },
  ar: {
    eyebrow: "خدمات النظام",
    title: "كل ما تديره فرق الموارد البشرية — مؤتمت.",
    subtitle: "سبع وحدات تغطي دورة حياة الموظف بالكامل، من أول حضور حتى مكافآت الأداء.",
    comingSoon: "قريباً",
    cards: [
      { name: "الحضور والانصراف", desc: "تحقق موثّق عبر الوجه أو البصمة أو الصوت — دقيق ويصعب التلاعب به." },
      { name: "خدمات الموظفين الذاتية", desc: "الإجازات والتصاريح وتبديل الشفتات — يديرها مساعد ذكاء اصطناعي بلا وسيط." },
      { name: "مساعد موارد بشرية ذكي", desc: "يفهم اللهجة السعودية ويجاوب على أسئلة الراتب والمستندات والسياسات طوال اليوم." },
      { name: "متابعة الأداء والالتزام", desc: "تابع ساعات العمل ومؤشرات الأداء ومعدلات الالتزام لكامل الفريق." },
      { name: "المكافآت والتحفيز", desc: "نقاط وتقدير وبطاقات هدايا تجعل الأداء الجيد يستحق المجهود." },
      { name: "تقارير ذكية", desc: "تقارير تكشف ما يحدث فعلاً — لا فقط ما طلبته." },
      { name: "متابعة المهام", desc: "إدارة ومتابعة المهام بالذكاء الاصطناعي كجزء من تطوير المنتج القادم.", soon: true },
    ],
  },
};

const cardMeta: { image: string; icon: typeof Fingerprint }[] = [
  { image: "/images/services/attendance-v3.png", icon: Fingerprint },
  { image: "/images/services/self-service-v3.png", icon: CalendarCheck },
  { image: "/images/services/ai-assistant-v3.png", icon: Bot },
  { image: "/images/services/performance-v3.png", icon: Activity },
  { image: "/images/services/rewards-v3.png", icon: Gift },
  { image: "/images/services/reports-v3.png", icon: BarChart3 },
  { image: "/images/services/tasks-v3.png", icon: ListChecks },
];

export function Services() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#0a0a0a] scroll-mt-16 overflow-hidden relative">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800/50 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white leading-[1.1] mb-6">
            {t.title}
          </h2>
          <p className="text-lg text-white/40 leading-relaxed font-medium">{t.subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {t.cards.map((card, idx) => {
            const meta = cardMeta[idx];
            const Icon = meta.icon;
            const soon = "soon" in card && card.soon;

            return (
              <div
                key={card.name}
                className={`relative group rounded-2xl p-6 transition-all duration-300 border ${
                  soon
                    ? "border-dashed border-white/10 bg-white/[0.02]"
                    : "border-white/8 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-500/30"
                } ${idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                {soon && (
                  <span className="absolute top-4 end-4 text-[10px] font-bold text-white/30 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                    {t.comingSoon}
                  </span>
                )}

                {/* Icon */}
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl group-hover:bg-blue-600/30 transition-all duration-500" />
                  <img
                    src={meta.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="relative w-full h-full object-contain drop-shadow-lg"
                  />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-md bg-blue-900/60 border border-blue-800/50 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-blue-400" />
                  </span>
                  <h3 className="text-sm font-heading font-black text-white leading-tight">{card.name}</h3>
                </div>

                <p className="text-sm text-white/40 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
