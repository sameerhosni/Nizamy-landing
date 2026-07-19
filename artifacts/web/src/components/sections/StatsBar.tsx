import { useLanguage } from "@/lib/i18n";

export function StatsBar() {
  const { language } = useLanguage();

  const stats = {
    en: [
      { value: "0", label: "Penalties for employees" },
      { value: "SAR 3", label: "Starting price / employee / month" },
      { value: "1 min", label: "To your first verified check-in" },
      { value: "30%", label: "Max annual subscription return" },
    ],
    ar: [
      { value: "٠", label: "غرامات على الموظفين" },
      { value: "٣ ر.س", label: "سعر البدء للموظف شهرياً" },
      { value: "دقيقة", label: "حتى أول حضور وانصراف موثّق" },
      { value: "30%", label: "حد أقصى للعائد السنوي" },
    ],
  };

  const t = stats[language];

  return (
    <section className="bg-[#0f0f0f] border-t border-white/5 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 rtl:divide-x-reverse">
          {t.map((stat, idx) => (
            <div
              key={idx}
              className="py-10 px-6 text-center group transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-2 tabular-nums tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-white/40 leading-snug max-w-[140px] mx-auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
