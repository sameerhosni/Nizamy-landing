import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useCreateLead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, ScanFace } from "lucide-react";

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
  const { language } = useLanguage();
  const mutation = useCreateLead();
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    whatsapp: "+966"
  });

  const content = {
    en: {
      headingPart1: "Limited ",
      headingPart2: "Early Access.",
      headingPart3: "",
      sub: "We are opening a limited number of early-access spots. Claim yours before they are gone.",
      valuePoints: [
        "Fully free early access",
        "Limited spots per industry",
        "Be first to shape the product",
        "No commitment — just a conversation"
      ],
      note: "No commitment · Just a conversation.",
      labels: {
        name: "Full Name",
        company: "Company Name",
        email: "Work Email",
        whatsapp: "WhatsApp Number"
      },
      placeholders: {
        name: "e.g. Abdullah Al-Mohammed",
        company: "Your company name",
        email: "name@company.com"
      },
      submit: "Request Early Access",
      loading: "Sending...",
      success: {
        title: "Application Received",
        desc: "Thank you for reaching out. We've sent you an email with all the details — please check your inbox or spam folder."
      },
      error: "Something went wrong. Please try again."
    },
    ar: {
      headingPart1: "وصول مبكر ",
      headingPart2: "محدود.",
      headingPart3: "",
      sub: "نفتح عدداً محدوداً من مقاعد الوصول المبكر. احجز مقعدك قبل أن تمتلئ.",
      valuePoints: [
        "وصول مبكر مجاني بالكامل",
        "مقاعد محدودة لكل قطاع",
        "كن أول من يشكّل المنتج",
        "بدون التزام — مجرد محادثة"
      ],
      note: "بدون التزام · مجرد محادثة",
      labels: {
        name: "الاسم الكامل",
        company: "اسم الشركة",
        email: "البريد الإلكتروني للعمل",
        whatsapp: "رقم الواتساب"
      },
      placeholders: {
        name: "مثال: عبدالله المحمد",
        company: "اسم منشأتك",
        email: "name@company.com"
      },
      submit: "اطلب وصولاً مبكراً",
      loading: "جارٍ الإرسال...",
      success: {
        title: "تم استلام طلبك",
        desc: "شكراً لتواصلك معنا. تم إرسال بريد إلكتروني بكل التفاصيل — يرجى التحقق من بريدك الإلكتروني أو الرسائل المهملة."
      },
      error: "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    }
  };

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      data: {
        ...formData,
        ...snapshot
      }
    });
  };

  return (
    <section id="partner" className="py-24 bg-blue-900 scroll-mt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Text column */}
          <div className="md:pt-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-800 border border-blue-700 flex items-center justify-center mb-8 shadow-lg">
              <ScanFace className="w-8 h-8 text-blue-300" />
            </div>
            <h2 className="text-4xl font-heading font-extrabold leading-tight mb-4">
              <span className="text-white">{t.headingPart1}</span>
              <span className="text-blue-300">{t.headingPart2}</span>
              <span className="text-white">{t.headingPart3}</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">{t.sub}</p>
            <ul className="space-y-4">
              {t.valuePoints.map((point, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-blue-300 w-4 h-4" />
                  </div>
                  <span className="text-base text-blue-50 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form column */}
          <div>
            {mutation.isSuccess ? (
              <Card className="bg-white border-0 shadow-soft rounded-3xl">
                <CardContent className="p-12 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">{t.success.title}</h3>
                  <p className="text-slate-500 text-lg">{t.success.desc}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {mutation.isError && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {t.error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-600 font-semibold">{t.labels.name}</Label>
                      <Input
                        id="name"
                        required
                        placeholder={t.placeholders.name}
                        className="h-14 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-slate-600 font-semibold">{t.labels.company}</Label>
                      <Input
                        id="company"
                        required
                        placeholder={t.placeholders.company}
                        className="h-14 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                        value={formData.company}
                        onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-600 font-semibold">{t.labels.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder={t.placeholders.email}
                        className="h-14 rounded-xl border-slate-200 bg-slate-50 px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-slate-600 font-semibold">{t.labels.whatsapp}</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        required
                        dir="ltr"
                        className="h-14 rounded-xl border-slate-200 bg-slate-50 px-4 text-base text-left shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all"
                        value={formData.whatsapp}
                        onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold rounded-xl border-0 bg-blue-600 hover:bg-blue-700 text-white shadow-glow transition-all"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {mutation.isPending ? t.loading : t.submit}
                    </Button>
                    <p className="text-sm text-slate-500 text-center font-medium">{t.note}</p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
