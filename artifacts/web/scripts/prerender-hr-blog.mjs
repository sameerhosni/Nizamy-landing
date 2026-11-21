// Writes crawlable, language-aware HTML for the HR blog hub and its articles next to the built SPA
// (dist/public/hr-blog/index.html, dist/public/en/hr-blog/<slug>/index.html, ...). The home page is left untouched.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pageUrl, resolveSeoMetadata, seoMetaTags } from "../src/lib/seoMetadata.mjs";
import { blogStatic } from "./blog-static.mjs";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(webRoot, "dist/public");
const readJson = async (rel) => JSON.parse(await readFile(path.join(webRoot, rel), "utf8"));
const config = await readJson("seo.config.json");
const blogDetails = await readJson("src/pages/hrBlogDetails.json");
const social = await readJson("src/lib/social.json");

const socialHosts = {
  linkedin: /^https:\/\/([a-z]+\.)?linkedin\.com\/(company|showcase|school)\/[^\s]+$/i,
  instagram: /^https:\/\/(www\.)?instagram\.com\/[^\s]+$/i,
  youtube: /^https:\/\/(www\.)?youtube\.com\/(@|channel\/|c\/|user\/)[^\s]+$/i,
  facebook: /^https:\/\/(www\.)?facebook\.com\/[^\s]+$/i,
};
for (const [name, url] of Object.entries(social)) {
  if (url && !socialHosts[name]?.test(url)) throw new Error(`social.json: "${name}" is not a valid ${name} profile address: ${url}`);
}
const sameAs = Object.values(social).filter(Boolean);

const baseHtml = await readFile(path.join(outputRoot, "index.html"), "utf8");

const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const replaceTitle = (html, title) => html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
function replaceMeta(html, attribute, key, content) {
  const expression = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}
function replaceCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  const expression = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  return expression.test(html) ? html.replace(expression, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function structuredData(pageKey, page, copy, url) {
  const lang = page.language ?? "ar";
  const org = { "@id": `${config.site.url}/#organization` };
  const graph = [
    { "@type": "Organization", ...org, name: config.site.name, alternateName: config.site.nameArabic, url: config.site.url, logo: `${config.site.url}/favicon.png`, email: config.site.email, ...(sameAs.length ? { sameAs } : {}), areaServed: { "@type": "Country", name: "Saudi Arabia" }, knowsLanguage: ["ar", "en"] },
    { "@type": "WebSite", "@id": `${config.site.url}/#website`, url: config.site.url, name: config.site.name, alternateName: config.site.nameArabic, publisher: org, inLanguage: ["ar", "en"] },
    { "@type": page.type, "@id": `${url}#webpage`, url, name: copy.title, headline: copy.heading, description: copy.description, isPartOf: { "@id": `${config.site.url}/#website` }, about: org, inLanguage: lang },
  ];
  if (page.parent?.startsWith("hrBlog")) {
    const details = blogDetails[page.path.split("/").pop()]?.[lang];
    if (details) graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: details.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
    if (details?.updated) { graph[2].datePublished = details.updated; graph[2].dateModified = details.updated; }
    graph[2].image = `${config.site.url}/opengraph.jpg`;
    graph[2].author = org;
    graph[2].publisher = org;
  }
  if (pageKey === "hrBlog" || pageKey === "hrBlogEn") {
    graph.push({ "@type": "ItemList", "@id": `${url}#articles`, itemListElement: page.hubItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item[lang].title, url: pageUrl(config, item.key) })) });
  }
  graph.push({
    "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "الرئيسية", item: `${config.site.url}/` },
      ...(page.parent ? [{ "@type": "ListItem", position: 2, name: config.pages[page.parent][lang].heading, item: pageUrl(config, page.parent) }] : []),
      { "@type": "ListItem", position: page.parent ? 3 : 2, name: copy.heading, item: url },
    ],
  });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

function renderPage(pageKey) {
  const page = config.pages[pageKey];
  const language = page.language ?? "ar";
  const copy = page[language];
  const meta = resolveSeoMetadata(config, pageKey, language);
  const url = meta.canonical;
  let html = baseHtml
    .replace(/<html\s+lang="[^"]*"(?:\s+dir="[^"]*")?>/i, `<html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}">`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${blogStatic({ config, blogDetails, pageKey, copy, escape: escapeHtml })}</noscript>`);
  html = replaceTitle(html, meta.title);
  for (const [attribute, key, value] of seoMetaTags(meta)) html = replaceMeta(html, attribute, key, value);
  for (const alternate of meta.alternates) {
    html = html.replace("</head>", `<link rel="alternate" hreflang="${escapeHtml(alternate.language)}" href="${escapeHtml(alternate.url)}" data-nizamy-alternate="" />\n</head>`);
  }
  html = replaceCanonical(html, url);
  return html.replace("</head>", `    <script type="application/ld+json" id="nizamy-structured-data">${structuredData(pageKey, page, copy, url)}</script>\n  </head>`);
}

const keys = Object.keys(config.pages).filter((k) => k.startsWith("hrBlog"));
for (const key of keys) {
  const dir = path.join(outputRoot, config.pages[key].path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), renderPage(key));
}
console.log(`prerendered ${keys.length} HR blog pages`);
