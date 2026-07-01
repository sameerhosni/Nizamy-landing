import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useCreateLead } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

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
      headingPart1: "Early Adopter ",
      headingPart2: "Limited Access.",
      headingPart3: "",
      sub: "We are opening a limited number of early-access spots. Claim yours before they are gone.",
      valuePoints: [
        "Free early access",
        "Limited spots available",
        "Be first to shape the product"
      ],
      note: "No commitment. Just a conversation.",
      labels: {
        name: "Full Name",
        company: "Company Name",
        email: "Work Email",
        whatsapp: "WhatsApp Number"
      },
      submit: "Request Early Access",
      loading: "Sending...",
      success: {
        title: "Application Received",
        desc: "Thank you for applying. We will reach out to you on WhatsApp within 24 hours."
      },
      error: "Something went wrong. Please try again."
    },
    ar: {
      headingPart1: "وصول مبكر ",
      headingPart2: "محدود.",
      headingPart3: "",
      sub: "نفتح عدداً محدوداً من مقاعد الوصول المبكر. احجز مقعدك قبل أن تمتلئ.",
      valuePoints: [
        "وصول مبكر مجاني",
        "مقاعد محدودة",
        "كن أول من يشكّل المنتج"
      ],
      note: "بدون التزام. مجرد محادثة.",
      labels: {
        name: "الاسم الكامل",
        company: "اسم الشركة",
        email: "البريد الإلكتروني للعمل",
        whatsapp: "رقم الواتساب"
      },
      submit: "اطلب وصولاً مبكراً",
      loading: "جارٍ الإرسال...",
      success: {
        title: "تم استلام طلبك",
        desc: "شكراً لتقديمك. سنتواصل معك عبر الواتساب خلال ٢٤ ساعة."
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
    <section id="partner" className="py-24 bg-white scroll-mt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Text column */}
          <div className="md:pt-6">
            <h2 className="text-4xl leading-tight mb-4">
              <span className="text-foreground">{t.headingPart1}</span>
              <span className="text-gradient-primary">{t.headingPart2}</span>
              <span className="text-foreground">{t.headingPart3}</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">{t.sub}</p>
            <ul className="space-y-3">
              {t.valuePoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary w-5 h-5 mt-1 shrink-0" />
                  <span className="text-base text-foreground">{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-8">{t.note}</p>
          </div>

          {/* Form column */}
          <div>
            {mutation.isSuccess ? (
              <Card className="bg-white border-primary/20 shadow-glow">
                <CardContent className="p-12 text-center flex flex-col items-center">
                  <CheckCircle2 className="text-primary w-16 h-16 mb-6" />
                  <h3 className="text-2xl font-bold mb-2">{t.success.title}</h3>
                  <p className="text-muted-foreground">{t.success.desc}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-xl border-border/50 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {mutation.isError && (
                      <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                        {t.error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-muted-foreground">{t.labels.name}</Label>
                      <Input
                        id="name"
                        required
                        className="bg-white"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-muted-foreground">{t.labels.company}</Label>
                      <Input
                        id="company"
                        required
                        className="bg-white"
                        value={formData.company}
                        onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground">{t.labels.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="bg-white"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-muted-foreground">{t.labels.whatsapp}</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        required
                        dir="ltr"
                        className="text-left bg-white"
                        value={formData.whatsapp}
                        onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg shadow-glow rounded-xl"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {mutation.isPending ? t.loading : t.submit}
                    </Button>
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
