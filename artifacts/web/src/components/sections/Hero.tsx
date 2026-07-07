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

          {/* Right: return flow visualization */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative">
            <div className="relative rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-2xl shadow-2xl overflow-hidden">

              {/* Header row */}
              <div className="px-5 pt-5 pb-4 border-b border-white/[0.08]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 mb-1">
                  {isRtl ? "كيف يولّد مستر إتش آر العائد؟" : "How Mr-Hr generates your return"}
                </p>
                <p className="text-white/60 text-sm leading-snug">
                  {isRtl
                    ? "ثلاث آليات داخل النظام تحوّل الاشتراك إلى عائد حقيقي"
                    : "3 activities inside the system convert your subscription into real money back"}
                </p>
              </div>

              {/* Activity rows */}
              <div className="divide-y divide-white/[0.06]">

                {/* Activity 1: Performance */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90">
                      {isRtl ? "الأداء والحضور" : "Performance & Attendance"}
                    </p>
                    <p className="text-xs text-white/45 leading-snug mt-0.5">
                      {isRtl
                        ? "تقليل التأخير والغياب = ساعات موفرة = ريالات ترجع"
                        : "Less lateness & turnover → hours saved → riyals back"}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <span className="text-lg font-black text-orange-400">15%</span>
                    <p className="text-[10px] text-white/30">{isRtl ? "عائد" : "back"}</p>
                  </div>
                </div>

                {/* Activity 2: Rewards */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center shrink-0">
                    <Gift size={18} className="text-pink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90">
                      {isRtl ? "المكافآت والتقدير" : "Rewards & Top Achievers"}
                    </p>
                    <p className="text-xs text-white/45 leading-snug mt-0.5">
                      {isRtl
                        ? "مستر إتش آر يموّل مكافآت الأعلى أداءً — بدون تكلفة إضافية"
                        : "Mr-Hr funds gifts for top performers at no extra cost to you"}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <span className="text-lg font-black text-pink-400">10%</span>
                    <p className="text-[10px] text-white/30">{isRtl ? "عائد" : "back"}</p>
                  </div>
                </div>

                {/* Activity 3: Time saved */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90">
                      {isRtl ? "وقت المدير الموفَّر" : "Manager Time Saved"}
                    </p>
                    <p className="text-xs text-white/45 leading-snug mt-0.5">
                      {isRtl
                        ? "كل إجراء يديره النظام تلقائياً = وقت يُحوَّل لإنتاجية"
                        : "Every action handled automatically = time converted to productivity"}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <span className="text-lg font-black text-indigo-400">5%</span>
                    <p className="text-[10px] text-white/30">{isRtl ? "عائد" : "back"}</p>
                  </div>
                </div>
              </div>

              {/* Total footer */}
              <div className="mx-5 mb-5 mt-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-indigo-500/10 border border-white/[0.09] px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/45">{isRtl ? "إجمالي العائد السنوي" : "Total annual return"}</p>
                  <p className="text-sm text-white/60 mt-0.5">
                    {isRtl ? "من قيمة اشتراكك — يعود إليك كل عام" : "of your subscription — back every year"}
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <span className="text-3xl font-black text-gradient-primary">30%</span>
                </div>
              </div>

            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 rtl:-right-auto rtl:-left-3 bg-primary text-white text-[11px] font-bold rounded-full px-3 py-1.5 shadow-glow">
              {isRtl ? "ليس تكلفة — عائد" : "Not a cost — a return"}
            </div>

            {/* Decorative glow behind card */}
            <div className="absolute inset-0 -z-10 bg-primary/10 blur-[60px] rounded-3xl scale-95" />
          </div>

        </div>
      </div>
    </section>
  );
}
