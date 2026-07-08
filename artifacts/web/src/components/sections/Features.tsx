import { Fingerprint, Target, Bot, MessageCircle, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "How Mr-Hr Works",
    titlePart1: "A performance system first. ",
    titlePart2: "A return because of it.",
    subtitle: "Six pillars that make your team sharper, faster, and more engaged. The return is simply what follows when performance improves.",
    cards: [
      {
        name: "Saudi-dialect AI Agent",
        desc: "A conversational AI agent that speaks Saudi dialect, answering payslip, document, and policy questions around the clock — no HR involved.",
        featured: true,
      },
      {
        name: "Attendance & Multi-Verification",
        desc: "Fingerprint, face, and voice check-in options — accurate, fraud-proof, and effortless for every employee.",
      },
      {
        name: "Smart Self-Service",
        desc: "Employees handle requests, documents, and approvals themselves — no waiting on HR.",
      },
      {
        name: "Incentives & Performance KPIs",
        desc: "Set goals, run review cycles, and link outcomes directly to rewards — all inside one system.",
      },
      {
        name: "Motivational, not punitive",
        dark: true,
        desc: "Every feature is designed to reward good performance — never to fine or punish your team.",
      },
    ],
  },
  ar: {
    eyebrow: "كيف يعمل مستر إتش آر",
    titlePart1: "نظام لإدارة الأداء أولاً، ",
    titlePart2: "والعائد نتيجة طبيعية.",
    subtitle: "ست ركائز تجعل فريقك أكثر تركيزاً وسرعة وتفاعلاً. أما العائد المالي، فهو ببساطة النتيجة الطبيعية لتحسّن هذا الأداء.",
    cards: [
      {
        name: "ذكاء اصطناعي باللهجة السعودية",
        desc: "وكيل محادثة بالذكاء الاصطناعي يتحدث اللهجة السعودية، يجيب على استفسارات الراتب والمستندات والسياسات على مدار الساعة — دون تدخل الموارد البشرية.",
        featured: true,
      },
      {
        name: "حضور وتحقّق متعدد",
        desc: "تسجيل حضور بالبصمة أو الوجه أو الصوت — دقيق، محصّن من الغش، وسهل لكل موظف.",
      },
      {
        name: "خدمات ذاتية ذكية",
        desc: "طلبات ومستندات وأسئلة السياسات تُنجز تلقائياً على مدار الساعة.",
      },
      {
        name: "حوافز ومؤشرات أداء",
        desc: "اربط الأهداف بالنتائج والمكافآت مباشرة — دون جداول بيانات.",
      },
      {
        name: "تحفيزي — ليس عقابياً",
        dark: true,
        desc: "كل ميزة في مستر إتش آر مصممة لمكافأة الأداء الجيد — لا لفرض غرامات أو عقوبات على فريقك.",
      },
    ],
  },
};

const iconMeta = [
  { icon: Bot },
  { icon: Fingerprint, bg: "bg-blue-100", color: "text-blue-600" },
  { icon: MessageCircle, bg: "bg-sky-100", color: "text-sky-600" },
  { icon: Target, bg: "bg-indigo-100", color: "text-indigo-600" },
  { icon: Heart },
];

export function Features() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="features" className="py-24 bg-white scroll-mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-black leading-tight mb-6">
            <span className="text-slate-900">{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.cards.map((card, idx) => {
            const { icon: Icon, bg: iconBg, color: iconColor } = iconMeta[idx];
            const isFeatured = "featured" in card && card.featured;
            const isDark = "dark" in card && card.dark;

            if (isFeatured) {
              return (
                <div
                  key={idx}
                  className="group relative rounded-[28px] md:col-span-2 p-10 text-white overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-xl"
                  style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)" }}
                >
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 relative border border-white/30 shadow-inner">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-heading font-black mb-4 relative">{card.name}</h3>
                  <p className="text-blue-100 text-lg leading-relaxed relative font-medium max-w-md">{card.desc}</p>
                </div>
              );
            }

            if (isDark) {
              return (
                <div
                  key={idx}
                  className="group relative rounded-[28px] bg-slate-900 p-10 transition-all duration-500 hover:-translate-y-2 shadow-xl overflow-hidden border border-slate-800"
                >
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-8 relative">
                    <Icon size={28} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-heading font-black mb-4 text-white relative">{card.name}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium relative">{card.desc}</p>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="group relative rounded-[28px] border border-slate-200 bg-white p-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300`}>
                  <Icon size={28} className={iconColor} />
                </div>
                <h3 className="text-2xl font-heading font-black mb-4 text-slate-900">{card.name}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
