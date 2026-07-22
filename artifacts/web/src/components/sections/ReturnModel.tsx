import { useLanguage } from "@/lib/i18n";
import { Percent, PiggyBank, TrendingUp, BellRing } from "lucide-react";
import { motion } from "framer-motion";

const gainIcons = [Percent, PiggyBank, TrendingUp, BellRing];

export function ReturnModel() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "Return Model",
      title: "Because a subscription should… ",
      titleAccent: "return value to you.",
      subhead:
        "Less time on admin work. Higher team commitment. Better productivity. Faster decisions. That's the real return of an HR system — and with Nizamy, the more your team improves, the more of your subscription you recover automatically.",
      gainsTitle: "How the subscription turns into a gain",
      gains: [
        {
          title: "More commitment = more back",
          desc: "The more committed your team is, the more of your subscription you get back — rising all the way up to 30%.",
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
    },
    ar: {
      eyebrow: "نموذج العائد",
      title: "لأن الاشتراك المفروض… ",
      titleAccent: "يرجّع لك قيمة.",
      subhead:
        "وقت أقل في الأعمال الإدارية. التزام أعلى من الفريق. إنتاجية أفضل. قرارات أسرع. هذا هو العائد الحقيقي من نظام HR — وفي نظامي، كلما تحسن أداء فريقك استرددت جزءًا من اشتراكك تلقائيًا.",
      gainsTitle: "كيف يتحول الاشتراك إلى مكسب",
      gains: [
        {
          title: "التزام أعلى = عائد أكبر",
          desc: "كلما زاد التزام موظفيك، زاد ما تسترده من اشتراكك — ليصل حتى 30%.",
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

      </div>
    </section>
  );
}
