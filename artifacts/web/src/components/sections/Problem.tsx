import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { EyeOff, Compass, Hourglass, TrendingDown, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const icons = [EyeOff, Compass, Hourglass, TrendingDown];

export function Problem() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "The real cost of manual HR",
      pains: [
        {
          title: "No real-time visibility",
          desc: "You only learn how your team performed at the end of the month — after the losses have already piled up.",
        },
        {
          title: "Decisions built on gut feeling",
          desc: "You judge commitment and delivery through impressions, not numbers.",
        },
        {
          title: "Exhausting follow-up with no result",
          desc: "You spend hours auditing and holding people accountable, with no real gain in productivity.",
        },
        {
          title: "Hidden waste keeps growing",
          desc: "Daily delays, stuck tasks, meetings with no outcomes… silent costs draining your profits.",
        },
      ],
      cta: "Discover how to stop the bleeding and take back control",
    },
    ar: {
      eyebrow: "التكلفة الحقيقية للموارد البشرية اليدوية",
      pains: [
        {
          title: "غياب الرؤية اللحظية",
          desc: "لا تعرف أداء فريقك إلا بعد نهاية الشهر، وحينها تكون الخسائر قد تراكمت.",
        },
        {
          title: "قرارات مبنية على الحدس",
          desc: "تحكم على الالتزام والإنجاز من خلال الانطباعات، لا من خلال الأرقام.",
        },
        {
          title: "متابعة مرهقة بلا نتيجة",
          desc: "تقضي ساعات في التدقيق والمحاسبة، دون تحسن حقيقي في الإنتاجية.",
        },
        {
          title: "الهدر الخفي يتضخم",
          desc: "تأخيرات يومية، مهام عالقة، واجتماعات بلا مخرجات… تكاليف صامتة تستنزف أرباحك.",
        },
      ],
      cta: "اكتشف كيف توقف هذا النزيف وتستعيد السيطرة",
    },
  };

  const t = content[language];

  return (
    <section id="problem" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <span className="inline-block text-[13px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-5 py-2 tracking-wider uppercase">
            {t.eyebrow}
          </span>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.pains.map((pain, idx) => {
            const Icon = icons[idx];
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx}
                className="rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100/60 p-10 flex flex-col sm:flex-row gap-6 group transition-all duration-400"
              >
                <div className="w-16 h-16 rounded-[1.25rem] bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 text-red-500">
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-slate-900 mb-3">{pain.title}</h3>
                  <p className="text-[17px] text-slate-500 leading-relaxed font-medium">{pain.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <Button
            size="lg"
            className="h-14 px-10 rounded-full text-[17px] font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.25)] group transition-all duration-300"
            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
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
