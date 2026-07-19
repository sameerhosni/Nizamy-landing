import { useLanguage } from "@/lib/i18n";

export function StatsBar() {
  const { language } = useLanguage();

  const stats = {
    en: [
      { value: "SAR 3", label: "Per employee / month — starting price" },
      { value: "Minutes", label: "To get started, no setup complexity" },
      { value: "SME", label: "Built specifically for Saudi small & mid-size businesses" },
      { value: "30%", label: "Max annual return — tied to your team's performance" },
    ],
    ar: [
      { value: "٣ ر.س", label: "للموظف شهرياً — سعر البدء" },
      { value: "دقائق", label: "وتكون جاهزاً، بلا تعقيد في الإعداد" },
      { value: "منشآت", label: "صُمم خصيصاً للمنشآت الصغيرة والمتوسطة في السعودية" },
      { value: "30%", label: "حد أقصى للعائد السنوي — مرتبط بأداء فريقك" },
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
