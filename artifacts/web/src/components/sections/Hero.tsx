import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-Powered HR · For Saudi SMEs",
      headline: "Every riyal you spend on your team — it's time to earn it back.",
      subtitle: "Even your best team becomes an expensive burden when commitment fades and visibility disappears. Nizamy doesn't just track attendance — it turns daily team behavior into smart operational decisions that raise productivity, cut waste, and return real value on your biggest investment: your people.",
      primaryCta: "Book a Demo",
      secondaryCta: "Calculate Your Expected Return",
      highlights: [
        { title: "Hidden waste drains your profit", desc: "Track where your team's time and effort disappear before it becomes compounding financial loss." },
        { title: "High performance starts with smart motivation", desc: "A flexible reward system that links commitment to achievement — turning daily behavior into measurable results." },
        { title: "Decisions built on certainty, not guesswork", desc: "Real-time data on attendance, commitment, and productivity gives you complete operational visibility." },
        { title: "Automatically recover part of your subscription", desc: "The more your team's commitment improves on the platform, the lower your effective subscription cost." },
      ],
    },
    ar: {
      eyebrow: "نظام موارد بشرية بالذكاء الاصطناعي · للشركات السعودية",
      headline: "كل ريال تصرفه على موظفيك... حان وقت استرداده أرباحًا.",
      subtitle: "حتى أفضل الفرق تتحول إلى تكلفة باهظة إذا غاب الالتزام وضاعت الرؤية. نظامي لا يدير حضور موظفيك فحسب، بل يحوّل التزامهم اليومي إلى قرارات تشغيلية ذكية ترفع الإنتاجية، تقلّص الهدر، وتُعيد إليك عائدًا حقيقيًا على استثمارك الأكبر: فريق عملك.",
      primaryCta: "احجز عرضًا توضيحيًا",
      secondaryCta: "احسب العائد المتوقع لمنشأتك",
      highlights: [
        { title: "الهدر الخفي يستنزف أرباحك", desc: "ارصد أين يضيع وقت فريقك وجُهده قبل أن يتحول إلى خسارة مالية تراكمية." },
        { title: "الأداء العالي يبدأ بتحفيز ذكي", desc: "نظام مكافآت مرن يربط الالتزام بالإنجاز، فيتحول السلوك اليومي إلى نتائج قابلة للقياس." },
        { title: "قرارات مبنية على يقين، لا تخمين", desc: "بيانات لحظية عن الحضور والالتزام والإنتاجية تمنحك رؤية تشغيلية كاملة لشركتك." },
        { title: "استرد جزءًا من اشتراكك تلقائيًا", desc: "كلما زاد التزام فريقك وتحسّن أداؤهم على المنصة، انخفضت تكلفة اشتراكك من خلال نموذج العائد السنوي الحصري." },
      ],
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-24 pb-20 overflow-hidden bg-[#0a0a0a]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/90 to-[#0a0a0a]" />
        
        {/* Soft Blue Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          
          <div className="inline-flex items-center gap-2.5 rounded-full glassmorphic-dark px-5 py-2 text-sm font-semibold text-blue-300 border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
            {t.eyebrow}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-heading font-black leading-[1.1] tracking-tight text-white">
            {t.headline}
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-10 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow border border-blue-500/50 group"
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
              className="w-full sm:w-auto h-14 px-10 rounded-full text-lg font-bold border-white/20 text-white hover:bg-white/10 hover:text-white glassmorphic-dark"
              onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.secondaryCta}
            </Button>
          </div>

          {/* Value highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto pt-6 text-start rtl:text-right">
            {t.highlights.map((h, idx) => (
              <div key={idx} className="rounded-2xl glassmorphic-dark border border-white/8 p-5 hover:border-white/15 transition-colors duration-300">
                <p className="text-sm font-heading font-black text-white mb-1">{h.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{h.desc}</p>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
