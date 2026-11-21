import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { TrendingDown, Award, BarChart3, RefreshCw, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics";
import heroManPhones from "@/assets/hero-man-phones.png";
import noonLogo from "@/assets/brands/noon.png";
import hungerstationLogo from "@/assets/brands/hungerstation.png";
import amazonLogo from "@/assets/brands/amazon.png";
import jarirLogo from "@/assets/brands/jarir.png";

export function Hero() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const content = {
    en: {
      eyebrow: "AI-Powered HR · For Saudi SMEs",
      headlinePart1: "Attendance, employee requests and payroll reports. ",
      headlinePart2: "Less admin work. More time for your business.",
      subtitle: "Nizamy brings mobile attendance, AI-assisted employee requests, payroll reports and rewards into one HR system for Saudi businesses. Start without fingerprint devices or complex installation.",
      secondaryCta: "Estimate the time you could save",
      storeCaption: "Available now on the App Store and Google Play",
      highlights: [
        {
          title: "Attendance from your phone",
          desc: "Record check-ins and check-outs and review attendance without separate fingerprint devices.",
        },
        {
          title: "Employee requests, without chasing",
          desc: "Manage leave and HR requests with AI assistance, instead of scattered messages and manual follow-up.",
        },
        {
          title: "Payroll reports in one place",
          desc: "Prepare payroll reports using organized attendance records and reduce manual data gathering.",
        },
        {
          title: "More value from your HR budget",
          desc: "Reduce manual attendance follow-up and payroll preparation. Measure the time saved against your subscription cost to understand the value for your business.",
        },
      ],
    },
    ar: {
      eyebrow: "نظام موارد بشرية بالذكاء الاصطناعي",
      headlinePart1: "شؤون موظفينك في مكان واحد. ",
      headlinePart2: "ووقت أكثر لشغلك.",
      subtitle: "حضور من الجوال، وطلبات موظفين بمساعدة الذكاء الاصطناعي، وتقارير رواتب في مكان واحد. مع نظامي، تقلّ المتابعة اليدوية وتتفرّغ لشغلك.",
      secondaryCta: "قدّر الوقت الذي يمكنك توفيره",
      storeCaption: "متوفر الآن على App Store و Google Play",
      highlights: [
        {
          title: "حضور وانصراف من الجوال",
          desc: "موظفينك يسجّلون حضورهم وانصرافهم من الجوال، وأنت تتابع سجلاتهم من مكان واحد.",
        },
        {
          title: "طلبات الموظفين بدون ملاحقة",
          desc: "خلّ طلبات الإجازة والموارد البشرية في مكان واحد، بمساعدة الذكاء الاصطناعي، بدل الرسائل المتفرقة.",
        },
        {
          title: "تقارير الرواتب في مكان واحد",
          desc: "جهّز تقارير الرواتب من سجلات حضور منظّمة، ووفّر وقت تجميع البيانات يدويّاً.",
        },
        {
          title: "عائد أوضح على ميزانية الموارد البشرية",
          desc: "قلّل وقت متابعة الحضور وتجهيز تقارير الرواتب يدويّاً. وقارن قيمة الوقت اللي وفّرته بتكلفة الاشتراك عشان تعرف العائد على منشأتك.",
        },
      ],
    },
  };

  const t = content[language];
  const highlightIcons = [TrendingDown, Award, BarChart3, RefreshCw];

  return (
    <section data-analytics-section="hero" data-analytics-name="Hero" className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 overflow-hidden bg-[#FAFAFA]">
      {/* Full-bleed hero background image with directional fade */}
      <div className="absolute inset-x-0 top-0 h-full max-h-[900px] pointer-events-none overflow-hidden">
        <img
          src={heroManPhones}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* Fade toward the content side */}
        <div
          className={`absolute inset-0 ${
            isRtl
              ? "bg-gradient-to-l from-[#FAFAFA] from-35% via-[#FAFAFA]/80 via-60% to-[#FAFAFA]/5"
              : "bg-gradient-to-r from-[#FAFAFA] from-35% via-[#FAFAFA]/80 via-60% to-[#FAFAFA]/5"
          }`}
        />
        {/* Fade out toward the bottom so cards sit on a clean surface */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#FAFAFA] from-60% via-[#FAFAFA]/95 via-80% to-transparent" />
      </div>

      {/* Floating rewards card over the hero image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:block absolute top-56 end-10 xl:end-24 z-20 w-[300px]"
      >
        <div className="relative rounded-3xl bg-white/95 backdrop-blur border-2 border-amber-200/70 shadow-[0_25px_60px_rgba(245,158,11,0.20)] p-5 rotate-2">
          <span aria-hidden="true" className="absolute -top-3.5 -start-3 text-2xl rotate-[-12deg]">🎉</span>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Gift size={18} />
            </div>
            <div>
              <div className="text-[13.5px] font-heading font-black text-slate-900 leading-tight">
                {isRtl ? "مكافآت حقيقية لفريقك" : "Real rewards for your team"}
              </div>
              <div className="text-[11px] font-bold text-slate-400">
                {isRtl ? "قسائم من علاماتهم المفضلة" : "Vouchers from their favorite brands"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            <div className="aspect-square rounded-2xl bg-[#FEEE00] border border-[#F0E200] shadow-sm flex items-center justify-center p-2 -rotate-3">
              <img src={noonLogo} alt="noon" className="w-full h-auto object-contain" />
            </div>
            <div className="aspect-square rounded-2xl bg-[#FFDD00] border border-[#F2D100] shadow-sm flex items-center justify-center p-1.5 rotate-2">
              <img src={hungerstationLogo} alt="HungerStation" className="w-full h-auto object-contain" />
            </div>
            <div className="aspect-square rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2 -rotate-2">
              <img src={amazonLogo} alt="Amazon" className="w-full h-auto object-contain" />
            </div>
            <div className="aspect-square rounded-2xl bg-white border border-[#F8C9CC] shadow-sm flex items-center justify-center p-1.5 rotate-3">
              <img src={jarirLogo} alt="Jarir" className="w-full h-auto object-contain" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10.5px] font-black text-slate-400">{isRtl ? "وأكثر من 400 علامة أخرى" : "and 400+ more brands"}</span>
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10.5px] font-black px-2.5 py-1 shadow-sm">✨ {isRtl ? "تلقائيًا" : "automatic"}</span>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-16 lg:min-h-[520px] flex items-start">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex w-full max-w-2xl flex-col items-center gap-10 text-center lg:items-start lg:text-start lg:mx-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/60 px-5 py-2 text-sm font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            {t.eyebrow}
          </div>

          <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-heading font-black leading-[1.15] tracking-tight text-slate-900">
            {t.headlinePart1}
            <span className="text-blue-600 block sm:inline mt-2 sm:mt-0">{t.headlinePart2}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
            {t.subtitle}
          </p>

          <div className="flex w-full max-w-md flex-col items-center gap-4 lg:items-start">
            <div className="flex w-full items-center justify-center gap-4 lg:justify-start" dir="rtl">
              <a
                href="https://apps.apple.com/sa/app/id6792693395"
                target="_blank"
                rel="noopener"
                aria-label={isRtl ? "حمّل تطبيق نظامي من App Store" : "Download Nizamy on the App Store"}
                onClick={() => track("store_click_ios", { language })}
                className="flex h-14 items-center justify-center border-0 bg-transparent p-0 shadow-none rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <img
                  src={`${import.meta.env.BASE_URL}store-badges/app-store-ar.svg`}
                  alt={isRtl ? "تنزيل من App Store" : "Download on the App Store"}
                  className="block h-[48px] w-auto max-w-full object-contain"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.t2.nizamy"
                target="_blank"
                rel="noopener"
                aria-label={isRtl ? "حمّل تطبيق نظامي من Google Play" : "Get Nizamy on Google Play"}
                onClick={() => track("store_click_android", { language })}
                className="flex h-14 items-center justify-center border-0 bg-transparent p-0 shadow-none rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <img
                  src={`${import.meta.env.BASE_URL}store-badges/google-play-ar.png`}
                  alt={isRtl ? "احصل عليه من Google Play" : "Get it on Google Play"}
                  className="block h-[72px] w-auto max-w-full object-contain"
                />
              </a>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="h-auto w-auto rounded-full border-slate-200 bg-white/70 px-6 py-2.5 text-base font-bold text-slate-600 shadow-none hover:bg-white hover:text-blue-600 transition-all duration-300"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              {isRtl ? "عرض الباقات" : "View plans"}
            </Button>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {t.storeCaption}
          </p>
        </motion.div>
        </div>

        {/* Value Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {t.highlights.map((h, i) => {
            const Icon = highlightIcons[i];
            return (
              <div
                key={i}
                className="rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 p-8 text-start hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-12 h-12 rounded-[16px] bg-blue-50 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 mb-3 text-lg leading-snug">{h.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{h.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
