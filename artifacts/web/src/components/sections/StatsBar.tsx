import { useLanguage } from "@/lib/i18n";
import { ShieldOff, Wallet, Timer, TrendingUp } from "lucide-react";

const icons = [ShieldOff, Wallet, Timer, TrendingUp];

export function StatsBar() {
  const { language } = useLanguage();

  const stats = {
    en: [
      { value: "0", label: "Penalties" },
      { value: "SAR 3", label: "Starting price" },
      { value: "1 min", label: "To register" },
      { value: "30%", label: "Max annual return" },
    ],
    ar: [
      { value: "٠", label: "غرامات" },
      { value: "٣ ر.س", label: "سعر البدء" },
      { value: "دقيقة", label: "للتسجيل" },
      { value: "30%", label: "حد أقصى للعائد" },
    ],
  };

  const t = stats[language];

  return (
    <section className="bg-mrhr-dark py-10 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto divide-x divide-white/10 rtl:divide-x-reverse">
          {t.map((stat, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="text-center px-4 first:ps-0 last:pe-0">
                <div className="w-10 h-10 rounded-xl bg-white/8 text-[#8B6BFF] flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-black text-white mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 leading-snug">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
