import { useLanguage } from "@/lib/i18n";
import { HubSpotForm } from "@/components/HubSpotForm";

const content = {
  en: {
    title: "Contact us",
    description: "Have a question about Nizamy? Send us a message.",
    error: "The contact form could not be submitted. Please try again or email us instead.",
  },
  ar: {
    title: "تواصل معنا",
    description: "عندك سؤال عن نظامي، الأسعار، أو كيف يناسب شركتك؟ فريقنا يرد عليك.",
    error: "صار خلل بسيط، جرّب مرة ثانية أو راسلنا على الإيميل.",
  },
};

export function HubSpotContact() {
  const { language, dir } = useLanguage();
  const copy = content[language];

  return (
    <section id="contact-us" dir={dir} className="scroll-mt-24 bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            {copy.title}
          </h2>
          {language !== "ar" && <p className="mt-4 text-lg text-slate-600">{copy.description}</p>}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
          <HubSpotForm
            includeSector
            locale={language}
            errorMessage={copy.error}
            className="min-h-64"
            testId="hubspot-contact-form"
            requiredMessage={language === "ar" ? "نسيت هالخانة" : undefined}
            copyOverrides={language === "ar" ? {
              firstName: "الاسم",
              email: "الإيميل",
              message: "رسالتك (اختياري)",
              submit: "أرسل",
              successTitle: "وصلتنا رسالتك! بنرد عليك خلال أوقات الدوام.",
              successBody: "",
              retryable: copy.error,
              consentUnavailable: copy.error,
            } : undefined}
          />
          {language !== "ar" && <p className="mt-4 text-center text-sm text-slate-600">
            <a href="mailto:sales@nizamy.app" className="text-blue-600 underline">
              sales@nizamy.app
            </a>
          </p>}
        </div>
      </div>
    </section>
  );
}