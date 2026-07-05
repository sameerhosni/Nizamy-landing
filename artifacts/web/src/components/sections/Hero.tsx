import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, TrendingUp, Users, Zap } from "lucide-react";

const chartBars = [32, 44, 38, 57, 52, 68, 61, 77, 72, 85, 80, 95];

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-powered HR, built for Saudi SMEs",
      headlinePart1: "Every other HR system is a cost.",
      headlinePart2: "Mr-Hr is a return.",
      subtitle: "Mr-Hr returns up to 30% of your annual subscription cost back to you — every year.",
      primaryCta: "Calculate my return",
      secondaryCta: "Become a Design Partner",
      chips: [
        "Up to 30% annual return",
        "SAR 5 per employee / month",
        "One-minute onboarding",
        "Zero penalties or chasing"
      ],
      mockup: {
        label: "Annual Return Dashboard",
        period: "2024 · Live estimate",
        returnLabel: "Estimated annual return",
        rateLabel: "Of subscription returned",
        trend: "+15% vs last year",
        chart: "Monthly return trend",
        breakdown: [
          { label: "Performance", value: "SAR 6,200" },
          { label: "Rewards", value: "SAR 4,150" },
          { label: "Points", value: "SAR 2,100" },
        ],
        returnBadge: "+30% Return",
      }
    },
    ar: {
      eyebrow: "موارد بشرية بالذكاء الاصطناعي للمنشآت السعودية",
      headlinePart1: "كل أنظمة الموارد البشرية تكلفة.",
      headlinePart2: "مستر إتش آر عائد.",
      subtitle: "يُعيد إليك مستر إتش آر ما يصل إلى ٣٠٪ من تكلفة اشتراكك السنوي — كل عام.",
      primaryCta: "احسب العائد",
      secondaryCta: "وصول مبكر مجاني",
      chips: [
        "حتى ٣٠٪ عائد سنوي",
        "٥ ريالات للموظف شهرياً",
        "تسجيل في دقيقة واحدة",
        "صفر غرامات أو ملاحقة"
      ],
      mockup: {
        label: "لوحة العائد السنوي",
        period: "٢٠٢٤ · تقدير مباشر",
        returnLabel: "العائد السنوي التقديري",
        rateLabel: "من الاشتراك يعود إليك",
        trend: "+١٥٪ مقارنة بالعام الماضي",
        chart: "اتجاه العائد الشهري",
        breakdown: [
          { label: "الأداء", value: "٦٬٢٠٠ ريال" },
          { label: "المكافآت", value: "٤٬١٥٠ ريال" },
          { label: "النقاط", value: "٢٬١٠٠ ريال" },
        ],
        returnBadge: "عائد ٣٠٪+",
      }
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center pt-20 pb-12 overflow-hidden bg-[#0A0B14]">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[60%] bg-violet-600/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-indigo-500/15 blur-[140px] rounded-full" />
        <div className="absolute top-[35%] right-[25%] w-[25%] h-[30%] bg-primary/8 blur-[80px] rounded-full" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1fr_430px] gap-12 items-center max-w-6xl mx-auto">

          {/* Left: copy */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {t.eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/15 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t.eyebrow}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-2xl md:text-3xl text-white/50 font-medium leading-snug">
                {t.headlinePart1}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-gradient-primary">
                {t.headlinePart2}
              </h1>
            </div>

            <p className="text-lg md:text-xl text-white/60 max-w-lg leading-relaxed">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-7 shadow-glow rounded-xl group"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.primaryCta}
                {isRtl
                  ? <ArrowLeft className="ms-2 group-hover:-translate-x-1 transition-transform" size={18} />
                  : <ArrowRight className="ms-2 group-hover:translate-x-1 transition-transform" size={18} />}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-base h-12 px-7 rounded-xl text-white/70 hover:text-white hover:bg-white/10 border border-white/15"
                onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.secondaryCta}
              </Button>
            </div>

            {/* Checkmark proof points */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2">
              {t.chips.map((chip, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-white/60">
                  <div className="w-4 h-4 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center shrink-0">
                    <Check size={9} className="text-primary" strokeWidth={3} />
                  </div>
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* Right: return dashboard mockup */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative">
            <div className="relative rounded-2xl bg-white/[0.06] border border-white/[0.12] backdrop-blur-2xl p-6 shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{t.mockup.label}</div>
                    <div className="text-xs text-white/40">{t.mockup.period}</div>
                  </div>
                </div>
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1 text-xs font-semibold text-emerald-400">
                  {t.mockup.trend}
                </div>
              </div>

              {/* Big return number */}
              <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">{t.mockup.returnLabel}</div>
                <div className="text-4xl font-black text-white mb-1">SAR 12,450</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[30%] bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 rounded-full" />
                  </div>
                  <span className="text-xs font-semibold text-white/50">30% {t.mockup.rateLabel}</span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="mb-6">
                <div className="text-xs font-medium text-white/30 mb-2">{t.mockup.chart}</div>
                <div className="flex items-end gap-1 h-14">
                  {chartBars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-500"
                      style={{
                        height: `${h}%`,
                        background: i === chartBars.length - 1
                          ? 'linear-gradient(to top, #f97316, #ec4899)'
                          : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                {t.mockup.breakdown.map((item, i) => (
                  <div key={i} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3">
                    <div className="text-xs text-white/40 mb-1">{item.label}</div>
                    <div className="text-sm font-bold text-white/90">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 rtl:-right-auto rtl:-left-4 bg-primary text-white text-xs font-bold rounded-full px-3 py-1.5 shadow-glow animate-bounce" style={{ animationDuration: '3s' }}>
              {t.mockup.returnBadge}
            </div>

            {/* Decorative glow behind card */}
            <div className="absolute inset-0 -z-10 bg-primary/10 blur-[60px] rounded-3xl scale-95" />
          </div>

        </div>
      </div>
    </section>
  );
}
