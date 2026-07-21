import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, TrendingDown, Award, BarChart3, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroManPhones from "@/assets/hero-man-phones.png";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-Powered HR · For Saudi SMEs",
      headlinePart1: "An HR system that manages your team… ",
      headlinePart2: "and saves you up to 30% of your subscription.",
      subtitle:
        "Every hour you save. Every mistake you avoid. Every employee who commits more. It all comes back as real value for your business.",
      primaryCta: "Book a Demo",
      secondaryCta: "Calculate Your Expected Return",
      highlights: [
        {
          title: "Stop waste before it costs you",
          desc: "Spot where your team's time and effort leak away before they compound into financial loss.",
        },
        {
          title: "Motivated team, higher performance",
          desc: "A flexible rewards system links commitment to achievement, turning daily behavior into measurable results.",
        },
        {
          title: "Decide with numbers, not guesses",
          desc: "Real-time data on attendance, commitment, and productivity gives you full operational visibility.",
        },
        {
          title: "Get back up to 30% of your subscription",
          desc: "The more committed and productive your team becomes on the platform, the lower your subscription cost — through our exclusive annual return model.",
        },
      ],
      trustBar: [
        "Starts at 3 SAR per employee/month",
        "Ready in minutes",
        "Annual return tied to your team's performance",
      ],
    },
    ar: {
      eyebrow: "نظام موارد بشرية بالذكاء الاصطناعي",
      headlinePart1: "نظام HR يدير فريقك… ",
      headlinePart2: "ويوفر لك حتى 30% من اشتراكك.",
      subtitle:
        "كل ساعة توفرها. كل خطأ تتجنبه. كل موظف يلتزم أكثر. كلها ترجع كقيمة حقيقية لمنشأتك.",
      primaryCta: "احجز عرضًا توضيحيًا",
      secondaryCta: "احسب العائد المتوقع لمنشأتك",
      highlights: [
        {
          title: "أوقف الهدر قبل ما يكلّفك",
          desc: "ارصد أين يضيع وقت فريقك وجُهده قبل أن يتحول إلى خسارة مالية تراكمية.",
        },
        {
          title: "فريق محفّز… أداء أعلى",
          desc: "نظام مكافآت مرن يربط الالتزام بالإنجاز، فيتحول السلوك اليومي إلى نتائج قابلة للقياس.",
        },
        {
          title: "قراراتك بالأرقام، لا بالتخمين",
          desc: "بيانات لحظية عن الحضور والالتزام والإنتاجية تمنحك رؤية تشغيلية كاملة لشركتك.",
        },
        {
          title: "استرجع حتى 30% من اشتراكك",
          desc: "كلما زاد التزام فريقك وتحسّن أداؤهم على المنصة، انخفضت تكلفة اشتراكك من خلال نموذج العائد السنوي الحصري.",
        },
      ],
      trustBar: [
        "يبدأ من 3 ريالات للموظف شهريًا",
        "جاهز خلال دقائق",
        "قيمة مسترجعه مرتبطة بأداء فريقك",
      ],
    },
  };

  const t = content[language];
  const highlightIcons = [TrendingDown, Award, BarChart3, RefreshCw];

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFAFA]">
      {/* Full-bleed hero background image with directional fade */}
      <div className="absolute inset-x-0 top-0 h-full max-h-[900px] pointer-events-none overflow-hidden">
        <img
          src={heroManPhones}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* Fade toward the content side */}
        <div
          className={`absolute inset-0 ${
            isRtl
              ? "bg-gradient-to-l from-[#FAFAFA] from-35% via-[#FAFAFA]/80 via-60% to-[#FAFAFA]/5"
              : "bg-gradient-to-r from-[#FAFAFA] from-35% via-[#FAFAFA]/80 via-60% to-[#FAFAFA]/5"
          }`}
        />
        {/* Fade out toward the bottom so cards sit on a clean surface */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAFAFA]/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-16 lg:min-h-[520px] flex items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-start max-w-2xl mx-auto lg:mx-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 px-5 py-2 text-sm font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            {t.eyebrow}
          </div>

          <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-heading font-black leading-[1.15] tracking-tight text-slate-900">
            {t.headlinePart1}
            <span className="text-blue-600 block sm:inline mt-2 sm:mt-0">{t.headlinePart2}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
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
        </div>

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
          className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {t.trustBar.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[15px] font-semibold text-slate-600 bg-white/50 py-2 px-4 rounded-full border border-slate-200/50">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
