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
      heading: "Be one of our founding Design Partners.",
      sub: "12 months free in exchange for weekly feedback. Limited to 7 companies.",
      labels: {
        name: "Full Name",
        company: "Company Name",
        email: "Work Email",
        whatsapp: "WhatsApp Number"
      },
      submit: "Apply to Partner Program",
      loading: "Applying...",
      success: {
        title: "Application Received",
        desc: "Thank you for applying. We will reach out to you on WhatsApp within 24 hours."
      },
      error: "Something went wrong. Please try again."
    },
    ar: {
      heading: "كن أحد شركاء التصميم المؤسسين.",
      sub: "١٢ شهراً مجاناً مقابل ملاحظات أسبوعية. مقتصر على ٧ شركات فقط.",
      labels: {
        name: "الاسم الكامل",
        company: "اسم الشركة",
        email: "البريد الإلكتروني للعمل",
        whatsapp: "رقم الواتساب"
      },
      submit: "قدم للبرنامج",
      loading: "جاري التقديم...",
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
    <section id="partner" className="py-24 bg-background scroll-mt-16">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif mb-4">{t.heading}</h2>
          <p className="text-xl text-muted-foreground">{t.sub}</p>
        </div>

        {mutation.isSuccess ? (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <CheckCircle2 className="text-primary w-16 h-16 mb-6" />
              <h3 className="text-2xl font-serif mb-2">{t.success.title}</h3>
              <p className="text-muted-foreground">{t.success.desc}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-border/50">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {mutation.isError && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {t.error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">{t.labels.name}</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">{t.labels.company}</Label>
                  <Input 
                    id="company" 
                    required 
                    value={formData.company}
                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t.labels.email}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">{t.labels.whatsapp}</Label>
                  <Input 
                    id="whatsapp" 
                    type="tel" 
                    required 
                    dir="ltr"
                    className="text-left"
                    value={formData.whatsapp}
                    onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg" 
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
    </section>
  );
}
