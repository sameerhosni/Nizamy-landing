import { Fingerprint, Target, Bot, MessageCircle, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "The Solution",
    titlePart1: "Turn hidden waste ",
    titlePart2: "into visible profit.",
    subtitle: "You don't need more follow-up. You need clear vision. Nizamy collects your team's daily data — attendance, commitment, performance — and transforms it into a single dashboard that shows where returns are leaking, and where you can recover them.",
    cards: [
      {
        name: "A Smart HR Assistant that understands Saudi dialect",
        desc: "A conversational AI agent that speaks Saudi dialect, answering payslip, document, and policy questions around the clock — no HR involved.",
        featured: true,
      },
      {
        name: "Attendance Management with Trusted Verification",
        desc: "One tap, zero doubt. Employees check in with fingerprint, face, or voice — accurate, fraud-proof, and effortless.",
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
        desc: "Employees handle requests, documents, and approvals themselves — through an AI chat assistant that speaks their language.",
        images: ["/images/self-service-home.png", "/images/94705_1783520815578.jpeg"],
        imageAlts: ["Self-service home screen with quick requests", "AI self-service chat assistant"],
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
        imageAlts: ["Organization leaderboard and peer appreciation", "Rewards marketplace with redeemable gift cards", "Company performance dashboard"],
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
    eyebrow: "الحل",
    titlePart1: "حوّل الهدر الخفي ",
    titlePart2: "إلى أرباح مرئية.",
    subtitle: "لا تحتاج إلى مزيد من المتابعة. تحتاج إلى رؤية واضحة. نظامي يجمع بيانات فريقك اليومية — الحضور، الالتزام، الأداء — ثم يحولها إلى لوحة تحكم واحدة تكشف لك أين يضيع العائد، وأين يمكنك استعادته.",
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
        desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي يتحدث بلغته — دون أن تكون الموارد البشرية وسيطاً.",
        images: ["/images/self-service-home.png", "/images/94705_1783520815578.jpeg"],
        imageAlts: ["الشاشة الرئيسية للخدمة الذاتية مع طلبات سريعة", "مساعد ذكي للخدمة الذاتية"],
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
        imageAlts: ["لوحة صدارة المنشأة وتقدير الزملاء", "سوق المكافآت مع بطاقات هدايا", "لوحة أداء الشركة"],
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
        desc: "نظام يركز على التحفيز بدل العقوبات — كل ميزة في نظامي اتش آر مصممة لمكافأة الأداء الجيد.",
      },
    ],
  },
};

const iconMeta: { icon: typeof Bot }[] = [
  { icon: Bot },
  { icon: Fingerprint },
  { icon: MessageCircle },
  { icon: Target },
  { icon: Heart },
];

export function Features() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="features" className="py-24 sm:py-32 bg-white scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.1] mb-6">
            <span className="text-slate-900">{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.cards.map((card, idx) => {
            const { icon: Icon } = iconMeta[idx];
            const isFeatured = "featured" in card && card.featured;
            const isDark = "dark" in card && card.dark;
            const isShowcase = "showcase" in card && card.showcase;

            if (isFeatured) {
              return (
                <div
                  key={idx}
                  className="md:col-span-3 rounded-3xl p-10 md:p-12 text-white overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)" }}
                >
                  <div className="absolute -top-12 -end-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -start-16 w-72 h-72 bg-white/8 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25">
                      <Icon size={26} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-heading font-black mb-3">{card.name}</h3>
                      <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">{card.desc}</p>
                    </div>
                  </div>
                </div>
              );
            }

            if (isShowcase) {
              const images = "images" in card ? card.images : undefined;
              const imageAlts = "imageAlts" in card ? card.imageAlts : undefined;
              const bullets = "bullets" in card ? card.bullets : undefined;

              return (
                <div
                  key={idx}
                  className="md:col-span-3 rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                    {/* Text */}
                    <div className="p-10 md:p-14 order-2 md:order-none rtl:md:order-2">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                        <Icon size={22} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 text-slate-900 leading-snug">{card.name}</h3>
                      <p className="text-slate-500 text-base leading-relaxed font-medium mb-8 max-w-md">{card.desc}</p>
                      {bullets && bullets.length > 0 && (
                        <ul className="space-y-3">
                          {bullets.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="flex items-start gap-3 rtl:flex-row-reverse rtl:text-right">
                              <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
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
                    {/* Phone mockups */}
                    <div
                      className="relative flex items-center justify-center gap-0 py-14 md:py-20 px-8 order-1 md:order-none overflow-hidden"
                      style={{ background: "linear-gradient(150deg, #eff6ff 0%, #dbeafe 55%, #ede9fe 100%)" }}
                    >
                      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 60% 20%, rgba(37,99,235,0.12) 0%, transparent 65%)" }} />
                      {images && images.map((img, imgIdx) => {
                        const isTriple = images.length >= 3;
                        const sizeClass = isTriple
                          ? "w-[125px] h-[260px] sm:w-[145px] sm:h-[300px]"
                          : "w-[155px] h-[320px] sm:w-[175px] sm:h-[365px]";
                        const posClass = isTriple
                          ? imgIdx === 0 ? "rotate-[-7deg] z-10 -me-4" : imgIdx === 1 ? "rotate-0 z-20 -translate-y-5" : "rotate-[7deg] z-10 -ms-4 mt-8"
                          : imgIdx === 0 ? "rotate-[-5deg] z-10 -me-4" : "rotate-[4deg] mt-10 z-20";
                        return (
                          <div
                            key={imgIdx}
                            className={`relative ${sizeClass} ${posClass} rounded-[26px] bg-slate-900 p-[6px] transition-transform duration-500 hover:-translate-y-1`}
                            style={{ boxShadow: "0 24px 56px rgba(15,23,42,0.28), 0 8px 16px rgba(15,23,42,0.14)" }}
                          >
                            <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                              <div className="w-16 h-3.5 bg-slate-900 rounded-b-xl" />
                            </div>
                            <div className="w-full h-full rounded-[21px] overflow-hidden">
                              <img src={img} alt={imageAlts?.[imgIdx] ?? ""} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            if (isDark) {
              return (
                <div
                  key={idx}
                  className="md:col-span-3 rounded-3xl bg-slate-900 p-10 md:p-12 shadow-xl overflow-hidden relative border border-slate-800"
                >
                  <div className="absolute -bottom-10 -start-10 w-52 h-52 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                    <div className="w-13 h-13 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 p-3">
                      <Icon size={26} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-heading font-black mb-2 text-white">{card.name}</h3>
                      <p className="text-slate-400 leading-relaxed font-medium max-w-2xl">{card.desc}</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-heading font-black mb-3 text-slate-900">{card.name}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
