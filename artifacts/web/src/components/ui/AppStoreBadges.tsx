import { useLanguage } from "@/lib/i18n";
import { track } from "@/lib/analytics";

// Set these to the real store URLs once the apps are published.
// Leaving them empty keeps the badges in "coming soon" mode.
const APP_STORE_URL = "";
const GOOGLE_PLAY_URL = "";

function AppleIcon() {
  return (
    <svg viewBox="0 0 384 512" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
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
    : isAr ? "قريبًا على" : "Coming soon on";
  const storeName = store === "app-store" ? "App Store" : "Google Play";

  const inner = (
    <>
      <span className="shrink-0">{store === "app-store" ? <AppleIcon /> : <GooglePlayIcon />}</span>
      <span className="flex flex-col items-start leading-none text-start">
        <span className="text-[10px] font-medium opacity-80 mb-0.5">{topLine}</span>
        <span className="text-[15px] font-heading font-black tracking-tight" dir="ltr">{storeName}</span>
      </span>
    </>
  );

  const base =
    "inline-flex items-center gap-2.5 h-12 px-4 rounded-xl border transition-all duration-300 min-w-[150px]";

  if (isLive) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("app_badge_clicked", { store, language })}
        className={`${base} bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 shadow-[0_6px_16px_rgba(15,23,42,0.25)]`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      role="presentation"
      className={`${base} relative bg-slate-900 text-white border-slate-900 opacity-95`}
    >
      {inner}
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
