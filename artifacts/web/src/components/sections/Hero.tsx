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
      headlinePart1: "Every HR system costs you.",
      headlinePart2: "Nizamy HR gives it back.",
      subtitle: "The first performance-driven HR platform that returns up to 30% of your subscription cost based on actual team improvement.",
      primaryCta: "Book Early Access",
      secondaryCta: "See the Math",
    },
    ar: {
      eyebrow: "نظام موارد بشرية بالذكاء الاصطناعي · للشركات السعودية",
      headlinePart1: "كل أنظمة الموارد البشرية تُكلّفك.",
      headlinePart2: "نظامي اتش آر يعيد لك.",
      subtitle: "أول منصة موارد بشرية مبنية على الأداء، تعيد لك حتى 30% من قيمة اشتراكك السنوي بناءً على التحسن الفعلي في أداء فريقك.",
      primaryCta: "احجز وصولك المبكر",
      secondaryCta: "اكتشف الحسبة",
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

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-heading font-black leading-[1.1] tracking-tight">
            <span className="text-white block mb-2">{t.headlinePart1}</span>
            <span className="text-gradient-primary block">{t.headlinePart2}</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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
              onClick={() => document.getElementById("return-model")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.secondaryCta}
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
