import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics";

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

type Store = "ios" | "android";
type FormStatus = "idle" | "submitting" | "success" | "error";
type FormField = "name" | "email" | "whatsapp";
type FormErrors = Partial<Record<FormField, string>>;

const APP_STORE_URL = "https://apps.apple.com/sa/app/id6792693395";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.t2.nizamy";

function getStoreOrder(): Store[] {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return ["ios", "android"];
  }

  const isMobile = window.matchMedia("(max-width: 639px)").matches;
  if (!isMobile) return ["ios", "android"];

  if (/android/i.test(navigator.userAgent)) return ["android", "ios"];
  if (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  ) {
    return ["ios", "android"];
  }

  return ["ios", "android"];
}

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode = digits.startsWith("966") ? digits.slice(3) : digits;
  return withoutCountryCode.slice(0, 9);
}

export function DesignPartner(_props: DesignPartnerProps) {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const [storeOrder] = useState<Store[]>(getStoreOrder);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const content = {
    en: {
      heading: "Ready to get started with Nizamy?",
      sub: "Download the app for free and start managing your employees' attendance and commitment today.",
      downloadTitle: "Download the app",
      downloadNote: "Start for free · No credit card",
      formTitle: "Want someone to help you get set up?",
      formSub: "Leave your details and we'll get in touch.",
      labels: {
        name: "Full name",
        email: "Email address",
        whatsapp: "WhatsApp number",
      },
      placeholders: {
        name: "e.g. Abdullah Al-Mohammed",
        email: "name@company.com",
        whatsapp: "5XXXXXXXX",
      },
      validation: {
        name: "Please enter at least two characters.",
        email: "Please enter a valid email address.",
        whatsapp: "Enter a Saudi number in the format 5XXXXXXXX.",
      },
      submit: "Contact me",
      loading: "Sending...",
      success: "We received your details and will contact you soon.",
      error: "Something went wrong. Please try again.",
    },
    ar: {
      heading: "جاهز تبدأ مع نظامي؟",
      sub: "نزّل التطبيق مجاناً وابدأ إدارة حضور موظفيك والتزامهم من اليوم.",
      downloadTitle: "حمّل التطبيق",
      downloadNote: "ابدأ مجاناً · بدون بطاقة ائتمانية",
      formTitle: "تبي أحد يساعدك؟",
      formSub: "اترك بياناتك وبنتواصل معك.",
      labels: {
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        whatsapp: "رقم الواتساب",
      },
      placeholders: {
        name: "مثال: عبدالله المحمد",
        email: "name@company.com",
        whatsapp: "5XXXXXXXX",
      },
      validation: {
        name: "الاسم لازم يكون حرفين على الأقل.",
        email: "أدخل بريداً إلكترونياً صحيحاً.",
        whatsapp: "أدخل رقماً سعودياً بالصيغة 5XXXXXXXX.",
      },
      submit: "تواصلوا معي",
      loading: "جارٍ الإرسال...",
      success: "وصلتنا بياناتك، وبنتواصل معك قريب.",
      error: "صار خطأ، جرّب مرة ثانية",
    },
  };

  const t = content[language];

  useEffect(() => {
    const trackHeaderTryNow = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      const label = button?.textContent ?? "";
      if (
        /جرّبه الآن|جرب مجان|try it now|try now|try for free/i.test(label)
      ) {
        track("try_now_cta_click", { language });
      }
    };

    document.addEventListener("click", trackHeaderTryNow);
    return () => document.removeEventListener("click", trackHeaderTryNow);
  }, [language]);

  const storeDetails = {
    ios: {
      href: APP_STORE_URL,
      image: `${import.meta.env.BASE_URL}store-badges/app-store-ar.svg`,
      alt: isRtl ? "حمّل تطبيق نظامي من App Store" : "Download Nizamy on the App Store",
      event: "store_click_ios",
    },
    android: {
      href: GOOGLE_PLAY_URL,
      image: `${import.meta.env.BASE_URL}store-badges/google-play-ar.png`,
      alt: isRtl ? "حمّل تطبيق نظامي من Google Play" : "Get Nizamy on Google Play",
      event: "store_click_android",
    },
  } as const;

  const updateField = (field: FormField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim().length < 2) {
      nextErrors.name = t.validation.name;
    }
    if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = t.validation.email;
    }
    if (!/^5\d{8}$/.test(formData.whatsapp)) {
      nextErrors.whatsapp = t.validation.whatsapp;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      whatsapp: `+966${formData.whatsapp}`,
      timestamp: new Date().toISOString(),
      page_source: window.location.href,
    };

    try {
      const endpoint = (import.meta.env.LEAD_FORM_ENDPOINT ?? "").trim();
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`Lead form request failed with ${response.status}`);
        }
      } else {
        console.info("LEAD_FORM_ENDPOINT is empty. Lead payload:", payload);
      }

      track("assist_form_submit", {
        language,
        page_source: window.location.pathname,
      });
      setStatus("success");
    } catch (error) {
      console.error("Lead form submission failed:", error);
      setStatus("error");
    }
  };

  return (
    <section
      id="partner"
      data-analytics-section="partner"
      data-analytics-name="Try Now Download and Assist"
      className="py-16 sm:py-20 scroll-mt-24 relative z-[41] overflow-hidden bg-[#0A1A3A]"
    >
      <div className="absolute top-0 right-0 hidden h-[800px] w-[800px] -translate-y-1/3 translate-x-1/3 rounded-full bg-blue-500/10 blur-[150px] pointer-events-none sm:block" />
      <div className="absolute bottom-0 left-0 hidden h-[600px] w-[600px] translate-y-1/3 -translate-x-1/3 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none sm:block" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        <div className="grid gap-8" dir="ltr">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white px-6 py-12 text-center shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:px-10 sm:py-14"
            dir={dir}
          >
            <div className="pointer-events-none absolute -left-24 -top-32 hidden h-72 w-72 rounded-full bg-blue-100/80 sm:block" />
            <div className="pointer-events-none absolute -right-20 -bottom-36 hidden h-80 w-80 rounded-full bg-sky-100/80 sm:block" />
            <span
              aria-hidden="true"
              className="absolute right-5 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-2xl leading-none text-yellow-600"
            >
              ✱
            </span>

            <div className="relative z-10 mx-auto max-w-3xl" dir={dir}>
              <h2 className="text-3xl font-heading font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
                {t.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
                {t.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4" dir={dir}>
                {storeOrder.map((store) => {
                  const details = storeDetails[store];
                  return (
                    <a
                      key={store}
                      href={details.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={details.alt}
                      onClick={() => track(details.event, { language })}
                      className="flex h-[72px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                      <img
                        src={details.image}
                        alt={details.alt}
                        className={`block w-auto max-w-full object-contain ${
                          store === "ios" ? "h-[48px]" : "h-[72px]"
                        }`}
                      />
                    </a>
                  );
                })}
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">{t.downloadNote}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="hidden mx-auto w-full max-w-5xl rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_12px_30px_rgba(0,0,0,0.14)] sm:p-8"
            dir={dir}
          >
            {status === "success" ? (
              <div className="min-h-[420px] text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-7">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900 leading-relaxed">
                  {t.success}
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mb-2">
                  {t.formTitle}
                </h3>
                <p className="text-slate-500 font-medium mb-8">{t.formSub}</p>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {status === "error" && (
                    <div
                      role="alert"
                      className="p-4 bg-red-50 text-red-600 rounded-xl text-[15px] font-bold border border-red-100"
                    >
                      {t.error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.name}
                    </Label>
                    <Input
                      id="name"
                      required
                      minLength={2}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      placeholder={t.placeholders.name}
                      className="h-14 rounded-2xl border-slate-200 bg-[#FAFAFA] px-5 text-[15px] font-medium shadow-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      value={formData.name}
                      onChange={(event) => updateField("name", event.target.value)}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-sm font-bold text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      dir="ltr"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder={t.placeholders.email}
                      className="h-14 rounded-2xl border-slate-200 bg-[#FAFAFA] px-5 text-left text-[15px] font-medium shadow-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-sm font-bold text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-slate-700 font-bold text-[15px]">
                      {t.labels.whatsapp}
                    </Label>
                    <div className="flex h-14 items-center rounded-2xl border border-slate-200 bg-[#FAFAFA] focus-within:ring-2 focus-within:ring-blue-600">
                      <span className="border-r border-slate-200 px-4 font-bold text-slate-600" dir="ltr">
                        +966
                      </span>
                      <Input
                        id="whatsapp"
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={9}
                        pattern="5[0-9]{8}"
                        dir="ltr"
                        aria-invalid={Boolean(errors.whatsapp)}
                        aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                        placeholder={t.placeholders.whatsapp}
                        className="h-full rounded-2xl border-0 bg-transparent px-4 text-left text-[15px] font-medium shadow-none focus-visible:ring-0"
                        value={formData.whatsapp}
                        onChange={(event) =>
                          updateField("whatsapp", normalizeWhatsapp(event.target.value))
                        }
                      />
                    </div>
                    {errors.whatsapp && (
                      <p id="whatsapp-error" className="text-sm font-bold text-red-600">
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-14 text-[17px] font-bold rounded-2xl border border-blue-500 bg-blue-600/90 hover:bg-blue-700 text-white shadow-none disabled:opacity-70"
                  >
                    {status === "submitting" && (
                      <Loader2 className="me-2 h-5 w-5 animate-spin" />
                    )}
                    {status === "submitting" ? t.loading : t.submit}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}