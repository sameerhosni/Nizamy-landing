import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Database, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const stepIcons = [Database, Activity, Sparkles];

export function HowItWorks() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "How the Platform Works",
      heading: "Three steps between data chaos and decisions that protect your profits.",
      subhead: "Nizamy is built to take you from manual follow-up to smart visibility in minutes — whatever your team size.",
      steps: [
        {
          title: "Smart collection",
          desc: "Attendance, tasks, and delay data gather automatically into a single dashboard.",
        },
        {
          title: "Instant analysis",
          desc: "Reveals where waste is happening right now, and which team needs support.",
        },
        {
          title: "Recommendation & action",
          desc: "Instant recommendations with automatic tuning of the rewards system.",
        },
      ],
      cta: "See how the platform works in your own demo",
    },
    ar: {
      eyebrow: "كيف تعمل المنصة؟",
      heading: "ثلاث خطوات تفصل بين فوضى البيانات وقرارات تحمي أرباحك.",
      subhead: "صُمم نظامي ليأخذك من المتابعة اليدوية إلى الرؤية الذكية في دقائق، مهما كان حجم فريقك.",
      steps: [
        {
          title: "التجميع الذكي",
          desc: "بيانات الحضور، المهام، والتأخير تتجمع تلقائيًا في لوحة واحدة.",
        },
        {
          title: "التحليل الفوري",
          desc: "يكشف أين يحدث الهدر الآن، وأي فريق يحتاج دعمًا.",
        },
        {
          title: "التوصية والإجراء",
          desc: "توصيات فورية مع ضبط تلقائي لنظام المكافآت.",
        },
      ],
      cta: "اكتشف كيف تعمل المنصة في عرض توضيحي خاص بك",
    },
  };

  const t = content[language];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white scroll-mt-16">
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

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {t.steps.map((step, idx) => {
            const Icon = stepIcons[idx];
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                key={idx}
                className="relative rounded-[2rem] bg-[#FAFAFA] border border-slate-100 p-10 text-start hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-400"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-slate-900 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.2)]">
                    <Icon size={28} />
                  </div>
                  <span className="text-6xl font-heading font-black text-slate-200 leading-none select-none">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-heading font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-[17px] text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="h-14 px-10 rounded-full text-[17px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] group transition-all duration-300"
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
