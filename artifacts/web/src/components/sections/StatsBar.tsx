import { useLanguage } from "@/lib/i18n";
import { AlertCircle, DollarSign, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function StatsBar() {
  const { language } = useLanguage();

  const stats = {
    en: [
      { icon: AlertCircle, value: "0", label: "Fines — a motivation-based system" },
      { icon: DollarSign, value: "SAR 3", label: "Starting price / employee / month" },
      { icon: Clock, value: "1 min", label: "To your first verified check-in" },
      { icon: TrendingUp, value: "30%", label: "Max annual subscription return" },
    ],
    ar: [
      { icon: AlertCircle, value: "٠", label: "نظام تحفيزي بدون غرامات" },
      { icon: DollarSign, value: "٣ ر.س", label: "يبدأ من ٣ ريال شهرياً للموظف" },
      { icon: Clock, value: "دقيقة واحدة", label: "حتى أول حضور وانصراف موثّق" },
      { icon: TrendingUp, value: "30%", label: "توفير سنوي حتى 30% من قيمة الاشتراك السنوي" },
    ],
  };

  const t = stats[language];

  return (
    <section className="bg-white py-16 border-b border-slate-100 relative z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 rtl:divide-x-reverse">
          {t.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx}
                className="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0 first:pt-0 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-slate-900 mb-3 tabular-nums tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[15px] font-bold text-slate-500 leading-snug max-w-[180px] mx-auto">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
