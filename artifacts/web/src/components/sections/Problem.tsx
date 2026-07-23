import { useLanguage } from "@/lib/i18n";
import { EyeOff, Compass, Hourglass, TrendingDown } from "lucide-react";
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
          title: "You find out too late",
          desc: "You only learn how your team performed at the end of the month — after the losses have already piled up.",
        },
        {
          title: "Guesswork, not numbers",
          desc: "You judge commitment and delivery through impressions, not numbers.",
        },
        {
          title: "Admin time you never get back",
          desc: "You spend hours auditing and holding people accountable, with no real gain in productivity.",
        },
        {
          title: "Silent waste, real losses",
          desc: "Daily delays, stuck tasks, meetings with no outcomes… silent costs draining your profits.",
        },
      ],
    },
    ar: {
      eyebrow: "التكلفة الحقيقية للموارد البشرية اليدوية",
      pains: [
        {
          title: "تعرف المشكلة متأخرًا",
          desc: "لا تعرف أداء فريقك إلا بعد نهاية الشهر، وحينها تكون الخسائر قد تراكمت.",
        },
        {
          title: "تخمين… بدل أرقام",
          desc: "تحكم على الالتزام والإنجاز من خلال الانطباعات، لا من خلال الأرقام.",
        },
        {
          title: "وقت إداري لا يرجع",
          desc: "تقضي ساعات في التدقيق والمحاسبة، دون تحسن حقيقي في الإنتاجية.",
        },
        {
          title: "هدر صامت… وخسائر حقيقية",
          desc: "تأخيرات يومية، مهام عالقة، واجتماعات بلا مخرجات… تكاليف صامتة تستنزف أرباحك.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section id="problem" data-analytics-section="problem" data-analytics-name="Problem" className="py-24 sm:py-32 bg-[#FAFAFA] scroll-mt-16">
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
      </div>
    </section>
  );
}
