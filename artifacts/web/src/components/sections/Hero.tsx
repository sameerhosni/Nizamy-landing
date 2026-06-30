import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, BarChart3, TrendingUp, Users } from "lucide-react";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-powered HR, built for Saudi SMEs",
      headlinePart1: "Every other HR system is a cost. ",
      headlinePart2: "Mr-Hr is a return.",
      subtitle: "Mr-Hr returns up to 30% of your annual subscription cost back to you — every year.",
      primaryCta: "Calculate my return",
      secondaryCta: "Become a Design Partner",
      chips: [
        "30% Maximum annual return",
        "SAR 5 starting price per employee",
        "2 min from signup to first check-in",
        "0 penalties or chasing"
      ],
      mockup: {
        summary: "Return Summary (Sample)",
        period: "Q3 2024",
        vsLast: "vs last quarter",
        performance: "Performance Return",
        achievers: "Top Achievers",
        points: "Points Loop",
        returnBadge: "+30% Return",
        active: "Active"
      }
    },
    ar: {
      eyebrow: "موارد بشرية بالذكاء الاصطناعي، صُممت للمنشآت السعودية",
      headlinePart1: "كل أنظمة الموارد البشرية تكلفة. ",
      headlinePart2: "مستر إتش آر عائد.",
      subtitle: "مستر إتش آر يعيد لك حتى ٣٠٪ من تكلفة اشتراكك — كل عام.",
      primaryCta: "احسب العائد",
      secondaryCta: "كن شريك تصميم",
      chips: [
        "٣٠٪ الحد الأقصى للعائد السنوي",
        "SAR 5 سعر البدء لكل موظف",
        "دقيقتان من التسجيل لأول تسجيل حضور",
        "٠ غرامات أو ملاحقة"
      ],
      mockup: {
        summary: "ملخص العائد (توضيحي)",
        period: "الربع الثالث ٢٠٢٤",
        vsLast: "مقارنة بالربع الماضي",
        performance: "عائد الأداء",
        achievers: "المتميزون",
        points: "نظام التحفيز",
        returnBadge: "عائد ٣٠٪+",
        active: "نشط"
      }
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-background">
      {/* Background soft gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/60 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-border/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {t.eyebrow}
          </div>
          <h1 className="text-5xl md:text-7xl leading-[1.1] md:leading-[1.15]">
            <span className="text-foreground">{t.headlinePart1}</span>
            <span className="text-gradient-primary">{t.headlinePart2}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg h-14 px-8 shadow-glow rounded-xl group"
              onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.primaryCta}
              {isRtl ? <ArrowLeft className="ml-0 mr-2 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-12">
            {t.chips.map((chip, idx) => (
              <div key={idx} className="bg-white border border-border/60 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* Abstract UI Mockup */}
        <div className="w-full max-w-5xl mt-20 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="glassmorphic rounded-2xl p-4 md:p-8 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="font-bold text-lg">{t.mockup.summary}</div>
                  <div className="text-sm text-muted-foreground">{t.mockup.period}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">SAR 12,450</div>
                <div className="text-sm text-emerald-500 font-medium">+15% {t.mockup.vsLast}</div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <BarChart3 size={16} />
                  <span className="text-sm font-medium">{t.mockup.performance}</span>
                </div>
                <div className="text-2xl font-bold mb-2">SAR 6,200</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-pink-500 w-[60%]"></div>
                </div>
              </div>
              
              <div className="bg-background rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Users size={16} />
                  <span className="text-sm font-medium">{t.mockup.achievers}</span>
                </div>
                <div className="text-2xl font-bold mb-2">SAR 4,150</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 w-[40%]"></div>
                </div>
              </div>

              <div className="bg-background rounded-xl p-5 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">{t.mockup.points}</span>
                </div>
                <div className="text-2xl font-bold mb-2">SAR 2,100</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[20%]"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute -top-6 -right-6 bg-white shadow-lg rounded-full px-4 py-2 border border-border/50 text-sm font-bold text-primary animate-bounce" style={{ animationDuration: '3s' }}>
            {t.mockup.returnBadge}
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white shadow-lg rounded-full px-4 py-2 border border-border/50 text-sm font-bold text-emerald-500 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            {t.mockup.active}
          </div>
        </div>
      </div>
    </section>
  );
}
