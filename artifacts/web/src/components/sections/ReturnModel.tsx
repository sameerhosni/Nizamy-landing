import { useLanguage } from "@/lib/i18n";
import { Percent, PiggyBank, TrendingUp, BellRing } from "lucide-react";
import { motion } from "framer-motion";
import { goToStart } from "@/components/home/homeActions";
import { ReturnEvidence } from "@/components/sections/ReturnEvidence";

const gainIcons = [Percent, PiggyBank, TrendingUp, BellRing];

export function ReturnModel() {
  const { language, dir } = useLanguage();
  void dir;

  const content = {
    en: {
      eyebrow: "Return on investment in HR", title: "Less manual HR administration. ", titleAccent: "More value for your business.",
      subhead: "The return from Nizamy starts with time saved on attendance, employee requests and payroll reports. Less manual follow-up can reduce HR administration costs and give your team more time for your business.",
      measurement: "Measure the difference: compare the hours spent on these HR processes before and after Nizamy. Multiply the hours saved by your team's hourly cost, then compare that estimated time value with the subscription cost. Time saved is not a guaranteed cash saving or subscription refund.",
      gainsTitle: "Where the savings come from",
      gains: [
        {title: "Less attendance administration", desc: "Bring check-in records together instead of collecting them from separate files and devices."},
        {title: "Fewer scattered requests", desc: "Manage employee requests in one place with AI assistance, reducing repeated messages and follow-up."},
        {title: "Faster payroll preparation", desc: "Use organized attendance records and payroll reports to reduce manual preparation and review."},
        {title: "A clearer view of your team", desc: "Review attendance and use rewards to encourage commitment. Evaluate improvements against your own starting point."},
      ],
    },
    ar: {
      eyebrow: "", title: "لا تصدقنا… خلّ الأرقام تتكلم.", titleAccent: "",
      subhead: "نظامي يحسب لك العائد بالريال داخل التطبيق، من بيانات شركتك أنت.",
      measurement: "أول ١٥ يوم، نظامي يقيس نقطة البداية تلقائيًا. بعدها تشوف الفرق بالريال.",
      gainsTitle: "",
      gains: [
        {title: "تحسّن الأداء", desc: "كيف تغيّر التزام فريقك بالحضور من أول ما بدأت."},
        {title: "الولاء والتفاعل", desc: "كم موظف صار يتفاعل، يكسب، ويستبدل."},
        {title: "الوقت والتكلفة", desc: "كم ساعة ومجهود وفّرت على الإدارة."},
      ],
      cta: "ابدأ مجانًا وشوف العائد بنفسك",
    },
  };

  const t = content[language];
  const isAr = language === "ar";
  const cta = "cta" in t ? t.cta : null;

  return (
    <section
      id="return-model"
      data-analytics-section="return-model"
      data-analytics-name="Return Model"
      className="py-24 sm:py-32 bg-white scroll-mt-16 relative"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          {t.eyebrow && <span className="inline-block text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            {t.eyebrow}
          </span>}
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.2] mb-6 tracking-tight">
            <span className="text-slate-900">{t.title}</span>
            <span className="text-blue-600">{t.titleAccent}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto">
            {t.subhead}
          </p>
        </motion.div>

        {isAr && <ReturnEvidence />}

        <div className="max-w-5xl mx-auto">
          {t.gainsTitle && <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-heading font-black text-slate-900 text-center mb-12 tracking-tight"
          >
            {t.gainsTitle}
          </motion.h3>}
          {!isAr && <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {t.gains.map((gain, idx) => {
              const Icon = gainIcons[idx];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx}
                  className="rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 p-10 flex gap-6 group transition-all duration-400"
                >
                  <div className="w-16 h-16 rounded-[1.25rem] bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-heading font-black text-slate-900 mb-3">{gain.title}</h4>
                    <p className="text-[17px] text-slate-500 leading-relaxed font-medium">{gain.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>}
          {!isAr && <p className="mt-10 text-base text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">
            {t.measurement}
          </p>}
          {cta && (
            <div className="mt-8 flex justify-center">
              <button type="button" onClick={goToStart} className="rounded-full bg-blue-600 px-8 py-4 text-[17px] font-bold text-white hover:bg-blue-700 transition-colors">
                {cta}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
