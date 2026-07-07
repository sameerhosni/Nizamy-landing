import { useLanguage } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Check, HeartHandshake, TrendingUp, Gift, Sparkles } from "lucide-react";

const layerIcons = [TrendingUp, Gift, Sparkles];

function LayerBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 transition-all duration-500"
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
      titlePart1: "Live ",
      titlePart2: "Return Calculator",
      subhead: "Move the slider and watch a cost turn into a return — your real number, in seconds.",
      empLabel: "Number of employees",
      tierLabel: "Select Tier",
      tiers: { Standard: "Standard", Growth: "Growth", Pro: "Pro" },
      results: {
        annualReturn: "Annual Return",
        sampleNote: "Illustrative estimate based on your inputs",
        subscription: "Annual Subscription",
        effective: "Effective Annual Cost",
        performance: "Performance",
        rewards: "Rewards",
        points: "Points"
      }
    },
    ar: {
      titlePart1: "حاسبة ",
      titlePart2: "العائد المباشرة",
      subhead: "حرّك المؤشر وشاهد التكلفة تتحول إلى عائد — رقمك الحقيقي، في ثوانٍ.",
      empLabel: "عدد الموظفين",
      tierLabel: "اختر الباقة",
      tiers: { Standard: "أساسي", Growth: "نمو", Pro: "احترافي" },
      results: {
        annualReturn: "العائد السنوي",
        sampleNote: "أرقام تقديرية توضيحية بناءً على مدخلاتك",
        subscription: "الاشتراك السنوي",
        effective: "التكلفة السنوية الفعلية",
        performance: "الأداء",
        rewards: "المكافآت",
        points: "النقاط"
      }
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
    <section id="calculator" className="py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center mb-6 leading-tight">
          <span className="text-foreground">{t.titlePart1}</span>
          <span className="text-gradient-primary">{t.titlePart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Controls */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium">{t.empLabel}</label>
                <span className="text-3xl font-bold text-primary">{employees}</span>
              </div>
              <Slider 
                value={[employees]} 
                onValueChange={(vals) => setEmployees(vals[0])} 
                min={5} 
                max={300} 
                step={1} 
                dir={dir}
              />
            </div>

            <div className="space-y-6">
              <label className="text-lg font-medium block">{t.tierLabel}</label>
              <div className="grid grid-cols-3 gap-4">
                {(["Standard", "Growth", "Pro"] as const).map((tOption) => (
                  <button
                    key={tOption}
                    onClick={() => setTier(tOption)}
                    className={`py-4 px-2 border-2 rounded-xl text-center transition-all ${
                      tier === tOption 
                        ? "border-primary bg-primary/5 text-primary shadow-sm" 
                        : "border-border/50 text-muted-foreground hover:border-border bg-white"
                    }`}
                  >
                    <div className="font-bold mb-1">{t.tiers[tOption]}</div>
                    <div className="text-sm">SAR {tOption === "Standard" ? 5 : tOption === "Growth" ? 8 : 12}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-white p-5">
              <div className="text-sm font-semibold text-primary mb-3">
                {tierFeaturesLabel[tier]}
              </div>
              <ul className="space-y-2">
                {tierFeatures[tier].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results */}
          <Card className="bg-white border-primary/10 shadow-glow">
            <CardContent className="p-8 md:p-10 space-y-8">
              <div className="text-center pb-8 border-b border-border">
                <div className="text-muted-foreground font-medium mb-3">{t.results.annualReturn}</div>
                <div className="relative inline-block py-4">
                  <div className="absolute inset-0 bg-primary/15 blur-2xl rounded-full scale-150 pointer-events-none" />
                  <div className="text-5xl md:text-6xl font-bold text-primary tracking-tight relative">
                    {formatCurrency(totalReturn, "SAR", language)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t.results.sampleNote}</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t.results.subscription}</span>
                  <span className="font-mono text-xl">{formatCurrency(subscription, "SAR", language)}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t.results.effective}</span>
                  <span className="font-mono text-2xl">{formatCurrency(effectiveCost, "SAR", language)}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-border space-y-6">
                {([
                  { label: t.results.performance, value: layer1, pct: 15, Icon: layerIcons[0] },
                  { label: t.results.rewards, value: layer2, pct: 10, Icon: layerIcons[1] },
                  { label: t.results.points, value: layer3, pct: 5, Icon: layerIcons[2] },
                ]).map((row, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <row.Icon size={14} className="text-primary" />
                        {row.label}
                      </span>
                      <span>{formatCurrency(row.value, "SAR", language)}</span>
                    </div>
                    <LayerBar value={row.pct} max={30} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto text-center mt-16 pt-16 border-t border-border/50">
          <div className="w-11 h-11 rounded-2xl bg-accent text-primary flex items-center justify-center mx-auto mb-6">
            <HeartHandshake size={20} />
          </div>
          <p className="text-xl md:text-2xl font-bold leading-snug text-gradient-primary mb-3">
            {ct.quote}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {ct.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
