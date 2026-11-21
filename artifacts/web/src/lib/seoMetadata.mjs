// Shared by React and prerendering. No browser APIs or page-specific fallbacks.
export function resolveSeoMetadata(config, pageKey, language = "ar") {
  const page = config.pages[pageKey];
  if (!page || !["ar", "en"].includes(language)) throw new Error(`Unknown SEO page/language: ${pageKey}/${language}`);
  language = page.language ?? language;
  if (!["ar", "en"].includes(language)) throw new Error(`${pageKey}: unsupported fixed locale`);
  const copy = page[language];
  for (const field of ["title", "description", "heading"]) {
    if (typeof copy?.[field] !== "string" || !copy[field].trim()) throw new Error(`${pageKey}/${language}: missing ${field}`);
  }
  const path = page.path;
  if (!page.robots?.trim()) throw new Error(`${pageKey}: missing indexing policy`);
  if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(path)) {
    throw new Error(`${pageKey}: URL must be stable, lowercase and query-free`);
  }
  const templateKey = page.metadataTemplate ?? (["BlogPosting", "Article"].includes(page.type) ? "article" : "website");
  const template = config.metadataTemplates[templateKey];
  if (!template) throw new Error(`${pageKey}: unknown metadata template ${templateKey}`);
  const canonical = pageKey === "notFound" ? null : new URL((page.urlPrefix ?? "") + path, config.site.url).href;
  const image = new URL(page.social?.image ?? config.site.image, config.site.url).href;
  const imageAlt = page.social?.imageAlt?.[language] ?? config.site.imageAlt[language];
  if (!imageAlt?.trim()) throw new Error(`${pageKey}/${language}: missing social image alt`);
  return {
    pageKey, language, template: templateKey, path, canonical,
    title: copy.title, description: copy.description, h1: copy.heading, robots: page.robots,
    alternates: Object.entries(page.languageAlternates ?? {}).map(([language, path]) => ({ language, url: new URL((page.urlPrefix ?? "") + path, config.site.url).href })),
    openGraph: {
      title: copy.title, description: copy.description, type: template.ogType,
      url: canonical, image, imageAlt, siteName: config.site.name,
      locale: language === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: template.twitterCard, title: copy.title, description: copy.description,
      image, imageAlt,
    },
  };
}

/** Absolute URL of a configured page, honouring its optional urlPrefix (e.g. "/ai-position"). */
export function pageUrl(config, key) {
  const page = config.pages[key];
  return new URL((page.urlPrefix ?? "") + page.path, config.site.url).href;
}

export function seoMetaTags(meta) {
  return [
    ["name", "description", meta.description],
    ...["robots", "googlebot", "bingbot"].map(key => ["name", key, meta.robots]),
    ...Object.entries({
      "og:title": meta.openGraph.title, "og:description": meta.openGraph.description,
      "og:type": meta.openGraph.type, "og:image": meta.openGraph.image,
      "og:image:alt": meta.openGraph.imageAlt, "og:site_name": meta.openGraph.siteName,
      "og:locale": meta.openGraph.locale,
    }).map(([key, value]) => ["property", key, value]),
    ...Object.entries({
      "twitter:card": meta.twitter.card, "twitter:title": meta.twitter.title,
      "twitter:description": meta.twitter.description, "twitter:image": meta.twitter.image,
      "twitter:image:alt": meta.twitter.imageAlt,
    }).map(([key, value]) => ["name", key, value]),
    ...(meta.canonical ? [["property", "og:url", meta.canonical]] : []),
  ];
}
