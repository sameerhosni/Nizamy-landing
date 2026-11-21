import { useLanguage } from "@/lib/i18n";
import { Bot, ScanFace, Settings2, Gift, Wallet, ListChecks, Fingerprint, Archive } from "lucide-react";
import { motion } from "framer-motion";

export function WhyNizamy() {
  const { language } = useLanguage();
  const benefitIcons = [Bot, ScanFace, Settings2, Gift, Wallet, ListChecks, Fingerprint, Archive];

  const content = {
    en: {
      eyebrow: "Why Nizamy?",
      heading: "Less admin. More time for your team.",
      subhead:
        "Bring AI self-service, secure attendance, employee rewards, and real-time reports together — with payroll and management tools that grow with your team.",
      titles: ["AI self-service", "Verified attendance", "Effortless setup", "Rewards that motivate", "Simpler payroll", "HR administration and performance", "Flexible check-ins", "Secure records"],
      rows: [
        { traditional: "Leave and employee requests scattered across messages", nizamy: "An AI agent handles self-service requests, with real-time reports in the manager dashboard.", plan: "Free", tier: "free" },
        { traditional: "Attendance records that need stronger verification", nizamy: "3D facial verification and liveness detection help identify photo-based attendance fraud.", plan: "Starter", tier: "starter" },
        { traditional: "Time spent learning account and shift settings", nizamy: "An AI assistant helps configure your organization and shifts without training.", plan: "Starter", tier: "starter" },
        { traditional: "Employee recognition that takes extra coordination", nizamy: "Discount codes, exclusive offers, gift cards, and varied rewards from local and international brands.", tier: "starter" },
        { traditional: "Payroll work spread across separate processes", nizamy: "Payroll tools that scale up to full payroll management.", tier: "growth" },
        { traditional: "HR administration and employee reviews that need manual follow-up", nizamy: "AI assistance for HR administration, with unlimited use and employee performance evaluations available.", tier: "growth" },
        { traditional: "Attendance needs beyond a standard check-in", nizamy: "Phone-based biometrics, with voice and offline attendance options.", tier: "growth" },
        { traditional: "Keeping records accessible as your team grows", nizamy: "Secure records for up to 12 months, with free early access to new features.", tier: "growth" },
      ],
    },
    ar: {
      eyebrow: "ليش نظامي؟",
      subhead: "كل الأنظمة تعطيك سجل حضور. نظامي يغيّر الحضور نفسه.",
      titles: ["جاهز من أول يوم", "يغيّر السلوك، مو بس يسجّله", "مساعد يعرف شركتك", "للتحفيز، مو للعقاب"],
      rows: [
        { nizamy: "بدون أجهزة، بدون تركيب، وبدون مشروع تطبيق يطول شهور. تسجّل، تدعو فريقك، وتشوف أول يوم حضور." },
        { nizamy: "الحضور بوقته يكسب نقاط تتحول لمكافآت حقيقية، فالالتزام يصير له قيمة عند الموظف." },
        { nizamy: "مساعد HR ذكي بالعربي، يرد على أسئلتك وأسئلة موظفينك من بيانات شركتك أنت." },
        { nizamy: "نظامي مصمم يكافئ الملتزم، مو يدوّر على الخصم." },
      ],
      closing: "وكل هذا بالعربي أولًا، ومصمم للشركات السعودية.",
    },
  };

  const t = content[language];
  const closing = "closing" in t ? t.closing : null;

  return (
    <section id="why-nizamy" data-analytics-section="why-nizamy" data-analytics-name="Why Nizamy" dir={language === "ar" ? "rtl" : "ltr"} className="py-10 sm:py-12 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center mb-6"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-black leading-tight mb-3 text-neutral-900 tracking-tight">
            {t.eyebrow}
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-medium max-w-3xl mx-auto">
            {t.subhead}
          </p>
        </motion.div>

        {/* Benefit cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        >
          {t.rows.map((row, idx) => {
            const Icon = benefitIcons[idx];
            return (
            <article key={idx} className="bg-white border border-neutral-100 rounded-sm p-5 sm:p-6 shadow-[0_8px_28px_rgba(0,0,0,0.045)] flex items-start gap-4 text-start">
                <span className="flex h-10 w-10 text-neutral-800 items-center justify-center shrink-0">
                  <Icon aria-hidden="true" size={30} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-heading font-bold text-neutral-900 mb-2">{t.titles[idx]}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{row.nizamy}</p>
                </div>
            </article>
          );})}
        </motion.div>

        {closing && (
          <p className="max-w-3xl mx-auto mt-6 text-center text-sm text-neutral-500 font-medium">{closing}</p>
        )}
      </div>
    </section>
  );
}
