import { useLanguage } from "@/lib/i18n";
import { track } from "@/lib/analytics";

// Set these to the real store URLs once the apps are published.
// Leaving them empty keeps the badges in "coming soon" mode.
const APP_STORE_URL = "";
const GOOGLE_PLAY_URL = "";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  );
}

interface BadgeProps {
  store: "app-store" | "google-play";
  url: string;
}

function Badge({ store, url }: BadgeProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const isLive = url.length > 0;

  const topLine = isLive
    ? store === "app-store"
      ? isAr ? "حمّله من" : "Download on the"
      : isAr ? "احصل عليه من" : "Get it on"
    : isAr ? "قريباً على" : "Coming soon on";
  const storeName = store === "app-store" ? "App Store" : "Google Play";

  const iconChip = (
    <span
      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${
        store === "app-store"
          ? "bg-gradient-to-br from-slate-900 to-slate-700"
          : "bg-gradient-to-br from-emerald-600 to-emerald-500"
      }`}
    >
      {store === "app-store" ? <AppleIcon /> : <GooglePlayIcon />}
    </span>
  );

  const textCol = (
    <span className="flex flex-col leading-tight text-start">
      <span className="text-[10px] font-bold text-slate-400">{topLine}</span>
      <span className="text-[13px] font-black text-slate-700" dir="ltr">{storeName}</span>
    </span>
  );

  if (isLive) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("app_badge_clicked", { store, language })}
        className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-300 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] transition-all duration-300"
      >
        {iconChip}
        {textCol}
      </a>
    );
  }

  return (
    <div
      role="presentation"
      className="relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-dashed border-amber-200"
    >
      {iconChip}
      {textCol}
      <span className="absolute -top-2 -end-2 px-2 py-0.5 rounded-full bg-gradient-to-l from-amber-400 to-orange-400 text-white text-[10px] font-black shadow-lg">
        {isAr ? "قريباً" : "Soon"}
      </span>
    </div>
  );
}

export function AppStoreBadges({ className = "" }: { className?: string }) {
  const { language } = useLanguage();
  return (
    <div className={`flex flex-col items-center lg:items-start gap-2.5 ${className}`}>
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
        <Badge store="app-store" url={APP_STORE_URL} />
        <Badge store="google-play" url={GOOGLE_PLAY_URL} />
      </div>
      {!APP_STORE_URL && !GOOGLE_PLAY_URL && (
        <p className="text-[12px] font-bold text-slate-400">
          {language === "ar"
            ? "تطبيق نظامي في الطريق إليك — كل شيء يبدأ من جوالك 📱"
            : "The Nizamy app is on its way — everything starts from your phone 📱"}
        </p>
      )}
    </div>
  );
}
