import './_group.css';
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/sa/app/id6792693395";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.t2.nizamy";
const appPointsCopy = {
  en: "Download the Nizamy app now, sign in, and find your points inside the app.",
  ar: "حمّل تطبيق نظامي الآن، وسجّل دخولك، واكتشف نقاطك داخل التطبيق.",
} as const;

function AppStoreLinks({ language, className }: { language: "ar" | "en"; className?: string }) {
  const isAr = language === "ar";
  const links = [
    { store: "ios", url: APP_STORE_URL, label: "App Store", aria: isAr ? "حمّل تطبيق نظامي من App Store" : "Download Nizamy on the App Store" },
    { store: "android", url: GOOGLE_PLAY_URL, label: "Google Play", aria: isAr ? "حمّل تطبيق نظامي من Google Play" : "Get Nizamy on Google Play" },
  ] as const;
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {links.map((l) => (
        <a key={l.store} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.aria}
          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
          {l.label}
        </a>
      ))}
    </div>
  );
}

function Success({ isAr }: { isAr: boolean }) {
  return (
    <div dir={isAr ? "rtl" : "ltr"} lang={isAr ? "ar" : "en"} className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
      <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl bg-emerald-50 px-5 py-8 text-center" role="status">
        <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h3 className="text-lg font-bold text-slate-950">{isAr ? "تم إرسال النموذج" : "Form submitted"}</h3>
        <p className="mt-1 text-sm text-slate-600">{isAr ? `شكراً لك، وصلنا طلبك. ${appPointsCopy.ar}` : `Thank you, we received your request. ${appPointsCopy.en}`}</p>
        <AppStoreLinks language={isAr ? "ar" : "en"} className="mt-4" />
        <Button type="button" variant="outline" className="mt-5 w-full" onClick={() => {}}>
          {isAr ? "إغلاق" : "Close"}
        </Button>
      </div>
    </div>
  );
}

export function Current() {
  return (
    <div className="cr-scope min-h-screen bg-slate-100 p-6 flex flex-wrap items-start justify-center gap-6">
      <Success isAr />
      <Success isAr={false} />
    </div>
  );
}
