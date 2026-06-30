import { useLanguage } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

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
  tier: "Growth" | "Pro" | "Suite";
  setTier: (val: "Growth" | "Pro" | "Suite") => void;
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

  const content = {
    en: {
      titlePart1: "Live ",
      titlePart2: "Return Calculator",
      subhead: "Move the slider and watch a cost turn into a return — your real number, in seconds.",
      empLabel: "Number of employees",
      tierLabel: "Select Tier",
      tiers: { Growth: "Growth", Pro: "Pro", Suite: "Suite" },
      results: {
        annualReturn: "Annual Return",
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
      tiers: { Growth: "نمو", Pro: "احترافي", Suite: "جناح" },
      results: {
        annualReturn: "العائد السنوي",
        subscription: "الاشتراك السنوي",
        effective: "التكلفة السنوية الفعلية",
        performance: "الأداء",
        rewards: "المكافآت",
        points: "النقاط"
      }
    }
  };

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
                {(["Growth", "Pro", "Suite"] as const).map((tOption) => (
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
                    <div className="text-sm">SAR {tOption === "Growth" ? 5 : tOption === "Pro" ? 8 : 12}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <Card className="bg-white border-primary/10 shadow-glow">
            <CardContent className="p-8 md:p-10 space-y-8">
              <div className="text-center pb-8 border-b border-border">
                <div className="text-muted-foreground font-medium mb-3">{t.results.annualReturn}</div>
                <div className="text-5xl md:text-6xl font-bold text-primary tracking-tight">
                  {formatCurrency(totalReturn, "SAR", language)}
                </div>
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
      </div>
    </section>
  );
}
