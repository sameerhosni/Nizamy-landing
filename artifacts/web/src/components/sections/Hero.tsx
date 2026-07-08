import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, TrendingUp, Gift, Clock } from "lucide-react";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [showReturn, setShowReturn] = useState(true);

  const content = {
    en: {
      eyebrow: "AI-powered HR · for Saudi SMEs",
      headlinePart1: "Every HR system costs you.",
      headlinePart2: "Mr-Hr gives it back.",
      subtitleMuted: "More efficient use = bigger return. ",
      subtitleBold: "We give you up to 30% of your subscription back every year — the only performance system that pays you, not the other way around.",
      primaryCta: "Book my early access",
      secondaryCta: "Calculate my return",
      chips: [
        "Up to 30% annual return",
        "One-minute onboarding",
        "Starting from SAR 3 per employee",
        "No penalties or chasing"
      ],
      card: {
        exampleLabel: "Example: 50 employees / month",
        toggleCost: "Cost",
        toggleReturn: "Return",
        activation: "70% activation",
        returnsTo: "30% back to you",
        subscriptionLabel: "Annual subscription",
        netCostLabel: "Your net cost",
        performance: "Performance & Attendance",
        rewards: "Rewards & Gifts",
        managerTime: "Manager Time",
        totalReturn: "Total annual return",
        totalReturnSub: "Back to you every year",
        totalReturnAmount: "+SAR 1,440",
        totalReturnPercent: "30% back",
      }
    },
    ar: {
      eyebrow: "موارد بشرية بالذكاء الاصطناعي · للمنشآت السعودية",
      headlinePart1: "كل أنظمة الموارد البشرية تُكلّفك.",
      headlinePart2: "مستر إتش آر يعيد لك.",
      subtitleMuted: "استخدام أكثر فاعلية = عائد أكبر. ",
      subtitleBold: "نعيد إليك حق ٪30 من قيمة اشتراكك كل عام — نظام إدارة الأداء الوحيد الذي يدفع لك، لا عليك.",
      primaryCta: "احجز وصولك المبكر",
      secondaryCta: "احسب عائدك",
      chips: [
        "حق ٪30 عائد سنوي",
        "تسجيل في دقيقة واحدة",
        "يبدأ من ٣ ريال للموظف",
        "بدون غرامات أو ملاحظة"
      ],
      card: {
        exampleLabel: "مثال: ٥٠ موظفاً شهرياً",
        toggleCost: "تكلفة",
        toggleReturn: "عائد",
        activation: "تفعيل ٪70",
        returnsTo: "يعود إليك ٪30",
        subscriptionLabel: "الاشتراك السنوي",
        netCostLabel: "تكلفتك الفعلية",
        performance: "الأداء والحضور",
        rewards: "المكافآت والهدايا",
        managerTime: "وقت المدير",
        totalReturn: "إجمالي العائد السنوي",
        totalReturnSub: "يعود إليك كل عام",
        totalReturnAmount: "+١,٤٤٠ ر.س",
        totalReturnPercent: "٪30 استرداد",
      }
    }
  };

  const t = content[language];
  const c = t.card;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-hero-radial">
      {/* Floating blurred gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[60%] bg-[#6D4AFF]/25 blur-[160px] rounded-full animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#FF4D8D]/15 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[35%] right-[25%] w-[25%] h-[30%] bg-[#FFA23A]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1fr_430px] gap-12 items-center max-w-6xl mx-auto">

          {/* Left: copy */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/15 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.eyebrow}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[1.15]">
              <span className="text-white">{t.headlinePart1}</span>{" "}
              <span className="text-gradient-primary">{t.headlinePart2}</span>
            </h1>

            <p className="text-lg md:text-xl max-w-lg leading-relaxed">
              <span className="text-white/50">{t.subtitleMuted}</span>
              <span className="text-white/90 font-medium">{t.subtitleBold}</span>
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-7 rounded-xl group bg-[#6D4AFF] hover:bg-[#8B6BFF] text-white shadow-glow border-0"
                onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}
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
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.secondaryCta}
              </Button>
            </div>

            {/* Checkmark proof points */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {t.chips.map((chip, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-white/60">
                  <div className="w-4 h-4 rounded-full bg-[#6D4AFF]/25 border border-[#6D4AFF]/40 flex items-center justify-center shrink-0">
                    <Check size={9} className="text-[#8B6BFF]" strokeWidth={3} />
                  </div>
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* Right: return card */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative">
            <div className="relative rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-2xl shadow-2xl p-5 space-y-5">

              {/* Example label + toggle */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">{c.exampleLabel}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowReturn(false)}
                    className={`font-semibold transition-colors ${!showReturn ? "text-white" : "text-white/35"}`}
                  >
                    {c.toggleCost}
                  </button>
                  <ArrowLeft size={11} className={`text-white/30 ${isRtl ? "" : "rotate-180"}`} />
                  <button
                    onClick={() => setShowReturn(true)}
                    className={`font-semibold transition-colors ${showReturn ? "text-white" : "text-white/35"}`}
                  >
                    {c.toggleReturn}
                  </button>
                </div>
              </div>

              {/* Big subscription amount */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-xs mb-0.5">{c.subscriptionLabel}</p>
                  <p className="text-2xl font-heading font-black text-white/50 line-through decoration-white/20">
                    {isRtl ? "٤,٨٠٠ ر.س" : "SAR 4,800"}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-white/40 text-xs mb-0.5">{c.netCostLabel}</p>
                  <p className="text-3xl font-heading font-black text-white">
                    {isRtl ? "٣,٣٦٠ ر.س" : "SAR 3,360"}
                  </p>
                </div>
              </div>

              {/* Shimmering return meter */}
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ width: "30%", background: "linear-gradient(90deg,#FF4D8D,#FFA23A)" }}
                  >
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
                        animation: "shimmer 2.2s infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-white/35">
                  <span className="flex items-center gap-1">
                    {c.activation}
                    <ArrowLeft size={10} className={isRtl ? "" : "rotate-180"} />
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-gradient-primary">
                    <ArrowRight size={10} className={isRtl ? "rotate-180" : ""} />
                    {c.returnsTo}
                  </span>
                </div>
              </div>

              {/* Three source chips */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: TrendingUp, label: c.performance },
                  { icon: Gift, label: c.rewards },
                  { icon: Clock, label: c.managerTime },
                ].map(({ icon: Icon, label }, idx) => (
                  <div key={idx} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2">
                      <Icon size={16} className="text-[#8B6BFF]" />
                    </div>
                    <p className="text-[10px] text-white/55 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Total return callout */}
              <div
                className="flex items-center justify-between rounded-xl border border-white/[0.09] px-4 py-3"
                style={{ background: "linear-gradient(90deg, rgba(255,77,141,0.12), rgba(255,162,58,0.12))" }}
              >
                <div>
                  <p className="text-sm font-semibold text-white/80">{c.totalReturn}</p>
                  <p className="text-xs text-white/40 mt-0.5">{c.totalReturnSub}</p>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-2xl font-heading font-black text-[#FF4D8D]">{c.totalReturnAmount}</p>
                  <p className="text-xs font-semibold text-[#FFA23A] mt-0.5">{c.totalReturnPercent}</p>
                </div>
              </div>

            </div>

            {/* Decorative glow */}
            <div className="absolute inset-0 -z-10 bg-[#6D4AFF]/10 blur-[60px] rounded-3xl scale-95" />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
