import { useLanguage } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, CheckCircle2 } from "lucide-react";

export function Problem() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      headingPart1: "Every other HR system bills you. ",
      headingPart2: "Yours should pay you back.",
      subhead: "Same monthly fee. Completely different math. One drains your budget every month — the other puts money back in it.",
      legacy: {
        title: "What exists today",
        points: ["Pure software cost", "Penalties and deductions", "Chasing employees to use it", "Time wasted on admin"]
      },
      mrhr: {
        title: "What Mr-Hr is",
        points: ["Return that grows with performance", "Rewards and motivation", "Employees engage willingly", "Time saved is money earned"]
      }
    },
    ar: {
      headingPart1: "الأنظمة الأخرى تستنزف أموالك باشتراكات. ",
      headingPart2: "مستر أتش ار يوفر لك.",
      subhead: "نفس الرسوم الشهرية. حسبة مختلفة تماماً. أحدهما يستنزف ميزانيتك كل شهر — والآخر يعيد المال إليها.",
      legacy: {
        title: "الوضع الحالي",
        points: ["تكلفة برمجيات بحتة", "غرامات وخصومات", "ملاحقة الموظفين لاستخدامه", "إهدار الوقت في الإدارة"]
      },
      mrhr: {
        title: "ما هو مستر إتش آر",
        points: ["عائد يكبر مع أداء فريقك", "مكافآت وتحفيز", "تفاعل تلقائي من الموظفين", "الوقت الموفر هو مال مكتسب"]
      }
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl text-center mb-6 max-w-3xl mx-auto leading-tight">
          <span className="text-foreground">{t.headingPart1}</span>
          <span className="text-gradient-primary">{t.headingPart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Legacy HR Card */}
          <Card className="bg-white border-border/50 shadow-sm relative overflow-hidden group">
            <CardContent className="p-8 md:p-12 relative z-10">
              <h3 className="text-2xl font-bold mb-8 text-muted-foreground">{t.legacy.title}</h3>
              <ul className="space-y-6">
                {t.legacy.points.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg">
                    <XCircle className="text-muted-foreground/50 shrink-0" size={24} />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Mr-Hr Card */}
          <Card className="bg-white border-primary/20 shadow-glow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-accent/20 z-0"></div>
            <CardContent className="p-8 md:p-12 relative z-10 text-foreground">
              <h3 className="text-2xl font-bold mb-8 text-primary">{t.mrhr.title}</h3>
              <ul className="space-y-6">
                {t.mrhr.points.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg font-medium">
                    <CheckCircle2 className="text-primary shrink-0" size={24} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
