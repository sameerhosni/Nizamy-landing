import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useCreateLead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

interface DesignPartnerProps {
  snapshot: {
    employees: number;
    tier: string;
    tierPrice: number;
    subscription: number;
    totalReturn: number;
  };
}

export function DesignPartner({ snapshot }: DesignPartnerProps) {
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
      eyebrow: "Limited Early Access",
      headingPart1: "Reserve your",
      headingPart2: "spot.",
      sub: "We're opening a limited number of early-access slots. Claim yours before they're gone.",
      valuePoints: [
        "Fully free early access",
        "Limited spots per industry",
        "Be first to shape the product",
        "No commitment — just a conversation",
      ],
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
      eyebrow: "وصول مبكر محدود",
      headingPart1: "احجز",
      headingPart2: "مقعدك.",
      sub: "نفتح عدداً محدوداً من مقاعد الوصول المبكر. احجز مقعدك قبل أن تمتلئ.",
      valuePoints: [
        "وصول مبكر مجاني بالكامل",
        "مقاعد محدودة لكل قطاع",
        "كن أول من يشكّل المنتج",
        "بدون التزام — مجرد محادثة",
      ],
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
    mutation.mutate({
      data: {
        ...formData,
        ...snapshot,
        language,
      },
    });
  };

  return (
    <section
      id="partner"
      className="py-24 sm:py-32 scroll-mt-16 relative overflow-hidden bg-[#0a0a0a]"
    >
      {/* Glows */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Text column */}
          <div className={`space-y-8 ${isRtl ? "md:order-2" : "md:order-1"}`}>
            <div>
              <span className="inline-block text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-800/50 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
                {t.eyebrow}
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.05]">
                <span className="text-white">{t.headingPart1}</span>
                <br />
                <span className="text-blue-400">{t.headingPart2}</span>
              </h2>
            </div>
            <p className="text-lg text-white/50 leading-relaxed font-medium">{t.sub}</p>
            <ul className="space-y-4">
              {t.valuePoints.map((point, idx) => (
                <li key={idx} className="flex items-center gap-3 rtl:flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-blue-400 w-3.5 h-3.5" />
                  </div>
                  <span className="text-base text-white/70 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form column */}
          <div className={`${isRtl ? "md:order-1" : "md:order-2"}`}>
            {mutation.isSuccess ? (
              <div className="rounded-3xl bg-white/5 border border-white/10 p-10 sm:p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-400 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-heading font-black mb-3 text-white">{t.success.title}</h3>
                <p className="text-white/50 text-base leading-relaxed">{t.success.desc}</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {mutation.isError && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      {t.error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-slate-600 font-semibold text-sm">
                      {t.labels.name}
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder={t.placeholders.name}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-slate-600 font-semibold text-sm">
                      {t.labels.company}
                    </Label>
                    <Input
                      id="company"
                      required
                      placeholder={t.placeholders.company}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-600 font-semibold text-sm">
                      {t.labels.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder={t.placeholders.email}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp" className="text-slate-600 font-semibold text-sm">
                      {t.labels.whatsapp}
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      required
                      dir="ltr"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-base text-left shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-13 text-base font-bold rounded-xl border-0 bg-blue-600 hover:bg-blue-500 text-white shadow-glow transition-all group mt-2"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        {t.loading}
                      </>
                    ) : (
                      <>
                        {t.submit}
                        {isRtl ? (
                          <ArrowLeft className="ms-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="ms-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        )}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-slate-400 text-center font-medium">{t.note}</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
