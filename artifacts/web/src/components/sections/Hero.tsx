import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, TrendingUp, Gift, Clock } from "lucide-react";

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

          {/* Right: return breakdown visualization */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative">
            <div className="relative rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-2xl shadow-2xl p-5 space-y-5">

              {/* Eyebrow */}
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                {isRtl ? "اشتراكك السنوي: مثال ٥٠ موظفاً" : "Your annual subscription — 50 employees"}
              </p>

              {/* Big subscription amount */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-xs mb-0.5">{isRtl ? "الاشتراك السنوي" : "Annual subscription"}</p>
                  <p className="text-3xl font-black text-white/60 line-through decoration-white/20">SAR 4,800</p>
                </div>
                <div className="text-end">
                  <p className="text-white/40 text-xs mb-0.5">{isRtl ? "تكلفتك الفعلية" : "Your net cost"}</p>
                  <p className="text-3xl font-black text-white">SAR 3,360</p>
                </div>
              </div>

              {/* Full bar — split 70% / 30% */}
              <div className="space-y-2">
                <div className="flex h-8 rounded-xl overflow-hidden gap-0.5">
                  {/* 70% net cost */}
                  <div className="h-full bg-white/10 border border-white/10 rounded-s-xl flex items-center px-3" style={{ width: '70%' }}>
                    <span className="text-xs font-bold text-white/40">70%</span>
                  </div>
                  {/* 15% performance */}
                  <div className="h-full bg-orange-500/70 flex items-center justify-center" style={{ width: '15%' }}>
                    <TrendingUp size={12} className="text-white" />
                  </div>
                  {/* 10% rewards */}
                  <div className="h-full bg-pink-500/70 flex items-center justify-center" style={{ width: '10%' }}>
                    <Gift size={12} className="text-white" />
                  </div>
                  {/* 5% time saved */}
                  <div className="h-full bg-indigo-500/70 flex items-center justify-center rounded-e-xl" style={{ width: '5%' }}>
                    <Clock size={10} className="text-white" />
                  </div>
                </div>

                {/* Bar labels */}
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-white/30">{isRtl ? "← تبقى تكلفة" : "Stays as cost →"}</span>
                  <span className="text-[11px] font-semibold text-gradient-primary">{isRtl ? "← يعود إليك" : "Returns to you →"}</span>
                </div>
              </div>

              {/* Three source cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-3 text-center">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp size={14} className="text-orange-400" />
                  </div>
                  <p className="text-orange-400 text-lg font-black leading-none">15%</p>
                  <p className="text-[10px] text-white/45 mt-1 leading-tight">
                    {isRtl ? "الأداء والحضور" : "Performance"}
                  </p>
                </div>
                <div className="rounded-xl bg-pink-500/10 border border-pink-500/20 p-3 text-center">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center mx-auto mb-2">
                    <Gift size={14} className="text-pink-400" />
                  </div>
                  <p className="text-pink-400 text-lg font-black leading-none">10%</p>
                  <p className="text-[10px] text-white/45 mt-1 leading-tight">
                    {isRtl ? "المكافآت والهدايا" : "Rewards & Gifts"}
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-3 text-center">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center mx-auto mb-2">
                    <Clock size={14} className="text-indigo-400" />
                  </div>
                  <p className="text-indigo-400 text-lg font-black leading-none">5%</p>
                  <p className="text-[10px] text-white/45 mt-1 leading-tight">
                    {isRtl ? "وقت المدير" : "Manager Time"}
                  </p>
                </div>
              </div>

              {/* Total return callout */}
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-indigo-500/10 border border-white/[0.09] px-4 py-3">
                <div>
                  <p className="text-xs text-white/45">{isRtl ? "إجمالي العائد" : "Total return"}</p>
                  <p className="text-sm font-semibold text-white/70 mt-0.5">
                    {isRtl ? "SAR 1,440 — يعود إليك كل عام" : "SAR 1,440 back every year"}
                  </p>
                </div>
                <span className="text-3xl font-black text-gradient-primary shrink-0">30%</span>
              </div>

            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 rtl:-right-auto rtl:-left-3 bg-primary text-white text-[11px] font-bold rounded-full px-3 py-1.5 shadow-glow whitespace-nowrap">
              {isRtl ? "ليس تكلفة — عائد" : "Not a cost — a return"}
            </div>

            {/* Decorative glow */}
            <div className="absolute inset-0 -z-10 bg-primary/10 blur-[60px] rounded-3xl scale-95" />
          </div>

        </div>
      </div>
    </section>
  );
}
