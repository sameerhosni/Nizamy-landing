import { Fingerprint, Target, Bot, MessageCircle, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "How Nizamy Works",
    titlePart1: "A performance system first. ",
    titlePart2: "A return because of it.",
    subtitle: "Six pillars that make your team sharper, faster, and more engaged. The return is simply what follows when performance improves.",
    cards: [
      {
        name: "A Smart HR Assistant that understands Saudi dialect",
        desc: "A conversational AI agent that speaks Saudi dialect, answering payslip, document, and policy questions around the clock — no HR involved.",
        featured: true,
      },
      {
        name: "Attendance Management with Trusted Verification",
        desc: "One tap, zero doubt. Employees check in with fingerprint, face, or voice — accurate, fraud-proof, and effortless, with every record tied to a verified identity.",
        images: ["/images/94697_1783520815575.jpeg", "/images/face-id-checkin.png"],
        imageAlts: ["Biometric attendance check-in screen", "Face ID verification check-in with XP points"],
        bullets: [
          "Fingerprint, face, or voice — whichever suits your workplace",
          "Impossible to fake or check in on someone else's behalf",
          "Every check-in logged instantly, no manual entry",
        ],
        showcase: true,
      },
      {
        name: "Employee Self-Service",
        desc: "Employees handle requests, documents, and approvals themselves — instantly, through an AI chat assistant that speaks their language, so HR never has to be the middleman.",
        images: ["/images/self-service-home.png", "/images/94705_1783520815578.jpeg"],
        imageAlts: ["Self-service home screen with quick requests and AI assistant", "AI self-service chat assistant"],
        bullets: [
          "Leave requests, shift changes, and early-leave approvals in seconds",
          "Direct escalation to HR only when it's truly needed",
          "Available around the clock, in Saudi dialect",
        ],
        showcase: true,
      },
      {
        name: "Performance & Rewards Management",
        desc: "Set goals, run review cycles, and link outcomes directly to rewards — turning good performance into points employees can actually redeem.",
        images: ["/images/leaderboard.png", "/images/rewards-marketplace.png", "/images/company-performance.png"],
        imageAlts: ["Organization leaderboard and peer appreciation", "Rewards marketplace with redeemable gift cards", "Company performance dashboard with attendance and commitment KPIs"],
        bullets: [
          "Leaderboards and peer appreciation that keep the whole team engaged",
          "XP points earned from performance, redeemable in a real rewards marketplace",
          "Gift cards, early logout, and other perks — no spreadsheets required",
          "Company-wide performance dashboard tracking hours, commitment rate, and absences",
        ],
        showcase: true,
      },
      {
        name: "Motivational, not punitive",
        dark: true,
        desc: "A system that focuses on motivation instead of penalties — every feature is designed to reward good performance.",
      },
    ],
  },
  ar: {
    eyebrow: "كيف يعمل نظامي",
    titlePart1: "نظام لإدارة الأداء أولاً، ",
    titlePart2: "والعائد نتيجة طبيعية.",
    subtitle: "ست ركائز تجعل فريقك أكثر تركيزاً وسرعة وتفاعلاً. أما العائد المالي، فهو ببساطة النتيجة الطبيعية لتحسّن هذا الأداء.",
    cards: [
      {
        name: "مساعد موارد بشرية ذكي يفهم اللهجة السعودية",
        desc: "مساعد يفهم الموظفين والمدراء باللهجة السعودية، ويجاوب على أسئلة الراتب والمستندات والسياسات على مدار الساعة — دون تدخل الموارد البشرية.",
        featured: true,
      },
      {
        name: "إدارة الحضور والانصراف بطرق تحقق موثوقة",
        desc: "يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق، يصعب التلاعب به، وكل سجل مرتبط بهوية موثّقة.",
        images: ["/images/94697_1783520815575.jpeg", "/images/face-id-checkin.png"],
        imageAlts: ["شاشة تسجيل الحضور بالتحقق البيومتري", "تحقق تسجيل الحضور بالوجه مع نقاط الخبرة"],
        bullets: [
          "بصمة الإصبع أو الوجه أو الصوت — بحسب ما يناسب بيئة عملك",
          "يستحيل تزويره أو تسجيل الحضور نيابة عن موظف آخر",
          "كل تسجيل حضور يُرصد فوراً، دون إدخال يدوي",
        ],
        showcase: true,
      },
      {
        name: "خدمات الموظفين الذاتية",
        desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي يتحدث بلغته — دون أن تكون الموارد البشرية وسيطاً في كل مرة.",
        images: ["/images/self-service-home.png", "/images/94705_1783520815578.jpeg"],
        imageAlts: ["الشاشة الرئيسية للخدمة الذاتية مع طلبات سريعة ومساعد ذكي", "مساعد ذكي للخدمة الذاتية عبر المحادثة"],
        bullets: [
          "طلبات الإجازة وتبديل الورديات والمغادرة المبكرة خلال ثوانٍ",
          "تصعيد مباشر للموارد البشرية فقط عند الحاجة الفعلية",
          "متاح على مدار الساعة، باللهجة السعودية",
        ],
        showcase: true,
      },
      {
        name: "إدارة الأداء والمكافآت",
        desc: "اربط الأهداف بدورات التقييم والمكافآت مباشرة — وحوّل الأداء الجيد إلى نقاط يستبدلها الموظف فعلياً.",
        images: ["/images/leaderboard.png", "/images/rewards-marketplace.png", "/images/company-performance.png"],
        imageAlts: ["لوحة صدارة المنشأة وتقدير الزملاء", "سوق المكافآت مع بطاقات هدايا قابلة للاستبدال", "لوحة أداء الشركة مع مؤشرات الحضور والالتزام"],
        bullets: [
          "لوحات صدارة وتقدير بين الزملاء تُبقي الفريق كله متفاعلاً",
          "نقاط خبرة تُكتسب من الأداء، قابلة للاستبدال في سوق مكافآت حقيقي",
          "بطاقات هدايا وخروج مبكر ومزايا أخرى — دون أي جداول بيانات",
          "لوحة أداء شاملة للشركة تتابع ساعات العمل ومعدل الالتزام والغياب",
        ],
        showcase: true,
      },
      {
        name: "تحفيزي وليس عقابي",
        dark: true,
        desc: "نظام يركز على التحفيز بدل العقوبات — كل ميزة في نظامي مصممة لمكافأة الأداء الجيد.",
      },
    ],
  },
};

const iconMeta: { icon: typeof Bot; bg?: string; color?: string; titleImage?: string }[] = [
  { icon: Bot },
  { icon: Fingerprint, bg: "bg-blue-100", color: "text-blue-600", titleImage: "/images/services/attendance.png" },
  { icon: MessageCircle, bg: "bg-sky-100", color: "text-sky-600", titleImage: "/images/services/self-service-v2.png" },
  { icon: Target, bg: "bg-indigo-100", color: "text-indigo-600", titleImage: "/images/services/rewards-v2.png" },
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
            const { icon: Icon, bg: iconBg, color: iconColor, titleImage } = iconMeta[idx];
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
              const images = "images" in card ? card.images : undefined;
              const imageAlts = "imageAlts" in card ? card.imageAlts : undefined;
              const { bullets } = card;

              return (
                <div
                  key={idx}
                  className="group relative rounded-[32px] md:col-span-3 bg-white border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl shadow-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <div className="p-12 md:p-16 order-2 md:order-none rtl:md:order-2">
                      {titleImage ? (
                        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 shadow-sm`}>
                          <img
                            src={titleImage}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="w-10 h-10 object-contain drop-shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}>
                          <Icon size={24} className={iconColor} />
                        </div>
                      )}
                      <h3 className="text-2xl md:text-3xl font-heading font-black mb-4 text-slate-900 leading-snug">{card.name}</h3>
                      <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium mb-8 max-w-md">{card.desc}</p>
                      {bullets && bullets.length > 0 && (
                        <ul className="space-y-3">
                          {bullets.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="flex items-start gap-3 rtl:flex-row-reverse rtl:text-right">
                              <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-slate-600 text-sm font-medium leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="relative flex items-center justify-center gap-4 py-14 md:py-20 px-8 order-1 md:order-none overflow-hidden" style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 55%, #EDE9FE 100%)" }}>
                      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 60% 20%, rgba(37,99,235,0.12) 0%, transparent 65%), radial-gradient(ellipse at 30% 80%, rgba(99,102,241,0.10) 0%, transparent 60%)" }} />
                      {images && images.length > 0 && (
                        <>
                          {images.map((img, imgIdx) => {
                            const isTriple = images.length >= 3;
                            const sizeClass = isTriple
                              ? "w-[130px] h-[270px] sm:w-[150px] sm:h-[310px]"
                              : "w-[160px] h-[335px] sm:w-[185px] sm:h-[385px]";
                            const positionClass = isTriple
                              ? imgIdx === 0
                                ? "rotate-[-7deg] -mr-6 rtl:mr-0 rtl:-ml-6 z-10"
                                : imgIdx === 1
                                  ? "rotate-0 z-20 -translate-y-4"
                                  : "rotate-[7deg] -ml-6 rtl:ml-0 rtl:-mr-6 mt-8 z-10"
                              : imgIdx === 0
                                ? "rotate-[-5deg] -mr-5 rtl:mr-0 rtl:-ml-5 z-10"
                                : "rotate-[4deg] mt-10 z-20";
                            return (
                              <div
                                key={imgIdx}
                                className={`relative ${sizeClass} rounded-[28px] bg-slate-900 p-[7px] transition-transform duration-500 group-hover:-translate-y-2 ${positionClass}`}
                                style={{ boxShadow: "0 25px 60px rgba(15,23,42,0.30), 0 8px 20px rgba(15,23,42,0.18)" }}
                              >
                                <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                                  <div className="w-20 h-[14px] bg-slate-900 rounded-b-xl" />
                                </div>
                                <div className="w-full h-full bg-white rounded-[22px] overflow-hidden relative">
                                  <img
                                    src={img}
                                    alt={imageAlts?.[imgIdx] ?? ""}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              </div>
                            );
                          })}
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
