import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ArrowLeft, Percent, PiggyBank, TrendingUp, BellRing } from "lucide-react";
import { motion } from "framer-motion";

const gainIcons = [Percent, PiggyBank, TrendingUp, BellRing];

export function ReturnModel() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "Return Model",
      title: "Don't pay a subscription… ",
      titleAccent: "invest in an asset that pays you back every month.",
      subhead:
        "With Nizamy, the more your team's commitment improves and the less time they waste, the more of your subscription you automatically recover. And for the first time, you can measure the return on every riyal you spend managing your team's performance.",
      gainsTitle: "How the subscription turns into a gain",
      gains: [
        {
          title: "90% commitment = 15% back",
          desc: "Recover 15% of your subscription at 90% commitment — up to 30% at 100%.",
        },
        {
          title: "4x the subscription in savings",
          desc: "A client with 50 employees saved 120,000 SAR a year in eliminated waste — four times their subscription.",
        },
        {
          title: "+20% productivity, zero new hires",
          desc: "A 20% productivity increase adds thousands of riyals in revenue without hiring anyone new.",
        },
        {
          title: "Early alerts prevent losses",
          desc: "One early warning that saves a project from delay can prevent 50,000 SAR in penalties or lost clients.",
        },
      ],
      clarifier:
        "What does the 30% mean? A mix of system credit, funded rewards value for your team, and the value of time saved through better performance.",
      cta: "Calculate your return now",
    },
    ar: {
      eyebrow: "نموذج العائد",
      title: "لا تدفع اشتراكًا… ",
      titleAccent: "بل تستثمر في أصل يعود عليك كل شهر.",
      subhead:
        "في نظامي، كلما تحسن التزام فريقك وقل هدر وقتهم، استرددت جزءًا من اشتراكك تلقائيًا. ولأول مرة يمكنك قياس العائد على كل ريال تنفقه على إدارة أداء موظفيك.",
      gainsTitle: "كيف يتحول الاشتراك إلى مكسب",
      gains: [
        {
          title: "التزام 90% = استرداد 15%",
          desc: "نسبة التزام 90% تعني استرداد 15% من الاشتراك، وتصل حتى 30% عند 100%.",
        },
        {
          title: "توفير يعادل 4 أضعاف الاشتراك",
          desc: "عميل بـ50 موظفًا وفر 120 ألف ريال سنويًا من الهدر، ما يعادل 4 أضعاف اشتراكه.",
        },
        {
          title: "إنتاجية أعلى دون توظيف جديد",
          desc: "زيادة الإنتاجية بـ20% تضيف آلاف الريالات إيرادات دون توظيف جديد.",
        },
        {
          title: "تنبيه مبكر يمنع الخسائر",
          desc: "تنبيه مبكر يمنع تأخير مشروع قد يوفر 50 ألف ريال غرامات أو خسائر عملاء.",
        },
      ],
      clarifier:
        "وش يعني عائد حتى 30%؟ مزيج من رصيد في النظام، وقيمة مكافآت ممولة لفريقك، وقيمة الوقت المتوفر من تحسّن الأداء.",
      cta: "احسب عائدك الآن",
    },
  };

  const t = content[language];

  return (
    <section
      id="return-model"
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
          <span className="inline-block text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-6 uppercase tracking-wider">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.2] mb-6 tracking-tight">
            <span className="text-slate-900">{t.title}</span>
            <span className="text-blue-600">{t.titleAccent}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto">
            {t.subhead}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-heading font-black text-slate-900 text-center mb-12 tracking-tight"
          >
            {t.gainsTitle}
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
          </div>
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
            className="h-14 px-10 rounded-full text-[17px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] group transition-all duration-300"
            onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.cta}
            {isRtl ? (
              <ArrowLeft className="ms-2 group-hover:-translate-x-1.5 transition-transform" />
            ) : (
              <ArrowRight className="ms-2 group-hover:translate-x-1.5 transition-transform" />
            )}
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-2xl mx-auto mt-20 pt-10 border-t border-slate-100"
        >
          <div className="flex items-start justify-center gap-4 bg-slate-50 p-6 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
              {t.clarifier}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
