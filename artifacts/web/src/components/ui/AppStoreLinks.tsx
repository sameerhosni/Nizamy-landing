import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const APP_STORE_URL = "https://apps.apple.com/sa/app/id6792693395";
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.t2.nizamy";

export const appPointsCopy = {
  en: "Download the Nizamy app now, sign in, and find your points inside the app.",
  ar: "حمّل تطبيق نظامي الآن، وسجّل دخولك، واكتشف نقاطك داخل التطبيق.",
} as const;

/** Official store badges (same artwork as ServiceDownloadBadges) for confirmation states. Fires store_click_* analytics. */
export function AppStoreLinks({ language, source, className }: { language: "ar" | "en"; source: string; className?: string }) {
  const isAr = language === "ar";
  const links = [
    { store: "ios", url: APP_STORE_URL, image: "app-store-ar.svg", width: 120, height: 40, aria: isAr ? "حمّل تطبيق نظامي من App Store" : "Download Nizamy on the App Store" },
    { store: "android", url: GOOGLE_PLAY_URL, image: "google-play-ar.png", width: 646, height: 250, aria: isAr ? "حمّل تطبيق نظامي من Google Play" : "Get Nizamy on Google Play" },
  ] as const;
  return (
    <div className={cn("flex w-full flex-wrap items-center justify-center gap-3", className)} dir="rtl">
      {links.map((l) => (
        <a key={l.store} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.aria}
          data-testid={`link-${source}-${l.store}`}
          onClick={() => track(`store_click_${l.store}`, { language, source })}
          className="group inline-flex h-14 min-w-[44px] items-center justify-center rounded-xl p-1 no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:translate-y-0">
          <img src={`${import.meta.env.BASE_URL}store-badges/${l.image}`} alt="" width={l.width} height={l.height}
            className={cn("block w-auto max-w-full object-contain", l.store === "ios" ? "h-11" : "h-[66px] -my-2.5")} />
        </a>
      ))}
    </div>
  );
}
