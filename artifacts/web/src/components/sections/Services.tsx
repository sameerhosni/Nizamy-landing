import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, LayoutDashboard, Lightbulb, Gift, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import manPointingPhone from "@/assets/availo/man-pointing-phone.png";

const diffIcons = [LayoutDashboard, Lightbulb, Gift, RefreshCw];

export function Services() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "The Solution",
      heading: "Turn hidden waste into visible profit.",
      pitch:
        "You don't need more chasing. You need clear visibility. Nizamy gathers your team's daily data — attendance, commitment, performance — and turns it into a single dashboard that shows you where returns are leaking, and where you can win them back.",
      diffTitle: "How Nizamy is different",
      diffs: [
        {
          title: "Full operational visibility",
          desc: "The impact of attendance and delays on projects and costs — not just attendance numbers.",
        },
        {
          title: "Data turned into decisions",
          desc: "Actionable recommendations like \"this department needs an incentive push\".",
        },
        {
          title: "Smart incentives, not punishment",
          desc: "A rewards system that links commitment to instant rewards.",
        },
        {
          title: "Recover part of your subscription",
          desc: "The higher the commitment, the lower your real cost.",
        },
      ],
      cta: "See how Nizamy turns your daily data into profit",
    },
    ar: {
      eyebrow: "الحل",
      heading: "حوّل الهدر الخفي إلى أرباح مرئية.",
      pitch:
        "لا تحتاج إلى مزيد من المتابعة. تحتاج إلى رؤية واضحة. نظامي يجمع بيانات فريقك اليومية — الحضور، الالتزام، الأداء — ثم يحولها إلى لوحة تحكم واحدة تكشف لك أين يضيع العائد، وأين يمكنك استعادته.",
      diffTitle: "كيف يختلف نظامي",
      diffs: [
        {
          title: "رؤية تشغيلية شاملة",
          desc: "أثر الحضور والتأخير على المشاريع والتكاليف، وليس مجرد أرقام حضور.",
        },
        {
          title: "تحويل البيانات إلى قرارات",
          desc: "توصيات قابلة للتنفيذ مثل «هذا القسم يحتاج تحفيزًا».",
        },
        {
          title: "تحفيز ذكي لا عقاب",
          desc: "نظام مكافآت يربط الالتزام بمكافآت فورية.",
        },
        {
          title: "استرداد جزء من اشتراكك",
          desc: "كلما ارتفع الالتزام، انخفضت تكلفتك الفعلية.",
        },
      ],
      cta: "شاهد كيف تحول نظامي بياناتك اليومية إلى أرباح",
    },
  };

  const t = content[language];

  return (
    <section id="services" className="py-24 sm:py-32 bg-white scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-[#0A1A3A] rounded-[3rem] overflow-hidden relative shadow-[0_20px_60px_rgba(10,26,58,0.15)]"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="grid md:grid-cols-2 items-center relative z-10">
            <div className={`p-10 sm:p-16 lg:p-24 text-white ${isRtl ? "md:order-2" : "md:order-1"}`}>
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-bold text-white mb-8 border border-white/10">
                {t.eyebrow}
              </div>
              <h2 className="text-[2.5rem] sm:text-5xl md:text-[3.5rem] font-heading font-black leading-[1.15] mb-8 tracking-tight">
                {t.heading}
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-lg">
                {t.pitch}
              </p>
              <Button
                size="lg"
                className="h-14 px-10 rounded-full text-[17px] font-bold bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] group"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.cta}
                {isRtl ? (
                  <ArrowLeft className="ms-2 group-hover:-translate-x-1.5 transition-transform" />
                ) : (
                  <ArrowRight className="ms-2 group-hover:translate-x-1.5 transition-transform" />
                )}
              </Button>
            </div>

            <div className={`relative h-full flex items-end justify-center pt-10 ${isRtl ? "md:order-1" : "md:order-2"}`}>
              <img
                src={manPointingPhone}
                alt={t.heading}
                className="relative z-10 w-[90%] max-w-[500px] object-contain object-bottom drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </motion.div>

        {/* How Nizamy is different */}
        <div className="max-w-6xl mx-auto mt-24">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-heading font-black text-slate-900 text-center mb-16 tracking-tight"
          >
            {t.diffTitle}
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.diffs.map((d, i) => {
              const Icon = diffIcons[i];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={i}
                  className="rounded-[24px] bg-slate-50 border border-slate-100 p-8 text-start hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-400"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-slate-900" />
                  </div>
                  <h4 className="font-heading font-black text-slate-900 text-xl mb-3 leading-snug">{d.title}</h4>
                  <p className="text-[15px] text-slate-500 leading-relaxed font-medium">{d.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
