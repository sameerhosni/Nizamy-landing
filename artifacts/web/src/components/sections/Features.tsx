import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { UserCheck, CalendarDays, Gift, BarChart3, Rocket, ShieldCheck, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import feature2 from "@/assets/availo/feature-2.png";
import { RewardsVisual, AiReportsVisual, OnboardingVisual, LeaveChatVisual, ComplianceVisual, RecruitmentVisual, PayrollVisual } from "./FeatureVisuals";

export function Features() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const content = {
    en: {
      eyebrow: "A Complete HR System",
      titlePart1: "Everything HR needs, in one platform. ",
      titlePart2: "And it all works together, simply.",
      badges: [
        {
          label: "Compliant with KSA Labor Regulations",
          desc: "Policies, leave, and attendance rules aligned with Saudi labor law out of the box.",
          icon: ShieldCheck,
          soon: false,
          visual: ComplianceVisual,
        },
        {
          label: "Recruitment",
          desc: "Attract, screen, and hire candidates through one streamlined pipeline.",
          icon: Users,
          soon: true,
          visual: RecruitmentVisual,
        },
        {
          label: "Payroll",
          desc: "Salaries, deductions, and payslips calculated automatically end to end.",
          icon: Wallet,
          soon: true,
          visual: PayrollVisual,
        },
      ],
      soonLabel: "Coming soon",
      items: [
        {
          title: "Smart Self-Services",
          desc: "Employees handle requests, documents, and approvals themselves through an AI assistant.",
          icon: CalendarDays,
          visual: LeaveChatVisual
        },
        {
          title: "Biometric Check-in/out",
          desc: "One tap, zero doubt. Employees check in with fingerprint, face, or voice — accurate and fraud-proof.",
          icon: UserCheck,
          image: feature2
        },
        {
          title: "Employee Engagement via Rewards & Incentives",
          desc: "Smart rewards and incentives that keep your team committed and turn daily performance into motivation.",
          icon: Gift,
          visual: RewardsVisual
        },
        {
          title: "AI Report Engine",
          desc: "Deep AI-generated reports that surface insights spreadsheets can't show you — instantly.",
          icon: BarChart3,
          visual: AiReportsVisual
        },
        {
          title: "Self-Onboarding, No Tech Experience Needed",
          desc: "Your team gets started on their own from day one — no training, no technical background required.",
          icon: Rocket,
          visual: OnboardingVisual
        }
      ]
    },
    ar: {
      eyebrow: "نظام موارد بشرية متكامل",
      titlePart1: "كل احتياجات الـ HR في منصة واحدة. ",
      titlePart2: "كل شيء يعمل معًا، ببساطة.",
      badges: [
        {
          label: "متوافق مع أنظمة العمل السعودية",
          desc: "سياسات وإجازات وقواعد حضور متوافقة مع نظام العمل السعودي من اليوم الأول.",
          icon: ShieldCheck,
          soon: false,
          visual: ComplianceVisual,
        },
        {
          label: "التوظيف",
          desc: "استقطب المرشحين وقيّمهم ووظّفهم عبر مسار واحد منظم.",
          icon: Users,
          soon: true,
          visual: RecruitmentVisual,
        },
        {
          label: "الرواتب",
          desc: "رواتب وخصومات وقسائم دفع تُحسب تلقائيًا من البداية للنهاية.",
          icon: Wallet,
          soon: true,
          visual: PayrollVisual,
        },
      ],
      soonLabel: "قريبًا",
      items: [
        {
          title: "خدمات ذاتية ذكية",
          desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي.",
          icon: CalendarDays,
          visual: LeaveChatVisual
        },
        {
          title: "تسجيل حضور بيومتري",
          desc: "يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق ويصعب التلاعب به.",
          icon: UserCheck,
          image: feature2
        },
        {
          title: "تفاعل الموظفين عبر المكافآت والحوافز",
          desc: "مكافآت وحوافز ذكية تحافظ على التزام فريقك وتحوّل الأداء اليومي إلى دافع حقيقي.",
          icon: Gift,
          visual: RewardsVisual
        },
        {
          title: "محرك تقارير بالذكاء الاصطناعي",
          desc: "تقارير عميقة يولّدها الذكاء الاصطناعي تكشف لك ما لا تظهره الجداول — فوراً.",
          icon: BarChart3,
          visual: AiReportsVisual
        },
        {
          title: "تهيئة ذاتية بدون أي خبرة تقنية",
          desc: "فريقك يبدأ بنفسه من اليوم الأول — بدون تدريب وبدون أي خلفية تقنية.",
          icon: Rocket,
          visual: OnboardingVisual
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <span className="inline-block text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] tracking-tight">
            <span className="text-slate-900">{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
        </motion.div>

        {(() => {
          const allFeatures = [
            ...t.items.map((item) => ({
              title: item.title,
              desc: item.desc,
              icon: item.icon,
              soon: false,
              visual: "visual" in item ? item.visual : undefined,
              image: "image" in item ? item.image : undefined,
            })),
            ...t.badges.map((badge) => ({
              title: badge.label,
              desc: badge.desc,
              icon: badge.icon,
              soon: badge.soon,
              visual: badge.visual,
              image: feature2,
            })),
          ];
          const count = allFeatures.length;

          const renderCenter = (sizeClass: string) => (
            <div className={`relative rounded-full bg-gradient-to-br from-blue-50 to-white border-[10px] border-white shadow-[0_25px_60px_rgba(37,99,235,0.15)] overflow-hidden ${sizeClass}`}>
              {allFeatures.map((f, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{ opacity: idx === activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className={`absolute inset-0 ${idx === activeIndex ? "" : "pointer-events-none"}`}
                >
                  {f.visual ? (
                    <div className="absolute inset-0 scale-[0.55] origin-center">
                      <f.visual language={language} />
                    </div>
                  ) : (
                    <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                  )}
                </motion.div>
              ))}
            </div>
          );

          return (
            <>
              {/* Circular infographic — desktop */}
              <div className="hidden lg:block relative w-[1000px] h-[1000px] mx-auto">
                {/* dashed orbit ring */}
                <div className="absolute inset-[20%] rounded-full border-2 border-dashed border-blue-200" />

                {/* center visual, crossfades with the selected feature */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  {renderCenter("w-[440px] h-[440px]")}
                </motion.div>

                {/* orbiting feature nodes */}
                {allFeatures.map((f, i) => {
                  const angle = ((-90 + (i * 360) / count) * Math.PI) / 180;
                  const x = 50 + 33 * Math.cos(angle);
                  const y = 50 + 33 * Math.sin(angle);
                  const Icon = f.icon;
                  const isActive = i === activeIndex;
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="absolute w-52 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center gap-3 cursor-pointer group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 text-white border border-blue-600 shadow-[0_15px_35px_rgba(37,99,235,0.35)] scale-110"
                          : "bg-white text-blue-600 border border-slate-200 shadow-[0_10px_25px_rgba(15,23,42,0.08)] group-hover:border-blue-300"
                      }`}>
                        <Icon size={34} strokeWidth={1.8} />
                        {f.soon && (
                          <span className="absolute -top-1.5 -end-4 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                            {t.soonLabel}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className={`text-[16px] font-heading font-black leading-snug mb-1.5 transition-colors ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                          {f.title}
                        </p>
                        <p className="text-[12.5px] font-medium text-slate-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile/tablet — chips + visual card + active description */}
              <div className="lg:hidden max-w-xl mx-auto">
                {/* Feature chips (horizontally scrollable) */}
                <div dir={language === "ar" ? "rtl" : "ltr"} className="flex gap-2.5 overflow-x-auto pb-3 -mx-4 px-4 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {allFeatures.map((f, i) => {
                    const Icon = f.icon;
                    const isActive = i === activeIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveIndex(i)}
                        className={`snap-start shrink-0 flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold whitespace-nowrap transition-all ${
                          isActive
                            ? "bg-blue-600 border-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <Icon size={16} strokeWidth={2.2} />
                        {f.title}
                        {f.soon && (
                          <span className={`text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none ${
                            isActive ? "bg-white/20 text-white" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {t.soonLabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active feature visual — full card, no cropping */}
                <div className="mt-4 relative rounded-[28px] bg-gradient-to-br from-blue-50 via-white to-white border border-slate-200/80 shadow-[0_20px_50px_rgba(37,99,235,0.08)] overflow-hidden h-[430px] sm:h-[480px]">
                  {allFeatures.map((f, idx) => (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={{ opacity: idx === activeIndex ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className={`absolute inset-0 ${idx === activeIndex ? "" : "pointer-events-none"}`}
                    >
                      {f.visual ? (
                        <div className="absolute inset-0 scale-[0.8] sm:scale-[0.85] origin-center">
                          <f.visual language={language} />
                        </div>
                      ) : (
                        <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Active feature text */}
                <div className="mt-6 text-center px-2">
                  <p className="text-[19px] font-heading font-black text-slate-900 leading-snug mb-2">
                    {allFeatures[activeIndex].title}
                  </p>
                  <p className="text-[14px] font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
                    {allFeatures[activeIndex].desc}
                  </p>
                </div>

                {/* Dots */}
                <div className="mt-5 flex justify-center gap-2">
                  {allFeatures.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={allFeatures[i].title}
                      aria-pressed={i === activeIndex}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === activeIndex ? "w-6 bg-blue-600" : "w-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}
