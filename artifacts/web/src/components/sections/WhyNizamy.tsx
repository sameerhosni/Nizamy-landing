import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Check } from "lucide-react";
import { motion } from "framer-motion";

export function WhyNizamy() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "Why Nizamy?",
      heading: "More than just an HR system.",
      subhead:
        "Any system can organize employee data. Nizamy helps you put it to work — because the goal isn't managing HR, it's improving how your business performs.",
      colTraditional: "Traditional solutions",
      colNizamy: "Nizamy",
      rows: [
        { traditional: "Clock-in / clock-out logging", nizamy: "Commitment turned into profit" },
        { traditional: "Periodic reports telling you what happened", nizamy: "Instant recommendations telling you what to do" },
        { traditional: "Employees as numbers", nizamy: "Employees as an investment with a return" },
        { traditional: "You always pay the full subscription", nizamy: "You recover part as commitment rises" },
        { traditional: "Motivation is your job alone", nizamy: "A built-in smart rewards system" },
        { traditional: "Data that needs analysis", nizamy: "Ready-to-act insights tied to profit" },
      ],
      cta: "See the difference yourself in a personalized demo",
    },
    ar: {
      eyebrow: "لماذا نظامي؟",
      heading: "أكثر من مجرد نظام HR.",
      subhead:
        "أي نظام يقدر ينظم بيانات الموظفين، لكن نظامي يساعدك تستفيد منها. لأن الهدف مو إدارة الموارد البشرية… الهدف هو تحسين أداء العمل.",
      colTraditional: "الحلول التقليدية",
      colNizamy: "نظامي",
      rows: [
        { traditional: "تسجيل الحضور والانصراف", nizamy: "تحويل الالتزام إلى أرباح" },
        { traditional: "تقارير دورية تخبرك بما حدث", nizamy: "توصيات فورية تخبرك بما يجب فعله" },
        { traditional: "الموظفون كأرقام", nizamy: "الموظفون كاستثمار له عائد" },
        { traditional: "تدفع كامل الاشتراك دائمًا", nizamy: "تسترد جزءًا مع ارتفاع الالتزام" },
        { traditional: "التحفيز مسؤوليتك وحدك", nizamy: "نظام مكافآت ذكي مدمج" },
        { traditional: "بيانات تحتاج تحليل", nizamy: "رؤى جاهزة للتنفيذ مرتبطة بالأرباح" },
      ],
      cta: "شاهد الفرق بنفسك في عرض توضيحي مخصص",
    },
  };

  const t = content[language];

  return (
    <section id="why-nizamy" data-analytics-section="why-nizamy" data-analytics-name="Why Nizamy" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <span className="inline-block text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] mb-6 text-slate-900 tracking-tight">
            {t.heading}
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
            {t.subhead}
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white"
        >
          <div className="grid grid-cols-2">
            <div className="bg-slate-50 px-6 py-6 text-center border-b border-slate-200">
              <span className="text-[17px] sm:text-xl font-heading font-black text-slate-600">
                {t.colTraditional}
              </span>
            </div>
            <div className="bg-blue-600 px-6 py-6 text-center border-b border-blue-600">
              <span className="text-[17px] sm:text-xl font-heading font-black text-white">
                {t.colNizamy}
              </span>
            </div>
          </div>
          {t.rows.map((row, idx) => (
            <div key={idx} className={`grid grid-cols-2 ${idx % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}`}>
              <div className="px-6 sm:px-10 py-6 flex items-start gap-4 border-t border-slate-100/60">
                <span className="w-7 h-7 rounded-full bg-slate-200/60 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                  <X size={16} strokeWidth={2.5} />
                </span>
                <span className="text-[15px] sm:text-[17px] text-slate-500 font-medium leading-relaxed">
                  {row.traditional}
                </span>
              </div>
              <div className="px-6 sm:px-10 py-6 flex items-start gap-4 border-t border-blue-100 bg-blue-50/40">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-blue-600/20">
                  <Check size={16} strokeWidth={2.5} />
                </span>
                <span className="text-[15px] sm:text-[17px] text-blue-950 font-bold leading-relaxed">
                  {row.nizamy}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <Button
            size="lg"
            className="h-auto min-h-14 py-4 px-8 sm:px-10 max-w-full whitespace-normal rounded-full text-[16px] sm:text-[17px] font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.25)] group transition-all duration-300"
            onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.cta}
            {isRtl ? (
              <ArrowLeft className="ms-2 group-hover:-translate-x-1.5 transition-transform" />
            ) : (
              <ArrowRight className="ms-2 group-hover:translate-x-1.5 transition-transform" />
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
