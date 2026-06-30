import { useLanguage } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Smartphone, Fingerprint, ShieldCheck, HeartHandshake } from "lucide-react";

export function Advantages() {
  const { language, dir } = useLanguage();

  const content = {
    en: {
      titlePart1: "Key ",
      titlePart2: "Advantages",
      subhead: "Every feature is built to do one thing: turn HR from a cost you tolerate into an edge you compound.",
      items: [
        {
          icon: <Bot size={28} />,
          title: "Saudi-dialect AI",
          desc: "AI HR agent + Muntej voice/text in Saudi Arabic"
        },
        {
          icon: <Smartphone size={28} />,
          title: "Mobile-first",
          desc: "Built for the phone, not the desk"
        },
        {
          icon: <Fingerprint size={28} />,
          title: "Multi-modal verification",
          desc: "GPS + fingerprint + face + voice"
        },
        {
          icon: <ShieldCheck size={28} />,
          title: "Saudi-native compliance",
          desc: "WPS, GOSI, Mudad, EOSB, ZATCA, Sun–Thu"
        },
        {
          icon: <HeartHandshake size={28} />,
          title: "Motivational, not punitive",
          desc: "The only Saudi HR system where employees are never penalized"
        },
        {
          icon: <Bot size={28} />,
          title: "AI HR Self-Service",
          desc: "Employees submit leave, check payslips, and get HR answers through AI — no manager overhead"
        },
        {
          icon: <ShieldCheck size={28} />,
          title: "Automated Payroll & WPS",
          desc: "One-click payroll with automatic WPS filing and salary transfer"
        },
        {
          icon: <Fingerprint size={28} />,
          title: "Smart Scheduling",
          desc: "AI-optimized shift scheduling that reduces overtime costs and fills gaps automatically"
        }
      ]
    },
    ar: {
      titlePart1: "المزايا ",
      titlePart2: "الرئيسية",
      subhead: "كل ميزة صُممت لهدف واحد: تحويل الموارد البشرية من تكلفة تتحملها إلى ميزة تتضاعف لصالحك.",
      items: [
        {
          icon: <Bot size={28} />,
          title: "ذكاء اصطناعي باللهجة السعودية",
          desc: "وكيل موارد بشرية ذكي + مساعد مُنتج صوتي/نصي بالعربية السعودية"
        },
        {
          icon: <Smartphone size={28} />,
          title: "صُمم للجوال أولاً",
          desc: "صُمم للهاتف، وليس للمكتب"
        },
        {
          icon: <Fingerprint size={28} />,
          title: "تحقق متعدد الوسائط",
          desc: "موقع جغرافي + بصمة إصبع + وجه + صوت"
        },
        {
          icon: <ShieldCheck size={28} />,
          title: "توافق محلي سعودي",
          desc: "نظام حماية الأجور، التأمينات الاجتماعية، مدد، مكافأة نهاية الخدمة، هيئة الزكاة، الأحد-الخميس"
        },
        {
          icon: <HeartHandshake size={28} />,
          title: "تحفيزي، ليس عقابياً",
          desc: "نظام الموارد البشرية السعودي الوحيد الذي لا يعاقب الموظفين أبداً"
        },
        {
          icon: <Bot size={28} />,
          title: "الخدمة الذاتية بالذكاء الاصطناعي",
          desc: "الموظفون يقدمون طلباتهم، يراجعون مستحقاتهم، ويحصلون على إجابات عبر الذكاء الاصطناعي — بدون تدخل المدير"
        },
        {
          icon: <ShieldCheck size={28} />,
          title: "كشوف رواتب تلقائية وحماية أجور",
          desc: "معالجة الرواتب بنقرة واحدة مع إيداع تلقائي لنظام حماية الأجور"
        },
        {
          icon: <Fingerprint size={28} />,
          title: "جدولة ذكية للوردية",
          desc: "جدولة مُحسَّنة بالذكاء الاصطناعي تقلل تكاليف الوقت الإضافي وتملأ الفراغات تلقائياً"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center mb-6 leading-tight">
          <span className="text-foreground">{t.titlePart1}</span>
          <span className="text-gradient-primary">{t.titlePart2}</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto leading-relaxed">
          {t.subhead}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {t.items.map((item, idx) => (
            <Card key={idx} className="bg-background border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-accent text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform origin-left">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
