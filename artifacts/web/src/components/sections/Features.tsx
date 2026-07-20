import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, UserCheck, CalendarDays, Gift, BarChart3, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import feature2 from "@/assets/availo/feature-2.png";
import { RewardsVisual, AiReportsVisual, OnboardingVisual, LeaveChatVisual } from "./FeatureVisuals";

export function Features() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const content = {
    en: {
      eyebrow: "A Complete HR System",
      titlePart1: "Everything HR needs, in one platform. ",
      titlePart2: "And it all works together, simply.",
      items: [
        {
          title: "Smart Leave Requests",
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
      items: [
        {
          title: "طلبات إجازة ذكية",
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
          {/* Images Side */}
          <motion.div 
            initial={{ opacity: 0, x: language === 'en' ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] lg:aspect-square flex items-center justify-center order-first"
          >
            <div className="absolute inset-0">
              {t.items.map((item, idx) =>
                "image" in item ? (
                  <motion.img
                    key={idx}
                    src={item.image}
                    alt={item.title}
                    initial={false}
                    animate={{ opacity: idx === activeIndex ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-contain scale-[1.35] [mask-image:radial-gradient(ellipse_75%_75%_at_center,black_60%,transparent_98%)]"
                  />
                ) : (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{ opacity: idx === activeIndex ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={`absolute inset-0 ${idx === activeIndex ? "" : "pointer-events-none"}`}
                  >
                    <item.visual language={language} />
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>

          {/* Checklist Side */}
          <div className="flex flex-col gap-5 relative z-10">
            {t.items.map((item, idx) => {
              const Icon = item.icon;
              const isActive = idx === activeIndex;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setActiveIndex(idx)}
                  className={`group text-start transition-all duration-400 rounded-[24px] p-6 md:p-8 flex items-start gap-6 border ${
                    isActive
                      ? "bg-white border-blue-200 shadow-[0_20px_40px_rgba(37,99,235,0.08)] scale-[1.02]"
                      : "bg-transparent border-transparent hover:bg-white/60 hover:border-slate-200"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-400 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "bg-white border border-slate-200 text-slate-500 group-hover:text-blue-600"
                  }`}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-heading font-black mb-3 transition-colors ${
                      isActive ? "text-blue-900" : "text-slate-700"
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-[15px] font-medium leading-relaxed transition-colors ${
                      isActive ? "text-slate-600" : "text-slate-500"
                    }`}>
                      {item.desc}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
