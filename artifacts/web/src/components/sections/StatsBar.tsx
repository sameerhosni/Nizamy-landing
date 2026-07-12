import { useLanguage } from "@/lib/i18n";
import { ShieldOff, Wallet, Timer, TrendingUp } from "lucide-react";

const icons = [ShieldOff, Wallet, Timer, TrendingUp];

export function StatsBar() {
  const { language } = useLanguage();

  const stats = {
    en: [
      { value: "0", label: "No penalties for employees" },
      { value: "SAR 3", label: "Starting price per employee monthly" },
      { value: "1 min", label: "One minute to your first check-in and check-out" },
      { value: "30%", label: "Max annual return" },
    ],
    ar: [
      { value: "٠", label: "بدون غرامات للموظفين" },
      { value: "٣ ر.س", label: "سعر البدء للموظف شهرياً" },
      { value: "دقيقة", label: "دقيقة واحدة حتى إثبات أول حضور وانصراف" },
      { value: "30%", label: "حد أقصى للعائد" },
    ],
  };

  const t = stats[language];

  return (
    <section className="bg-white py-12 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto divide-x divide-slate-100 rtl:divide-x-reverse">
          {t.map((stat, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="text-center px-4 first:ps-0 last:pe-0 transition-transform hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                  <Icon size={20} />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500 leading-snug">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
