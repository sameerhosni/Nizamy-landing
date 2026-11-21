import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { provenResultsContent } from "@/lib/data/provenResults";
import { BarChart3 } from "lucide-react";
import { animate, useInView, motion, useReducedMotion } from "framer-motion";

function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (ref.current) ref.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }

    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
        }
      });
      return () => controls.stop();
    }
    return undefined;
  }, [isInView, value, prefix, suffix, duration, prefersReducedMotion, decimals]);

  return <span ref={ref} dir={suffix.includes("%") ? "ltr" : undefined} className="inline-block tabular-nums font-heading font-black">{prefix}{prefersReducedMotion ? value.toFixed(decimals) : (0).toFixed(decimals)}{suffix}</span>;
}

/** Arabic branch only: flip to true once real customer results are approved. English is unaffected. */
export const SHOW_CUSTOMER_RESULTS = false;

const arCustomerResults = {
  title: "شركات بدأت مع نظامي",
  card: ["[شعار العميل]", "[اسم الشركة · القطاع · عدد الموظفين]", "[اقتباس حقيقي من العميل]", "[نتيجة وحدة بالأرقام من تقرير العائد]"],
};

export function CaseStudies() {
  const { language } = useLanguage();
  if (language === "ar") {
    if (!SHOW_CUSTOMER_RESULTS) return null;
    return (
      <section id="use-cases" data-analytics-section="use-cases" data-analytics-name="Use Cases" dir="rtl" className="py-24 sm:py-32 bg-white scroll-mt-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] mb-6 text-slate-900 tracking-tight">{arCustomerResults.title}</h2>
          </div>
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
            <div className="bg-[#FAFAFA] rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-3">
              {arCustomerResults.card.map((line) => (
                <p key={line} className="text-sm font-medium text-slate-400">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return <CaseStudiesEn />;
}

function CaseStudiesEn() {
  const { language } = useLanguage();
  const t = provenResultsContent[language];
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="use-cases" data-analytics-section="use-cases" data-analytics-name="Use Cases" className="py-24 sm:py-32 bg-white scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] mb-6 text-slate-900 tracking-tight">
            <span>{t.headingPart1}</span>
            <span className="text-blue-600">{t.headingPart2}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">{t.subhead}</p>
          <p className="mt-5 text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">{t.evidenceNote}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 mb-16">
          {t.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : i * 0.1 }}
              className="bg-[#FAFAFA] rounded-[24px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-shadow duration-300"
            >
              <div className="absolute top-0 end-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={64} />
              </div>
              <div dir="ltr" className="text-5xl font-heading font-black text-blue-600 mb-3 tracking-tight flex items-baseline gap-1">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  duration={1.5}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
                <span className="text-3xl">{stat.suffix}</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {stat.label}
              </div>
              <div className="text-sm font-medium text-slate-500">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {t.charts.map((chart, idx) => (
            <motion.div
              key={idx}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white rounded-[24px] p-6 sm:p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <h3 className="text-[1.125rem] sm:text-xl font-bold text-slate-900 mb-2">{chart.title}</h3>
              <p className="text-sm text-slate-500 mb-8">{chart.caption}</p>
              <p className="text-sm text-slate-500 mb-8">{chart.improvementNote}</p>

              <div
                className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/30 pb-2"
                data-testid={`case-study-chart-${idx + 1}`}
                aria-label={chart.alt}
                dir="ltr"
              >
                <div className="min-w-[700px] lg:min-w-0">
                  <img
                    src={`${import.meta.env.BASE_URL}${chart.image}`}
                    alt={chart.alt}
                    className="block h-auto w-full max-w-none"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-12 text-center sm:text-start px-2">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[13px] text-slate-500 font-medium tracking-wide mb-2"
          >
            {t.note}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[12px] text-slate-400"
          >
            {t.explanationNote}
          </motion.p>
        </div>
      </div>
    </section>
  );
}