import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-powered HR, built for Saudi SMEs",
      headlinePart1: "Every other HR system is a cost.",
      headlinePart2: "Mr-Hr is a return.",
      subtitle: "More efficient use = bigger return — up to 30% back on your subscription, every year.",
      primaryCta: "Calculate my return",
      secondaryCta: "Become a Design Partner",
      chips: [
        "Up to 30% annual return",
        "SAR 5 per employee / month",
        "One-minute onboarding",
        "Zero penalties or chasing"
      ],
      mockup: {
        label: "Your Return Estimate",
        period: "Example: 50 employees, Growth plan",
        returnLabel: "Total annual return",
        rateLabel: "of your subscription, back to you",
        subscriptionLabel: "Annual subscription",
        returnBadge: "+30% Return",
      }
    },
    ar: {
      eyebrow: "موارد بشرية بالذكاء الاصطناعي للمنشآت السعودية",
      headlinePart1: "كل أنظمة الموارد البشرية تكلفة.",
      headlinePart2: "مستر إتش آر عائد.",
      subtitle: "استخدام أكثر فاعلية = عائد أكبر — حتى ٣٠٪ من قيمة اشتراكك، كل عام.",
      primaryCta: "احسب العائد",
      secondaryCta: "وصول مبكر مجاني",
      chips: [
        "حتى ٣٠٪ عائد سنوي",
        "٥ ريالات للموظف شهرياً",
        "تسجيل في دقيقة واحدة",
        "صفر غرامات أو ملاحقة"
      ],
      mockup: {
        label: "تقدير عائدك",
        period: "مثال: 50 موظفاً، باقة النمو",
        returnLabel: "إجمالي العائد السنوي",
        rateLabel: "من قيمة اشتراكك، يعود إليك",
        subscriptionLabel: "الاشتراك السنوي",
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

          {/* Right: positioning chart */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative">
            <div className="relative rounded-2xl bg-white/[0.04] border border-white/[0.10] backdrop-blur-2xl p-6 shadow-2xl">

              {/* Chart title */}
              <div className="text-center mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
                  {isRtl ? "خريطة الموقع التنافسي" : "Market Positioning"}
                </p>
              </div>

              {/* Quadrant chart */}
              <div className="relative w-full aspect-square max-w-[340px] mx-auto">

                {/* Grid lines */}
                <div className="absolute inset-0 border border-white/10 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    <div className="border-e border-b border-white/[0.07]" />
                    <div className="border-b border-white/[0.07]" />
                    <div className="border-e border-white/[0.07]" />
                    <div />
                  </div>
                </div>

                {/* Y-axis label top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/40 whitespace-nowrap">
                  {isRtl ? "↑ ذكاء اصطناعي" : "↑ AI-Powered"}
                </div>
                {/* Y-axis label bottom */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/25 whitespace-nowrap">
                  {isRtl ? "يدوي ↓" : "Manual ↓"}
                </div>
                {/* X-axis label right */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-2 text-[10px] font-semibold text-white/40 whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}>
                  {isRtl ? "عائد مالي →" : "Returns to You →"}
                </div>
                {/* X-axis label left */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-2 text-[10px] font-semibold text-white/25 whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}>
                  {isRtl ? "← تكلفة فقط" : "← Pure Cost"}
                </div>

                {/* Competitor dot — Traditional HR (bottom-left: Manual + Cost) */}
                <div className="absolute" style={{ left: '18%', top: '72%' }}>
                  <div className="relative flex flex-col items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/20 border border-white/30" />
                    <span className="text-[9px] text-white/30 text-center leading-tight whitespace-nowrap">
                      {isRtl ? "أنظمة HR التقليدية" : "Traditional HR"}
                    </span>
                  </div>
                </div>

                {/* Competitor dot — Modern SaaS HR (bottom-right: slightly modern + still cost) */}
                <div className="absolute" style={{ left: '55%', top: '62%' }}>
                  <div className="relative flex flex-col items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/20 border border-white/30" />
                    <span className="text-[9px] text-white/30 text-center leading-tight whitespace-nowrap">
                      {isRtl ? "SaaS الحديثة" : "Modern HR SaaS"}
                    </span>
                  </div>
                </div>

                {/* Competitor dot — Payroll-only (bottom-left cluster) */}
                <div className="absolute" style={{ left: '28%', top: '58%' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15 border border-white/20" />
                </div>

                {/* Mr-Hr dot — top-right: AI + Returns */}
                <div className="absolute" style={{ left: '68%', top: '16%' }}>
                  <div className="relative flex flex-col items-center gap-2">
                    {/* Glow ring */}
                    <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-orange-400/30 via-pink-500/30 to-indigo-500/30 blur-md -translate-x-1/4 -translate-y-1/4" />
                    {/* Main dot */}
                    <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500 shadow-glow border-2 border-white/30 z-10" />
                    {/* Label */}
                    <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 text-white text-[10px] font-black rounded-full px-2.5 py-0.5 shadow-glow whitespace-nowrap z-10">
                      {isRtl ? "مستر إتش آر" : "Mr-Hr"}
                    </div>
                  </div>
                </div>

              </div>

              {/* Legend row */}
              <div className="mt-8 flex items-center justify-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/30" />
                  <span className="text-[10px] text-white/35">{isRtl ? "المنافسون" : "Competitors"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500" />
                  <span className="text-[10px] text-white/60 font-semibold">{isRtl ? "مستر إتش آر" : "Mr-Hr"}</span>
                </div>
              </div>
            </div>

            {/* Decorative glow behind card */}
            <div className="absolute inset-0 -z-10 bg-primary/10 blur-[60px] rounded-3xl scale-95" />
          </div>

        </div>
      </div>
    </section>
  );
}
