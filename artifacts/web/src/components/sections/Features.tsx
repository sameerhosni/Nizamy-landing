import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, UserCheck, CalendarDays, Calculator, Clock, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import feature1 from "@/assets/availo/feature-1.png";
import feature2 from "@/assets/availo/feature-2.png";
import feature3 from "@/assets/availo/feature-3.png";
import feature4 from "@/assets/availo/feature-4.png";
import feature5 from "@/assets/availo/feature-5.png";

export function Features() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const content = {
    en: {
      eyebrow: "Features Beyond Expectations",
      titlePart1: "A performance system first. ",
      titlePart2: "A return because of it.",
      items: [
        {
          title: "Smart Leave Requests",
          desc: "Employees handle requests, documents, and approvals themselves through an AI assistant.",
          icon: CalendarDays,
          image: feature1
        },
        {
          title: "Biometric Check-in/out",
          desc: "One tap, zero doubt. Employees check in with fingerprint, face, or voice — accurate and fraud-proof.",
          icon: UserCheck,
          image: feature2
        },
        {
          title: "Automatic Work-Hours Calculation",
          desc: "Company-wide performance dashboard tracking hours, commitment rate, and absences instantly.",
          icon: Calculator,
          image: feature3
        },
        {
          title: "Attendance From Anywhere",
          desc: "Flexible attendance options for remote teams with geolocation and smart verification.",
          icon: Clock,
          image: feature4
        },
        {
          title: "Smart HR/Payroll Integration",
          desc: "Link outcomes directly to rewards and payroll without any manual data entry.",
          icon: Link2,
          image: feature5
        }
      ]
    },
    ar: {
      eyebrow: "مميزات تفوق التوقعات",
      titlePart1: "نظام لإدارة الأداء أولاً، ",
      titlePart2: "والعائد نتيجة طبيعية.",
      items: [
        {
          title: "طلبات إجازة ذكية",
          desc: "طلبات الموظف ومستنداته وموافقاته تُنجز فوراً عبر مساعد ذكاء اصطناعي.",
          icon: CalendarDays,
          image: feature1
        },
        {
          title: "تسجيل حضور بيومتري",
          desc: "يسجّل الموظف حضوره بالبصمة أو الوجه أو الصوت — دقيق ويصعب التلاعب به.",
          icon: UserCheck,
          image: feature2
        },
        {
          title: "حساب آلي لساعات العمل",
          desc: "لوحة أداء شاملة للشركة تتابع ساعات العمل ومعدل الالتزام والغياب لحظياً.",
          icon: Calculator,
          image: feature3
        },
        {
          title: "حضور من أي مكان",
          desc: "خيارات مرنة لتسجيل الحضور للفرق عن بعد مع التحقق الجغرافي الذكي.",
          icon: Clock,
          image: feature4
        },
        {
          title: "ربط ذكي بالرواتب والموارد",
          desc: "اربط النتائج مباشرة بمسيرات الرواتب والمكافآت دون أي إدخال يدوي.",
          icon: Link2,
          image: feature5
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
            <div className="absolute inset-0 bg-slate-100 rounded-[3rem] -rotate-3 scale-95" />
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center p-8 border border-slate-100/80">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={t.items[activeIndex].image}
                  alt={t.items[activeIndex].title}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute max-w-[85%] max-h-[85%] object-contain"
                />
              </AnimatePresence>
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
