import { useLanguage } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { Check, HeartHandshake, TrendingUp, Gift, Sparkles } from "lucide-react";

const layerIcons = [TrendingUp, Gift, Sparkles];

interface CalculatorProps {
  employees: number;
  setEmployees: (val: number) => void;
  tier: "Standard" | "Growth" | "Pro";
  setTier: (val: "Standard" | "Growth" | "Pro") => void;
  tierPrice: number;
  subscription: number;
  totalReturn: number;
  layer1: number;
  layer2: number;
  layer3: number;
  effectiveCost: number;
}

export function Calculator({
  employees, setEmployees, tier, setTier, tierPrice, subscription, totalReturn, layer1, layer2, layer3, effectiveCost
}: CalculatorProps) {
  const { language, dir } = useLanguage();

  const featureContent = {
    en: {
      includedLabel: "Start today — no setup, no complicated steps",
      plusFromStandard: "Everything in Standard, plus:",
      plusFromGrowth: "Everything in Growth, plus:",
      basic: [
        "Instant fingerprint check-in (finger or face) — no training needed",
        "Self-service tools your team can use from day one",
        "Discount codes that drive commitment and boost attendance",
        "Clear, regular reports",
      ],
      growthAdd: [
        "An AI assistant that answers HR requests instantly",
        "Smart gift cards and rewards that automatically motivate top performers",
        "6 months of history — securely stored in the database",
        "Face check-in with liveness detection — fully fraud-proof",
        "One-click payroll reports",
        "Priority support through the ticketing system",
        "AI assistant for task management (limited use)",
      ],
      proAdd: [
        "Deep AI reports — surfacing what spreadsheets can't show you",
        "Smart alerts based on each employee's performance",
        "A full year of history — a whole year of data at your fingertips",
        "Voice check-in designed for women, preserving privacy",
        "Works offline — no downtime even in disconnected areas",
        "Wider discounts, e-gift cards, and more varied rewards for your team",
        "Priority access to new features",
        "Unlimited AI task management — it works on your behalf",
      ],
    },
    ar: {
      includedLabel: "ابدأ اليوم — بدون إعدادات أو خطوات معقدة",
      plusFromStandard: "يشمل كل مزايا الباقة الأساسية",
      plusFromGrowth: "يشمل كل مزايا باقة النمو",
      basic: [
        "تسجيل حضور فوري بالبصمة (إصبع / وجه) — لا تدريب مطلوب",
        "خدمة ذاتية يستخدمها فريقك من اليوم الأول",
        "أكواد خصم تُحرّك الالتزام وترفع معدل الحضور",
        "تقارير دورية واضحة",
      ],
      growthAdd: [
        "مساعد ذكاء اصطناعي يُجيب على طلبات الموارد البشرية في الحال",
        "بطاقات هدايا ومكافآت ذكية تُحفّز أصحاب الأداء العالي تلقائياً",
        "٦ أشهر من السجلات — بيانات محفوظة في قاعدة البيانات",
        "تسجيل بالوجه مع كشف الحيوية — حماية كاملة من الغش",
        "تقارير رواتب بنقرة واحدة",
        "أولوية الدعم الفني عبر نظام التذاكر",
        "مساعد ذكاء اصطناعي لإدارة المهام (استخدام محدود)",
      ],
      proAdd: [
        "تقارير ذكاء اصطناعي عميقة — تكشف ما لا تراه في الجداول",
        "إشعارات ذكية حسب أداء كل موظف",
        "سنة كاملة من السجلات — بيانات عام كامل في متناول يدك",
        "تسجيل حضور بالصوت يناسب النساء ويحفظ الخصوصية",
        "يعمل بدون إنترنت — لا توقف حتى في المناطق المنقطعة",
        "خصومات وبطاقات هدايا إلكترونية ومكافآت موسّعة وأكثر تنوعاً لفريقك",
        "أولوية في الوصول للميزات الجديدة",
        "إدارة مهام بالذكاء الاصطناعي بلا حدود — يعمل نيابةً عنك",
      ],
    },
  };

  const ft = featureContent[language];
  const tierFeatures: Record<"Standard" | "Growth" | "Pro", string[]> = {
    Standard: ft.basic,
    Growth: ft.growthAdd,
    Pro: ft.proAdd,
  };
  const tierFeaturesLabel: Record<"Standard" | "Growth" | "Pro", string> = {
    Standard: ft.includedLabel,
    Growth: ft.plusFromStandard,
    Pro: ft.plusFromGrowth,
  };

  const content = {
    en: {
      titlePart1: "Estimate Your ",
      titlePart2: "Return",
      subhead: "Move the slider to see a sample estimate — actual results vary based on your team's performance.",
      sampleBadge: "Sample estimate — not actual data",
      empLabel: "Number of employees",
      tierLabel: "Select Tier",
      tiers: { Standard: "Standard", Growth: "Growth", Pro: "Pro" },
      results: {
        annualReturn: "Estimated Annual Return",
        sampleNote: "Illustrative only — actual return depends on usage & performance",
        subscription: "Annual Subscription",
        effective: "Effective Annual Cost",
        performance: "Performance",
        rewards: "Rewards",
        points: "Points",
      },
      disclaimer: "These numbers are for illustration purposes only. Your actual return will vary depending on your team size, performance levels, and how effectively you use Nizamy HR.",
    },
    ar: {
      titlePart1: "قدّر ",
      titlePart2: "عائدك",
      subhead: "حرّك المؤشر لترى تقديراً توضيحياً — النتائج الفعلية تتفاوت حسب أداء فريقك.",
      sampleBadge: "أرقام توضيحية — ليست بيانات حقيقية",
      empLabel: "عدد الموظفين",
      tierLabel: "اختر الباقة",
      tiers: { Standard: "أساسي", Growth: "نمو", Pro: "احترافي" },
      results: {
        annualReturn: "العائد السنوي التقديري",
        sampleNote: "توضيحي فقط — العائد الفعلي يعتمد على الاستخدام والأداء",
        subscription: "الاشتراك السنوي",
        effective: "التكلفة السنوية الفعلية",
        performance: "الأداء",
        rewards: "المكافآت",
        points: "النقاط",
      },
      disclaimer: "هذه الأرقام توضيحية فقط. عائدك الفعلي يتفاوت حسب حجم فريقك ومستويات الأداء ومدى فاعلية استخدامك لنظامي اتش آر.",
    },
  };

  const closingContent = {
    en: {
      quote: "We only do well when you do.",
      footnote: "No fine print. Your team's growth genuinely benefits us too — that's the whole idea.",
    },
    ar: {
      quote: "لا نستفيد إلا حين تستفيد أنت.",
      footnote: "بدون شروط خفية. نمو فريقك يفيدنا نحن أيضاً بشكل حقيقي — هذه هي الفكرة كلها.",
    },
  };
  const ct = closingContent[language];
  const t = content[language];

  return (
    <section id="calculator" className="py-24 sm:py-32 bg-slate-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t.sampleBadge}
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.1] mb-6">
            <span className="text-slate-900">{t.titlePart1}</span>
            <span className="text-blue-600">{t.titlePart2}</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-xl mx-auto">{t.subhead}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {/* Controls */}
          <div className="space-y-6">
            {/* Employee slider */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <label className="text-base font-bold text-slate-800">{t.empLabel}</label>
                <span className="text-4xl font-heading font-black text-blue-600 tabular-nums">{employees}</span>
              </div>
              <Slider
                value={[employees]}
                onValueChange={(vals) => setEmployees(vals[0])}
                min={5}
                max={500}
                step={1}
                dir={dir}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium mt-3">
                <span>5</span>
                <span>500</span>
              </div>
            </div>

            {/* Tier selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <label className="text-base font-bold block text-slate-800 mb-4">{t.tierLabel}</label>
              <div className="grid grid-cols-3 gap-3">
                {(["Standard", "Growth", "Pro"] as const).map((tOption) => (
                  <button
                    key={tOption}
                    onClick={() => setTier(tOption)}
                    className={`py-4 px-2 border-2 rounded-xl text-center transition-all duration-200 ${
                      tier === tOption
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">{t.tiers[tOption]}</div>
                    <div className="text-xs font-medium opacity-70">SAR {tOption === "Standard" ? 3 : tOption === "Growth" ? 5 : 8}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features list */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={15} className="text-blue-500" />
                {tierFeaturesLabel[tier]}
              </div>
              <ul className="space-y-3">
                {tierFeatures[tier].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 rtl:flex-row-reverse">
                    <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-blue-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results panel */}
          <div className="sticky top-24">
            <div className="rounded-2xl bg-slate-900 overflow-hidden shadow-2xl">
              <div className="p-8 sm:p-10 space-y-6 relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 30% 0%, rgba(59,130,246,0.4) 0%, transparent 60%)" }} />

                {/* Main return number */}
                <div className="relative text-center pb-8 border-b border-white/10">
                  <p className="text-slate-400 font-semibold text-sm mb-3">{t.results.annualReturn}</p>
                  <div className="text-5xl sm:text-6xl font-heading font-black text-white tracking-tight">
                    {formatCurrency(totalReturn, "SAR", language)}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-3 bg-white/5 inline-block px-3 py-1 rounded-full">{t.results.sampleNote}</p>
                </div>

                {/* Subscription + effective cost */}
                <div className="relative space-y-3">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <span className="text-slate-300 font-medium text-sm">{t.results.subscription}</span>
                    <span className="font-heading text-lg font-bold text-slate-200 tabular-nums">{formatCurrency(subscription, "SAR", language)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-600/15 p-4 rounded-xl border border-blue-500/20">
                    <span className="text-blue-100 font-bold">{t.results.effective}</span>
                    <span className="font-heading text-xl font-black text-white tabular-nums">{formatCurrency(effectiveCost, "SAR", language)}</span>
                  </div>
                </div>

                {/* Return breakdown */}
                <div className="relative pt-4 space-y-5">
                  {([
                    { label: t.results.performance, value: layer1, pct: 50, Icon: layerIcons[0] },
                    { label: t.results.rewards, value: layer2, pct: 33, Icon: layerIcons[1] },
                    { label: t.results.points, value: layer3, pct: 17, Icon: layerIcons[2] },
                  ]).map((row, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <row.Icon size={13} className="text-blue-400" />
                          {row.label}
                        </span>
                        <span className="text-slate-200 font-semibold">{formatCurrency(row.value, "SAR", language)}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-700"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="relative pt-4 border-t border-white/8">
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{t.disclaimer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing quote */}
        <div className="max-w-2xl mx-auto text-center mt-20 pt-12 border-t border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
            <HeartHandshake size={22} />
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-black leading-snug text-slate-900 mb-3">{ct.quote}</p>
          <p className="text-slate-500 font-medium leading-relaxed">{ct.footnote}</p>
        </div>
      </div>
    </section>
  );
}
