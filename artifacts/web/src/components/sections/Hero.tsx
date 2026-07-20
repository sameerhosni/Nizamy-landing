import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, TrendingDown, Award, BarChart3, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroManPhones from "@/assets/availo/hero-man-phones.png";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-Powered HR · For Saudi SMEs",
      headlinePart1: "Every other HR system is a cost. ",
      headlinePart2: "Nizamy is a return.",
      subtitle:
        "Even the best teams become a costly burden when commitment fades and visibility is lost. Nizamy doesn't just track attendance — it turns your team's daily commitment into smart operational decisions that boost productivity, cut waste, and deliver a real return on your biggest investment: your people.",
      primaryCta: "Book a Demo",
      secondaryCta: "Calculate Your Expected Return",
      highlights: [
        {
          title: "Hidden waste is draining your profits",
          desc: "Spot where your team's time and effort leak away before they compound into financial loss.",
        },
        {
          title: "High performance starts with smart incentives",
          desc: "A flexible rewards system links commitment to achievement, turning daily behavior into measurable results.",
        },
        {
          title: "Decisions built on certainty, not guesswork",
          desc: "Real-time data on attendance, commitment, and productivity gives you full operational visibility.",
        },
        {
          title: "Automatically recover part of your subscription",
          desc: "The more committed and productive your team becomes on the platform, the lower your subscription cost — through our exclusive annual return model.",
        },
      ],
      trustBar: [
        "Starts at 3 SAR per employee/month",
        "Ready in minutes",
        "Built for Saudi SMEs",
        "Annual return tied to your team's performance",
      ],
    },
    ar: {
      eyebrow: "نظام موارد بشرية بالذكاء الاصطناعي",
      headlinePart1: "كل أنظمة الموارد البشرية الأخرى تكلفة. ",
      headlinePart2: "نظامي عائد.",
      subtitle:
        "حتى أفضل الفرق تتحول إلى تكلفة باهظة إذا غاب الالتزام وضاعت الرؤية. نظامي لا يدير حضور موظفيك فحسب، بل يحوّل التزامهم اليومي إلى قرارات تشغيلية ذكية ترفع الإنتاجية، تقلّص الهدر، وتُعيد إليك عائدًا حقيقيًا على استثمارك الأكبر: فريق عملك.",
      primaryCta: "احجز عرضًا توضيحيًا",
      secondaryCta: "احسب العائد المتوقع لمنشأتك",
      highlights: [
        {
          title: "الهدر الخفي يستنزف أرباحك",
          desc: "ارصد أين يضيع وقت فريقك وجُهده قبل أن يتحول إلى خسارة مالية تراكمية.",
        },
        {
          title: "الأداء العالي يبدأ بتحفيز ذكي",
          desc: "نظام مكافآت مرن يربط الالتزام بالإنجاز، فيتحول السلوك اليومي إلى نتائج قابلة للقياس.",
        },
        {
          title: "قرارات مبنية على يقين، لا تخمين",
          desc: "بيانات لحظية عن الحضور والالتزام والإنتاجية تمنحك رؤية تشغيلية كاملة لشركتك.",
        },
        {
          title: "استرد جزءًا من اشتراكك تلقائيًا",
          desc: "كلما زاد التزام فريقك وتحسّن أداؤهم على المنصة، انخفضت تكلفة اشتراكك من خلال نموذج العائد السنوي الحصري.",
        },
      ],
      trustBar: [
        "يبدأ من 3 ريالات للموظف شهريًا",
        "جاهز خلال دقائق",
        "مصمم للمنشآت الصغيرة والمتوسطة في السعودية",
        "عائد سنوي مرتبط بأداء فريقك",
      ],
    },
  };

  const t = content[language];
  const highlightIcons = [TrendingDown, Award, BarChart3, RefreshCw];

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFAFA]">
      {/* Soft background glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 px-5 py-2 text-sm font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            {t.eyebrow}
          </div>

          <h1 className="text-[2.75rem] sm:text-5xl md:text-[4rem] font-heading font-black leading-[1.15] tracking-tight text-slate-900">
            {t.headlinePart1}
            <span className="text-blue-600 block sm:inline mt-2 sm:mt-0">{t.headlinePart2}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-10 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] group transition-all duration-300"
              onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.primaryCta}
              {isRtl ? (
                <ArrowLeft className="ms-2 group-hover:-translate-x-1.5 transition-transform" />
              ) : (
                <ArrowRight className="ms-2 group-hover:translate-x-1.5 transition-transform" />
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-10 rounded-full text-lg font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300"
              onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.secondaryCta}
            </Button>
          </div>
        </motion.div>

        {/* Value Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {t.highlights.map((h, i) => {
            const Icon = highlightIcons[i];
            return (
              <div
                key={i}
                className="rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 p-8 text-start hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-12 h-12 rounded-[16px] bg-blue-50 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 mb-3 text-lg leading-snug">{h.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{h.desc}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Trust Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-20"
        >
          {t.trustBar.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[15px] font-semibold text-slate-600 bg-white/50 py-2 px-4 rounded-full border border-slate-200/50">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              {item}
            </div>
          ))}
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-8 border-white bg-white"
        >
          <img
            src={heroManPhones}
            alt="Nizamy HR Platform"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
