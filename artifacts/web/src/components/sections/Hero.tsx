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
      headlinePart2: "Nizamy\u00A0HR gives it back.",
      subtitleMuted: "One system for attendance, employee services, performance, rewards, and HR insights. ",
      subtitleBold: "And when your team performs better, up to 30% of your subscription comes back to you every year.",
      primaryCta: "Book my early access",
      secondaryCta: "Calculate my return",
      chips: [
        "Up to 30% annual return",
        "One-minute onboarding",
        "Starting from SAR 3 per employee",
        "Motivation-first, no penalties"
      ],
      card: {
        exampleLabel: "Example: 50 employees / month",
        toggleCost: "Cost",
        toggleReturn: "Return",
        activation: "70% activation",
        returnsTo: "Up to 30% back to you",
        subscriptionLabel: "Annual subscription",
        netCostLabel: "Your net cost",
        performance: "Performance & Attendance",
        rewards: "Rewards & Gifts",
        managerTime: "Manager Time",
        totalReturn: "Total annual return",
        totalReturnSub: "Back to you every year",
        totalReturnAmount: "+SAR 1,440",
        totalReturnPercent: "Up to 30% back",
      }
    },
    ar: {
      eyebrow: "موارد بشرية بالذكاء الاصطناعي · للمنشآت السعودية",
      headlinePart1: "كل أنظمة الموارد البشرية تُكلّفك.",
      headlinePart2: "نظامي\u00A0اتش\u00A0آر يعيد لك.",
      subtitleMuted: "نظام واحد لإدارة الحضور والانصراف، الخدمات الذاتية للموظفين عبر الذكاء الاصطناعي، تحسين الأداء والإنتاجية، مكافآت وبطاقات هدايا. ",
      subtitleBold: "وكلما تحسّن أداء فريقك، يعود إليك حتى 30% من قيمة اشتراكك كل عام.",
      primaryCta: "احجز وصولك المبكر",
      secondaryCta: "احسب عائدك",
      chips: [
        "حق عائد سنوي حتى 30%",
        "تسجيل في دقيقة واحدة",
        "يبدأ من ٣ ريال للموظف",
        "نظام يركز على التحفيز بدل العقوبات"
      ],
      card: {
        exampleLabel: "مثال: ٥٠ موظفاً شهرياً",
        toggleCost: "تكلفة",
        toggleReturn: "عائد",
        activation: "تفعيل ٪70",
        returnsTo: "يعود إليك حتى 30%",
        subscriptionLabel: "الاشتراك السنوي",
        netCostLabel: "تكلفتك الفعلية",
        performance: "الأداء والحضور",
        rewards: "المكافآت والهدايا",
        managerTime: "وقت المدير",
        totalReturn: "إجمالي العائد السنوي",
        totalReturnSub: "يعود إليك كل عام",
        totalReturnAmount: "+١,٤٤٠ ر.س",
        totalReturnPercent: "حتى 30% استرداد",
      }
    }
  };

  const t = content[language];
  const c = t.card;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-hero-radial">
      {/* Soft blue blurred background accents */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[60%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-blue-300/10 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: "8s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1fr_430px] gap-12 items-center max-w-6xl mx-auto">

          {/* Left: copy */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {t.eyebrow}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[1.15]">
              <span className="text-slate-900">{t.headlinePart1}</span>{" "}
              <span className="text-gradient-primary">{t.headlinePart2}</span>
            </h1>

            <p className="text-lg md:text-xl max-w-lg leading-relaxed text-slate-600">
              <span>{t.subtitleMuted}</span>
              <span className="font-semibold text-slate-800">{t.subtitleBold}</span>
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-7 rounded-xl group bg-blue-600 hover:bg-blue-700 text-white shadow-glow border-0"
                onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.primaryCta}
                {isRtl
                  ? <ArrowLeft className="ms-2 group-hover:-translate-x-1 transition-transform" size={18} />
                  : <ArrowRight className="ms-2 group-hover:translate-x-1 transition-transform" size={18} />}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base h-12 px-7 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.secondaryCta}
              </Button>
            </div>

            {/* Checkmark proof points */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {t.chips.map((chip, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-500 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Check size={10} className="text-blue-600" strokeWidth={3} />
                  </div>
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* Right: return card */}
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 relative">
            <div className="relative rounded-[20px] bg-white border border-slate-200 shadow-soft p-6 space-y-6">

              {/* Example label + toggle */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{c.exampleLabel}</span>
                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                  <button
                    onClick={() => setShowReturn(false)}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors ${!showReturn ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {c.toggleCost}
                  </button>
                  <button
                    onClick={() => setShowReturn(true)}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors ${showReturn ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {c.toggleReturn}
                  </button>
                </div>
              </div>

              {/* Big subscription amount */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-slate-500 font-medium text-xs mb-1">{c.subscriptionLabel}</p>
                  <p className="text-2xl font-heading font-black text-slate-400 line-through decoration-slate-300">
                    {isRtl ? "٤,٨٠٠ ر.س" : "SAR 4,800"}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-slate-500 font-medium text-xs mb-1">{c.netCostLabel}</p>
                  <p className="text-3xl font-heading font-black text-slate-900">
                    {isRtl ? "٣,٣٦٠ ر.س" : "SAR 3,360"}
                  </p>
                </div>
              </div>

              {/* Return meter */}
              <div className="space-y-2.5">
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden relative">
                  <div
                    className="h-full rounded-full relative overflow-hidden bg-blue-600 transition-all duration-1000"
                    style={{ width: showReturn ? "30%" : "0%" }}
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
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    {c.activation}
                    <ArrowLeft size={12} className={isRtl ? "" : "rotate-180"} />
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-blue-600">
                    <ArrowRight size={12} className={isRtl ? "rotate-180" : ""} />
                    {c.returnsTo}
                  </span>
                </div>
              </div>

              {/* Three source chips */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: TrendingUp, label: c.performance },
                  { icon: Gift, label: c.rewards },
                  { icon: Clock, label: c.managerTime },
                ].map(({ icon: Icon, label }, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                      <Icon size={16} />
                    </div>
                    <p className="text-[10px] font-medium text-slate-600 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Total return callout */}
              <div
                className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-4"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{c.totalReturn}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{c.totalReturnSub}</p>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-2xl font-heading font-black text-blue-600">{c.totalReturnAmount}</p>
                  <p className="text-xs font-bold text-blue-500 mt-0.5">{c.totalReturnPercent}</p>
                </div>
              </div>

            </div>

            {/* Decorative glow behind card */}
            <div className="absolute inset-0 -z-10 bg-blue-400/5 blur-[50px] rounded-3xl scale-95" />
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
