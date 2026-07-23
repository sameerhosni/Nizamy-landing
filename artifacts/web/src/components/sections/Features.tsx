import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { UserCheck, CalendarDays, Gift, BarChart3, Rocket, ShieldCheck, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import feature2 from "@/assets/availo/feature-2.png";
import { RewardsVisual, AiReportsVisual, OnboardingVisual, LeaveChatVisual, ComplianceVisual, RecruitmentVisual, PayrollVisual, BiometricScanVisual } from "./FeatureVisuals";

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
          visual: BiometricScanVisual
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
          visual: BiometricScanVisual
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
              image: undefined as string | undefined,
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
          return (
            <>
              {/* Desktop — feature tabs list + large visual stage */}
              <div className="hidden lg:grid grid-cols-[380px_1fr] gap-10 items-stretch max-w-6xl mx-auto">
                {/* Feature list */}
                <div className="flex flex-col gap-2.5 self-center">
                  {allFeatures.map((f, i) => {
                    const Icon = f.icon;
                    const isActive = i === activeIndex;
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`relative flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-start transition-all duration-300 cursor-pointer group ${
                          isActive
                            ? "bg-white border-blue-200 shadow-[0_15px_40px_rgba(37,99,235,0.14)]"
                            : "bg-white/60 border-slate-200/80 hover:bg-white hover:border-blue-200/70"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="feature-active-bar"
                            className="absolute start-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400"
                          />
                        )}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.35)]"
                            : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                        }`}>
                          <Icon size={21} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[14.5px] font-heading font-black leading-snug flex items-center gap-2 ${isActive ? "text-blue-700" : "text-slate-800"}`}>
                            <span className="truncate">{f.title}</span>
                            {f.soon && (
                              <span className="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                                {t.soonLabel}
                              </span>
                            )}
                          </p>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="text-[12.5px] font-medium text-slate-500 leading-relaxed mt-1 overflow-hidden"
                            >
                              {f.desc}
                            </motion.p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Visual stage */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-[36px] bg-gradient-to-br from-blue-50 via-white to-cyan-50/40 border border-slate-200/70 shadow-[0_30px_80px_rgba(37,99,235,0.10)] overflow-hidden min-h-[640px]"
                >
                  {/* decorative background */}
                  <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-blue-100/50 blur-2xl" />
                  <div className="absolute -bottom-24 -start-24 w-72 h-72 rounded-full bg-cyan-100/50 blur-2xl" />
                  <div className="absolute inset-10 rounded-full border-2 border-dashed border-blue-100" />

                  {allFeatures.map((f, idx) => (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={{ opacity: idx === activeIndex ? 1 : 0, scale: idx === activeIndex ? 1 : 0.96 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className={`absolute inset-0 flex items-center justify-center ${idx === activeIndex ? "" : "pointer-events-none"}`}
                    >
                      {f.visual ? (
                        <div className="w-full h-full scale-[0.92] origin-center">
                          <f.visual language={language} />
                        </div>
                      ) : (
                        <img src={f.image} alt={f.title} className="w-[72%] rounded-[28px] shadow-[0_25px_60px_rgba(15,23,42,0.18)]" />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
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
