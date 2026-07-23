import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useCreateLead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { dashboardTrackLead } from "@/lib/dashboardAnalytics";
import { track, identifyLead } from "@/lib/analytics";

interface DesignPartnerProps {
  snapshot: {
    employees: number;
    tier: string;
    tierPrice: number;
    subscription: number;
    totalReturn: number;
  };
  tier: "Standard" | "Growth" | "Pro";
  setTier: (val: "Standard" | "Growth" | "Pro") => void;
}

export function DesignPartner({ snapshot, tier, setTier }: DesignPartnerProps) {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const mutation = useCreateLead();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    whatsapp: "+966",
  });

  const content = {
    en: {
      heading: "Contact Us",
      sub: "We're opening a limited number of early-access slots. Claim yours before they're gone.",
      offerBadge: "Early-partner gift",
      offerHighlight: "3 months free",
      offerNote: "For the first 50 clients only",
      labels: {
        name: "Full Name",
        company: "Company Name",
        email: "Work Email",
        whatsapp: "WhatsApp Number",
      },
      placeholders: {
        name: "e.g. Abdullah Al-Mohammed",
        company: "Your company name",
        email: "name@company.com",
      },
      packageLabel: "Which plan are you interested in?",
      tiers: { Standard: "Standard", Growth: "Growth", Pro: "Pro" },
      submit: "Request Early Access",
      loading: "Sending...",
      success: {
        title: "Application Received",
        desc: "We've sent you an email with all the details — check your inbox.",
      },
      error: "Something went wrong. Please try again.",
      note: "No commitment · Just a conversation.",
    },
    ar: {
      heading: "تواصــل معنا",
      sub: "نفتح عدداً محدوداً من مقاعد الوصول المبكر. احجز مقعدك قبل أن تمتلئ.",
      offerBadge: "هدية الشركاء الأوائل",
      offerHighlight: "3 أشهر مجانًا",
      offerNote: "لأول 50 عميل",
      labels: {
        name: "الاسم الكامل",
        company: "اسم الشركة",
        email: "البريد الإلكتروني للعمل",
        whatsapp: "رقم الواتساب",
      },
      placeholders: {
        name: "مثال: عبدالله المحمد",
        company: "اسم منشأتك",
        email: "name@company.com",
      },
      packageLabel: "أي باقة تهمّك؟",
      tiers: { Standard: "أساسي", Growth: "نمو", Pro: "احترافي" },
      submit: "اطلب وصولاً مبكراً",
      loading: "جارٍ الإرسال...",
      success: {
        title: "تم استلام طلبك",
        desc: "تم إرسال بريد إلكتروني بكل التفاصيل — تحقق من بريدك الوارد.",
      },
      error: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      note: "بدون التزام · مجرد محادثة",
    },
  };

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        data: {
          ...formData,
          ...snapshot,
          language,
        },
      },
      {
        onSuccess: () => {
          identifyLead(formData.email, {
            name: formData.name,
            company: formData.company,
            email: formData.email.trim().toLowerCase(),
            whatsapp: formData.whatsapp,
            language,
          });
          track("lead_submitted", {
            company: formData.company,
            language,
            calculator_employees: snapshot.employees,
            calculator_tier: snapshot.tier,
            calculator_subscription: snapshot.subscription,
            calculator_total_return: snapshot.totalReturn,
          });
          dashboardTrackLead({
            company: formData.company,
            language,
            employees: snapshot.employees,
            tier: snapshot.tier,
          });
        },
        onError: () => {
          track("lead_submit_failed", { language });
        },
      },
    );
  };

  return (
    <section
      id="partner"
      data-analytics-section="partner"
      data-analytics-name="Design Partner Form"
      className="py-24 sm:py-32 scroll-mt-16 relative overflow-hidden bg-[#0A1A3A]"
    >
      {/* Premium Dark Background Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`space-y-10 text-white ${isRtl ? "lg:order-2" : "lg:order-1"}`}
          >
            <div>
              <h2 className="text-[3.5rem] sm:text-6xl lg:text-[5rem] font-heading font-black leading-[1.1] mb-8 tracking-tight">
                {t.heading}
              </h2>
              <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-lg mb-8">
                {t.sub}
              </p>

              {/* Offer card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative inline-flex items-center gap-5 rounded-[1.5rem] bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-300 text-slate-900 px-7 py-5 shadow-[0_15px_40px_rgba(251,191,36,0.35)] overflow-hidden"
              >
                <div className="absolute -top-6 -end-6 w-24 h-24 rounded-full bg-white/30 blur-2xl pointer-events-none" />
                <div className="w-14 h-14 rounded-[1rem] bg-slate-900 text-amber-300 flex items-center justify-center shrink-0">
                  <Gift className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[13px] font-black uppercase tracking-wide text-slate-800/80">
                    <Sparkles className="w-4 h-4" />
                    {t.offerBadge}
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-black leading-tight">
                    {t.offerHighlight}
                  </div>
                  <div className="text-[13px] font-bold text-slate-800/70">{t.offerNote}</div>
                </div>
              </motion.div>
            </div>
            
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`${isRtl ? "lg:order-1" : "lg:order-2"}`}
          >
            {mutation.isSuccess ? (
              <div className="rounded-[2.5rem] bg-white p-16 text-center flex flex-col items-center shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                <div className="w-24 h-24 rounded-[1.5rem] bg-green-50 text-green-500 flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-heading font-black mb-4 text-slate-900">{t.success.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">{t.success.desc}</p>
              </div>
            ) : (
              <div className="rounded-[2.5rem] bg-white p-10 sm:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative">
                <form onSubmit={handleSubmit} className="space-y-7">
                  {mutation.isError && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[15px] font-bold border border-red-100">
                      {t.error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-slate-700 font-bold text-[15px]">{t.packageLabel}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Standard", "Growth", "Pro"] as const).map((tOption) => (
                        <button
                          key={tOption}
                          type="button"
                          onClick={() => {
                            setTier(tOption);
                            track("form_package_selected", { tier: tOption, language });
                          }}
                          className={`py-3.5 px-2 border-2 rounded-[1rem] text-center transition-all duration-300 ${
                            tier === tOption
                              ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm"
                              : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50 bg-[#FAFAFA]"
                          }`}
                        >
                          <div className="font-heading font-black text-[15px]">{t.tiers[tOption]}</div>
                          <div className="text-[12px] font-bold opacity-75">SAR {tOption === "Standard" ? 3 : tOption === "Growth" ? 5 : 8}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.name}
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder={t.placeholders.name}
                      className="h-16 rounded-[1rem] border-slate-200 bg-[#FAFAFA] px-6 text-[15px] font-medium shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.company}
                    </Label>
                    <Input
                      id="company"
                      required
                      placeholder={t.placeholders.company}
                      className="h-16 rounded-[1rem] border-slate-200 bg-[#FAFAFA] px-6 text-[15px] font-medium shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white transition-all"
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder={t.placeholders.email}
                      className="h-16 rounded-[1rem] border-slate-200 bg-[#FAFAFA] px-6 text-[15px] font-medium shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="whatsapp" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.whatsapp}
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      required
                      dir="ltr"
                      className="h-16 rounded-[1rem] border-slate-200 bg-[#FAFAFA] px-6 text-[15px] font-medium text-left shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white transition-all"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 text-[17px] font-bold rounded-[1rem] border-0 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] transition-all group mt-6"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="me-2 h-5 w-5 animate-spin" />
                        {t.loading}
                      </>
                    ) : (
                      <>
                        {t.submit}
                        {isRtl ? (
                          <ArrowLeft className="ms-2 h-5 w-5 group-hover:-translate-x-1.5 transition-transform" />
                        ) : (
                          <ArrowRight className="ms-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                        )}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
