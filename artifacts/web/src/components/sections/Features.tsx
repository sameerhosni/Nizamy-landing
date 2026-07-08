import { Fingerprint, Target, Bot, MessageCircle, ShieldCheck, Heart } from "lucide-react";
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
        name: "Saudi Compliance Built-In",
        desc: "Native GOSI, social insurance, and Zakat compliance — always up to date with local regulation.",
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
        name: "توافق محلي سعودي",
        desc: "حماية الأجور، التأمينات، مكافأة نهاية الخدمة، وهيئة الزكاة والدخل.",
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
  { icon: Fingerprint, bg: "bg-[#FF4D8D]/10", color: "text-[#FF4D8D]" },
  { icon: ShieldCheck, bg: "bg-emerald-500/10", color: "text-emerald-500" },
  { icon: MessageCircle, bg: "bg-primary/10", color: "text-primary" },
  { icon: Target, bg: "bg-[#FFA23A]/10", color: "text-[#FFA23A]" },
  { icon: Heart },
];

export function Features() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="features" className="py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-xs font-semibold text-primary bg-accent px-3.5 py-1.5 rounded-full mb-4">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-4">
            <span className="text-foreground">{t.titlePart1}</span>
            <span className="text-gradient-primary">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.cards.map((card, idx) => {
            const { icon: Icon, bg: iconBg, color: iconColor } = iconMeta[idx];
            const isFeatured = "featured" in card && card.featured;
            const isDark = "dark" in card && card.dark;

            if (isFeatured) {
              return (
                <div
                  key={idx}
                  className="group relative rounded-[22px] md:col-span-2 p-8 text-white overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "linear-gradient(135deg, #6D4AFF 0%, #4B2FDE 100%)" }}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-6 relative">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2 relative">{card.name}</h3>
                  <p className="text-white/75 leading-relaxed relative">{card.desc}</p>
                </div>
              );
            }

            if (isDark) {
              return (
                <div
                  key={idx}
                  className="group relative rounded-[22px] bg-mrhr-dark p-8 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                    <Icon size={22} className="text-[#8B6BFF]" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2 text-white">{card.name}</h3>
                  <p className="text-white/60 leading-relaxed">{card.desc}</p>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="group relative rounded-[22px] border border-border/50 bg-white p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-6`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-foreground">{card.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
