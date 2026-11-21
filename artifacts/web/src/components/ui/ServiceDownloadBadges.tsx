import { useLanguage } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const stores = [
  { store: "ios", url: "https://apps.apple.com/sa/app/id6792693395", image: "app-store-ar.svg", width: 120, height: 40 },
  { store: "android", url: "https://play.google.com/store/apps/details?id=com.t2.nizamy", image: "google-play-ar.png", width: 646, height: 250 },
] as const;

/** Match the homepage's official store artwork, sizing and hover/focus treatment. */
export function ServiceDownloadBadges({ pageKey, placement, centered = false }: {
  pageKey: string;
  placement: "hero" | "final";
  centered?: boolean;
}) {
  const { language } = useLanguage();
  return (
    <div dir="rtl" className={`flex w-full items-center justify-center gap-4 ${centered ? "" : "lg:justify-start"}`}>
      {stores.map(({ store, url, image, width, height }) => {
        const label = store === "ios"
          ? language === "ar" ? "حمّل تطبيق نظامي من App Store" : "Download Nizamy on the App Store"
          : language === "ar" ? "حمّل تطبيق نظامي من Google Play" : "Get Nizamy on Google Play";
        return (
          <a key={store} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
            data-testid={`link-${pageKey}-${placement}-${store}`}
            onClick={() => {
              track(`store_click_${store}`, { language });
              track("service_page_cta_click", { service_page: pageKey, cta: `${placement}_${store}`, language, destination: url });
            }}
            className="flex h-14 min-w-0 items-center justify-center rounded-xl border-0 bg-transparent p-0 shadow-none transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            <img src={`${import.meta.env.BASE_URL}store-badges/${image}`} alt={label} width={width} height={height}
              className={`block w-auto max-w-full object-contain ${store === "ios" ? "h-[48px]" : "h-[72px]"}`} />
          </a>
        );
      })}
    </div>
  );
}
