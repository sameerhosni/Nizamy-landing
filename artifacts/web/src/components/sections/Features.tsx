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
        desc: "One tap, zero doubt. Employees check in with fingerprint, face, or voice — accurate, fraud-proof, and effortless, with every record tied to a verified identity.",
        image: "/images/94697_1783520815575.jpeg",
        imageAlt: "Biometric attendance check-in screen",
        bullets: [
          "Fingerprint, face, or voice — whichever suits your workplace",
          "Impossible to fake or check in on someone else's behalf",
          "Every check-in logged instantly, no manual entry",
        ],
        showcase: true,
      },
      {
        name: "Smart Self-Service",
        desc: "Employees handle requests, documents, and approvals themselves — instantly, through an AI chat assistant that speaks their language, so HR never has to be the middleman.",
        image: "/images/94705_1783520815578.jpeg",
        imageAlt: "AI self-service chat assistant",
        bullets: [
          "Leave requests, shift changes, and early-leave approvals in seconds",
          "Direct escalation to HR only when it's truly needed",
          "Available around the clock, in Saudi dialect",
        ],
        showcase: true,
      },
      {
        name: "Incentives & Performance KPIs",
        desc: "Set goals, run review cycles, and link outcomes directly to rewards — turning good performance into points employees can actually redeem.",
        images: ["/images/leaderboard.png", "/images/rewards-marketplace.png"],
        imageAlts: ["Organization leaderboard and peer appreciation", "Rewards marketplace with redeemable gift cards"],
        bullets: [
          "Leaderboards and peer appreciation that keep the whole team engaged",
          "XP points earned from performance, redeemable in a real rewards marketplace",
          "Gift cards, early logout, and other perks — no spreadsheets required",
        ],
        showcase: true,
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
        desc: "لمسة واحدة، بلا أي شك. يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق، محصّن من الغش، وكل سجل مرتبط بهوية موثّقة.",
        image: "/images/94697_1783520815575.jpeg",
        imageAlt: "شاشة تسجيل الحضور بالتحقق البيومتري",
        bullets: [
          "بصمة الإصبع أو الوجه أو الصوت — بحسب ما يناسب بيئة عملك",
          "يستحيل تزويره أو تسجيل الحضور نيابة عن موظف آخر",
          "كل تسجيل حضور يُرصد فوراً، دون إدخال يدوي",
        ],
        showcase: true,
      },
      {
        name: "خدمات ذاتية ذكية",
        desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي يتحدث بلغته — دون أن تكون الموارد البشرية وسيطاً في كل مرة.",
        image: "/images/94705_1783520815578.jpeg",
        imageAlt: "مساعد ذكي للخدمة الذاتية عبر المحادثة",
        bullets: [
          "طلبات الإجازة وتبديل الورديات والمغادرة المبكرة خلال ثوانٍ",
          "تصعيد مباشر للموارد البشرية فقط عند الحاجة الفعلية",
          "متاح على مدار الساعة، باللهجة السعودية",
        ],
        showcase: true,
      },
      {
        name: "حوافز ومؤشرات أداء",
        desc: "اربط الأهداف بدورات التقييم والمكافآت مباشرة — وحوّل الأداء الجيد إلى نقاط يستبدلها الموظف فعلياً.",
        images: ["/images/leaderboard.png", "/images/rewards-marketplace.png"],
        imageAlts: ["لوحة صدارة المنشأة وتقدير الزملاء", "سوق المكافآت مع بطاقات هدايا قابلة للاستبدال"],
        bullets: [
          "لوحات صدارة وتقدير بين الزملاء تُبقي الفريق كله متفاعلاً",
          "نقاط خبرة تُكتسب من الأداء، قابلة للاستبدال في سوق مكافآت حقيقي",
          "بطاقات هدايا وخروج مبكر ومزايا أخرى — دون أي جداول بيانات",
        ],
        showcase: true,
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
                  className="group relative rounded-[28px] md:col-span-3 p-10 md:p-12 text-white overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-xl"
                  style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)" }}
                >
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                      <Icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-heading font-black mb-3">{card.name}</h3>
                      <p className="text-blue-100 text-lg leading-relaxed font-medium max-w-2xl">{card.desc}</p>
                    </div>
                  </div>
                </div>
              );
            }

            if ("showcase" in card && card.showcase) {
              const image = "image" in card ? card.image : undefined;
              const imageAlt = "imageAlt" in card ? card.imageAlt : undefined;
              const images = "images" in card ? card.images : undefined;
              const imageAlts = "imageAlts" in card ? card.imageAlts : undefined;
              const { bullets } = card;

              return (
                <div
                  key={idx}
                  className="group relative rounded-[28px] md:col-span-3 bg-gradient-to-br from-sky-50 to-white border border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <div className="p-10 md:p-14 order-2 md:order-none rtl:md:order-2">
                      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-8`}>
                        <Icon size={28} className={iconColor} />
                      </div>
                      <h3 className="text-3xl font-heading font-black mb-4 text-slate-900">{card.name}</h3>
                      <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8 max-w-md">{card.desc}</p>
                      {bullets && bullets.length > 0 && (
                        <ul className="space-y-3">
                          {bullets.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="flex items-start gap-3 rtl:flex-row-reverse rtl:text-right">
                              <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-slate-700 font-medium">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="relative flex items-center justify-center gap-4 bg-gradient-to-b from-blue-50 to-sky-100 py-12 md:py-16 px-6 order-1 md:order-none">
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, rgba(37,99,235,0.15), transparent 60%)" }} />
                      {image && (
                        <div className="relative w-[220px] h-[440px] sm:w-[240px] sm:h-[480px] rounded-[36px] bg-slate-900 p-2.5 shadow-2xl border border-slate-300 transition-transform duration-500 group-hover:-translate-y-2">
                          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                            <div className="w-28 h-5 bg-slate-900 rounded-b-2xl" />
                          </div>
                          <div className="w-full h-full bg-white rounded-[28px] overflow-hidden relative">
                            <img
                              src={image}
                              alt={imageAlt}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                      {images && images.length > 0 && (
                        <>
                          {images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className={`relative w-[170px] h-[350px] sm:w-[190px] sm:h-[390px] rounded-[30px] bg-slate-900 p-2 shadow-2xl border border-slate-300 transition-transform duration-500 group-hover:-translate-y-2 ${
                                imgIdx === 0 ? "rotate-[-4deg] -mr-4 rtl:mr-0 rtl:-ml-4" : "rotate-[4deg] mt-10"
                              }`}
                            >
                              <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                                <div className="w-24 h-4 bg-slate-900 rounded-b-2xl" />
                              </div>
                              <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative">
                                <img
                                  src={img}
                                  alt={imageAlts?.[imgIdx] ?? ""}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (isDark) {
              return (
                <div
                  key={idx}
                  className="group relative rounded-[28px] md:col-span-3 bg-slate-900 p-10 md:p-12 transition-all duration-500 hover:-translate-y-1 shadow-xl overflow-hidden border border-slate-800"
                >
                  <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <Icon size={28} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-black mb-2 text-white">{card.name}</h3>
                      <p className="text-slate-400 leading-relaxed font-medium max-w-2xl">{card.desc}</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="group relative rounded-[28px] border border-slate-200 bg-white p-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 overflow-hidden"
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
