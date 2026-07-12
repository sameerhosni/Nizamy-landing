import { useLanguage } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Check, HeartHandshake, TrendingUp, Gift, Sparkles } from "lucide-react";

const layerIcons = [TrendingUp, Gift, Sparkles];

function LayerBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-all duration-500 bg-blue-600"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

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
  const isRtl = dir === "rtl";

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
      subhead: "Move the slider to see a sample estimate — actual results vary based on your team's performance and how you use the system.",
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
        points: "Points"
      },
      disclaimer: "These numbers are for illustration purposes only. Your actual return will vary depending on your team size, performance levels, and how effectively you use Nizamy."
    },
    ar: {
      titlePart1: "قدّر ",
      titlePart2: "عائدك",
      subhead: "حرّك المؤشر لترى تقديراً توضيحياً — النتائج الفعلية تتفاوت حسب أداء فريقك وطريقة استخدامك للنظام.",
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
        points: "النقاط"
      },
      disclaimer: "هذه الأرقام توضيحية فقط. عائدك الفعلي يتفاوت حسب حجم فريقك ومستويات الأداء ومدى فاعلية استخدامك لنظامي."
    }
  };

  const closingContent = {
    en: {
      quote: "We just built it so we only do well when you do.",
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
    <section id="calculator" className="py-24 bg-white scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t.sampleBadge}
          </span>
        </div>
        <h2 className="text-4xl text-center mb-4 leading-tight">
          <span className="text-slate-900">{t.titlePart1}</span>
          <span className="text-blue-600">{t.titlePart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-500 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Controls */}
          <div className="space-y-10">
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-lg font-bold text-slate-800">{t.empLabel}</label>
                <span className="text-3xl font-black text-blue-600 bg-white px-4 py-1 rounded-lg border border-slate-200 shadow-sm">{employees}</span>
              </div>
              <Slider 
                value={[employees]} 
                onValueChange={(vals) => setEmployees(vals[0])} 
                min={5} 
                max={500} 
                step={1} 
                dir={dir}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <label className="text-lg font-bold block text-slate-800">{t.tierLabel}</label>
              <div className="grid grid-cols-3 gap-3">
                {(["Standard", "Growth", "Pro"] as const).map((tOption) => (
                  <button
                    key={tOption}
                    onClick={() => setTier(tOption)}
                    className={`py-4 px-2 border-2 rounded-xl text-center transition-all ${
                      tier === tOption 
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <div className="font-bold mb-1">{t.tiers[tOption]}</div>
                    <div className="text-sm font-medium">SAR {tOption === "Standard" ? 3 : tOption === "Growth" ? 5 : 8}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500" />
                {tierFeaturesLabel[tier]}
              </div>
              <ul className="space-y-3">
                {tierFeatures[tier].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                      <Check size={12} className="text-blue-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results panel */}
          <Card className="bg-slate-900 border-0 shadow-2xl overflow-hidden rounded-[24px]">
            <CardContent className="p-8 md:p-10 space-y-8 relative z-10">
              <div className="absolute inset-0 bg-blue-900/20 blur-[100px] z-[-1]" />
              
              <div className="text-center pb-8 border-b border-slate-800">
                <div className="text-slate-400 font-semibold mb-2">{t.results.annualReturn}</div>
                <div className="relative inline-block py-2">
                  <div className="text-5xl md:text-6xl font-heading font-black text-white tracking-tight">
                    {formatCurrency(totalReturn, "SAR", language)}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-3 bg-slate-800/50 inline-block px-3 py-1 rounded-full">{t.results.sampleNote}</p>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <span className="text-slate-300 font-medium">{t.results.subscription}</span>
                  <span className="font-mono text-xl font-semibold text-slate-200">{formatCurrency(subscription, "SAR", language)}</span>
                </div>
                
                <div className="flex justify-between items-center bg-blue-600/10 p-4 rounded-xl border border-blue-500/20">
                  <span className="text-blue-100 font-bold text-lg">{t.results.effective}</span>
                  <span className="font-mono text-2xl font-bold text-white">{formatCurrency(effectiveCost, "SAR", language)}</span>
                </div>
              </div>

              <div className="pt-6 space-y-5">
                {([
                  { label: t.results.performance, value: layer1, pct: 50, Icon: layerIcons[0] },
                  { label: t.results.rewards, value: layer2, pct: 33, Icon: layerIcons[1] },
                  { label: t.results.points, value: layer3, pct: 17, Icon: layerIcons[2] },
                ]).map((row, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                      <span className="flex items-center gap-2">
                        <row.Icon size={14} className="text-blue-400" />
                        {row.label}
                      </span>
                      <span className="text-slate-200">{formatCurrency(row.value, "SAR", language)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-blue-500"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="pt-6 border-t border-slate-800">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {t.disclaimer}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto text-center mt-20 pt-12 border-t border-slate-100">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <HeartHandshake size={24} />
          </div>
          <p className="text-2xl font-bold leading-snug text-slate-900 mb-3">
            {ct.quote}
          </p>
          <p className="text-slate-500 font-medium leading-relaxed">
            {ct.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
