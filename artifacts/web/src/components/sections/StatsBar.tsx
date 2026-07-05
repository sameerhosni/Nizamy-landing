import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Timer, Wallet, ShieldOff } from "lucide-react";

const icons = [TrendingUp, Timer, Wallet, ShieldOff];

export function StatsBar() {
  const { language } = useLanguage();

  const stats = {
    en: [
      { value: "30%", label: "Max Annual Return" },
      { value: "2 min", label: "Onboarding Time" },
      { value: "SAR 5", label: "Starting Price / Employee" },
      { value: "0", label: "Penalties or Deductions" },
    ],
    ar: [
      { value: "30%", label: "الحد الاقصى للعائد من تكلفة الاشتراك السنوى" },
      { value: "دقيقة واحدة", label: "من التسجيل حتى أول حركة تسجيل حضور وانصراف" },
      { value: "٥ ريال", label: "سعر البدء / موظف شهريا" },
      { value: "٠", label: "لا حاجة الى غرامات او ملاحقات للموظفين" },
    ],
  };

  const t = stats[language];

  return (
    <section className="bg-white border-b border-border/50 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto divide-x divide-border/40 rtl:divide-x-reverse">
          {t.map((stat, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="text-center px-4 first:ps-0 last:pe-0">
                <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground leading-snug">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
