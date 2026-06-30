import { useLanguage } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, CheckCircle2 } from "lucide-react";

export function Problem() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      heading: "Every other HR system bills you. Yours should pay you back.",
      legacy: {
        title: "What exists today",
        points: ["Pure software cost", "Penalties and deductions", "Chasing employees to use it", "Time wasted on admin"]
      },
      mrhr: {
        title: "What Mr-Hr is",
        points: ["Guaranteed return on investment", "Rewards and motivation", "Employees engage willingly", "Time saved is money earned"]
      }
    },
    ar: {
      heading: "الأنظمة الأخرى تفوتر لك. نظامك يجب أن يدفع لك.",
      legacy: {
        title: "الوضع الحالي",
        points: ["تكلفة برمجيات بحتة", "غرامات وخصومات", "ملاحقة الموظفين لاستخدامه", "إهدار الوقت في الإدارة"]
      },
      mrhr: {
        title: "ما هو مستر إتش آر",
        points: ["عائد مضمون على الاستثمار", "مكافآت وتحفيز", "تفاعل تلقائي من الموظفين", "الوقت الموفر هو مال مكتسب"]
      }
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-foreground max-w-3xl mx-auto">
          {t.heading}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Legacy HR Card */}
          <Card className="bg-foreground text-background border-none relative overflow-hidden group">
            <CardContent className="p-8 md:p-12 relative z-10">
              <h3 className="text-2xl font-serif mb-8 text-muted">{t.legacy.title}</h3>
              <ul className="space-y-6">
                {t.legacy.points.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg">
                    <XCircle className="text-destructive shrink-0" size={24} />
                    <span className="opacity-90">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Mr-Hr Card */}
          <Card className="bg-primary border-none relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-yellow-600 opacity-90 z-0"></div>
            <CardContent className="p-8 md:p-12 relative z-10 text-primary-foreground">
              <h3 className="text-2xl font-serif mb-8">{t.mrhr.title}</h3>
              <ul className="space-y-6">
                {t.mrhr.points.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg font-medium">
                    <CheckCircle2 className="text-primary-foreground shrink-0" size={24} />
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
