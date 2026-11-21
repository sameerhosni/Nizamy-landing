// Crawlable (no-JS) HTML for the HR blog hub and its articles, in the page's own language.
const labels = {
  ar: { faq: "أسئلة شائعة", sources: "المصادر", related: "مقالات ذات صلة", quick: "الخلاصة", cta: "جرّب نظامي مجانًا", home: "الرئيسية", blog: "سالفة اتش آر", sitemap: "خريطة الموقع", nav: "روابط الموقع" },
  en: { faq: "FAQ", sources: "Sources", related: "Related articles", quick: "Quick answer", cta: "Try Nizamy free", home: "Home", blog: "HR blog", sitemap: "Sitemap", nav: "Site links" },
};

export function blogStatic({ config, blogDetails, pageKey, copy, escape }) {
  const page = config.pages[pageKey];
  if (!page || !(pageKey === "hrBlog" || pageKey === "hrBlogEn" || page.parent?.startsWith("hrBlog"))) return null;
  const lang = page.language ?? "ar";
  const t = labels[lang];
  const e = escape;
  const prefix = page.urlPrefix ?? "";
  const hubKey = lang === "en" ? "hrBlogEn" : "hrBlog";
  const hubPath = prefix + config.pages[hubKey].path;
  const nav = `<nav aria-label="${e(t.nav)}"><a href="/">${e(t.home)}</a> <a href="${e(hubPath)}">${e(t.blog)}</a> <a href="/sitemap">${e(t.sitemap)}</a></nav>`;

  if (pageKey === "hrBlog" || pageKey === "hrBlogEn") {
    const items = page.hubItems.map((item) => `<li><a href="${e(prefix + item.path)}">${e(item[lang].title)}</a>: ${e(item[lang].summary)}</li>`).join("");
    return `<main class="seo-prerender"><p>${e(copy.heading)}</p><h1>${e(copy.heading)}</h1><p>${e(copy.summary)}</p><ul>${items}</ul>${nav}</main>`;
  }

  const slug = page.path.split("/").pop();
  const details = blogDetails[slug]?.[lang];
  if (!details) return null;
  const sections = details.sections.map((x, i) => `<section id="sec-${i}"><h2>${e(x.h)}</h2><p>${e(x.p)}</p></section>`).join("");
  const faqs = details.faqs.map((f) => `<div><h3>${e(f.q)}</h3><p>${e(f.a)}</p></div>`).join("");
  const sources = (details.sources ?? []).length
    ? `<section><h2>${e(t.sources)}</h2><ul>${details.sources.map((x) => `<li><a href="${e(x.url)}">${e(x.label)}</a></li>`).join("")}</ul></section>`
    : "";
  const tldr = details.tldr ? `<p><strong>${e(t.quick)}:</strong> ${e(details.tldr)}</p>` : "";
  const headingOf = (s) => {
    const p = Object.values(config.pages).find((x) => x.language === lang && x.path === (lang === "en" ? "/en" : "") + "/hr-blog/" + s);
    return p ? p[lang].heading : null;
  };
  const related = (details.related ?? []).map((s) => (headingOf(s) ? `<li><a href="${e(prefix + (lang === "en" ? "/en" : "") + "/hr-blog/" + s)}">${e(headingOf(s))}</a></li>` : "")).join("");
  const relatedHtml = related ? `<section><h2>${e(t.related)}</h2><ul>${related}</ul></section>` : "";
  return `<main class="seo-prerender"><article><p>${e(config.pages[hubKey][lang].heading)}</p><h1>${e(copy.heading)}</h1><p>${e(copy.summary)}</p>${tldr}${sections}<section><h2>${e(t.faq)}</h2>${faqs}</section>${sources}${relatedHtml}<p><a href="${e(prefix)}/#partner">${e(t.cta)}</a></p></article>${nav}</main>`;
}
