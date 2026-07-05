import { useLanguage } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Check, HeartHandshake } from "lucide-react";

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
      includedLabel: "What's included",
      basic: [
        "Fingerprint attendance",
        "Traditional self-service",
        "Discount codes",
        "Standard reporting with 1-month data history",
      ],
      growthAdd: [
        "AI HR self-service",
        "Limited vouchers for top achievers",
        "6-month data history",
        "Face matching + liveness detection",
        "Basic payroll reporting",
        "Priority support",
        "AI task management (limited usage)",
      ],
      proAdd: [
        "Advanced AI reporting",
        "Full access to advanced web features (e.g. notifications)",
        "12-month data history",
        "Voice matching",
        "Offline mode",
        "Wider, more open discounts",
        "E-gift cards",
        "Priority support within 24 hours",
        "AI task management, unlimited",
      ],
    },
    ar: {
      includedLabel: "ما الذي يشمله",
      basic: [
        "حضور بالبصمة",
        "خدمة ذاتية تقليدية",
        "أكواد خصم",
        "تقارير تقليدية مع حفظ البيانات لمدة شهر واحد",
      ],
      growthAdd: [
        "خدمة ذاتية للموارد البشرية بالذكاء الاصطناعي",
        "قسائم محدودة لأصحاب الأداء الأعلى",
        "حفظ بيانات لمدة 6 أشهر",
        "مطابقة الوجه + كشف الحيوية",
        "تقارير رواتب أساسية",
        "دعم ذو أولوية",
        "إدارة مهام بالذكاء الاصطناعي (استخدام محدود)",
      ],
      proAdd: [
        "تقارير ذكاء اصطناعي متقدمة",
        "وصول كامل للميزات المتقدمة في المنصة (مثل الإشعارات)",
        "حفظ بيانات لمدة سنة كاملة",
        "مطابقة الصوت",
        "وضع العمل بدون اتصال (Offline)",
        "خصومات أوسع وأكثر انفتاحاً",
        "بطاقات هدايا إلكترونية",
        "دعم ذو أولوية خلال 24 ساعة",
        "إدارة مهام بالذكاء الاصطناعي بلا حدود",
      ],
    },
  };

  const ft = featureContent[language];
  const tierFeatures: Record<"Standard" | "Growth" | "Pro", string[]> = {
    Standard: ft.basic,
    Growth: [...ft.basic, ...ft.growthAdd],
    Pro: [...ft.basic, ...ft.growthAdd, ...ft.proAdd],
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

            <div className="rounded-2xl border border-border/50 bg-white p-6">
              <div className="text-sm font-semibold text-primary mb-4">
                {ft.includedLabel} — {t.tiers[tier]}
              </div>
              <ul className="space-y-2.5">
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t.results.performance} (15%)</span>
                    <span>{formatCurrency(layer1, "SAR", language)}</span>
                  </div>
                  <LayerBar value={15} max={30} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t.results.rewards} (10%)</span>
                    <span>{formatCurrency(layer2, "SAR", language)}</span>
                  </div>
                  <LayerBar value={10} max={30} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t.results.points} (5%)</span>
                    <span>{formatCurrency(layer3, "SAR", language)}</span>
                  </div>
                  <LayerBar value={5} max={30} />
                </div>
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
