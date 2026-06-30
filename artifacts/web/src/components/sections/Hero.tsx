import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      headlinePart1: "Every other HR system is a cost. ",
      headlinePart2: "Mr-Hr is a return.",
      subtitle: "Mr-Hr returns up to 30% of your subscription back to you, every year — through performance gains, top-achiever rewards, and a points loop your team actually uses.",
      primaryCta: "Calculate my return",
      secondaryCta: "Become a Design Partner",
      chips: [
        "30% Maximum annual return",
        "SAR 5 starting price per employee",
        "10 min from signup to first check-in",
        "0 penalties or chasing"
      ]
    },
    ar: {
      headlinePart1: "كل أنظمة الموارد البشرية تكلفة. ",
      headlinePart2: "مستر إتش آر عائد.",
      subtitle: "مستر إتش آر يعيد لك حتى ٣٠٪ من قيمة اشتراكك سنوياً — من خلال تحسين الأداء، ومكافآت المتميزين، وحلقة نقاط يستخدمها فريقك فعلياً.",
      primaryCta: "احسب العائد",
      secondaryCta: "كن شريك تصميم",
      chips: [
        "٣٠٪ الحد الأقصى للعائد السنوي",
        "SAR 5 سعر البدء لكل موظف",
        "١٠ دقائق من التسجيل لأول تسجيل حضور",
        "٠ غرامات أو ملاحقة"
      ]
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl leading-tight">
            <span className="text-secondary">{t.headlinePart1}</span>
            <span className="text-primary italic">{t.headlinePart2}</span>
          </h1>
          
          <p className="text-xl text-secondary/80 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg h-14 px-8 group"
              onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.primaryCta}
              {isRtl ? <ArrowLeft className="ml-0 mr-2 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-lg h-14 px-8 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.secondaryCta}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16">
            {t.chips.map((chip, idx) => (
              <div key={idx} className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-sm font-medium text-secondary/90 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
