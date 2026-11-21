import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pageUrl, resolveSeoMetadata, seoMetaTags } from "../src/lib/seoMetadata.mjs";
import { blogStatic } from "./blog-static.mjs";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(webRoot, "dist/public");
const seoOutputRoot = path.join(outputRoot, "seo");
const config = JSON.parse(await readFile(path.join(webRoot, "seo.config.json"), "utf8"));
const blogArticle = JSON.parse(await readFile(path.join(webRoot, "src/pages/blogArticleContent.json"), "utf8"));
const nizamyAppArticle = JSON.parse(await readFile(path.join(webRoot, "src/pages/nizamyAppArticleContent.json"), "utf8"));
const serviceContent = JSON.parse(await readFile(path.join(webRoot, "src/pages/serviceLandingContent.json"), "utf8"));
const informationContent = JSON.parse(await readFile(path.join(webRoot, "src/pages/informationPagesContent.json"), "utf8"));
const payrollContent = JSON.parse(await readFile(path.join(webRoot, "src/pages/payrollPageContent.json"), "utf8"));
const blogDetails = JSON.parse(await readFile(path.join(webRoot, "src/pages/hrBlogDetails.json"), "utf8"));
const social = JSON.parse(await readFile(path.join(webRoot, "src/lib/social.json"), "utf8"));
// Each profile must be an https address on its own platform, so a typo or wrong platform fails the build.
const socialHosts = { linkedin: /^https:\/\/([a-z]+\.)?linkedin\.com\/(company|showcase|school)\/[^\s]+$/i, instagram: /^https:\/\/(www\.)?instagram\.com\/[^\s]+$/i, youtube: /^https:\/\/(www\.)?youtube\.com\/(@|channel\/|c\/|user\/)[^\s]+$/i, facebook: /^https:\/\/(www\.)?facebook\.com\/[^\s]+$/i };
for (const [name, url] of Object.entries(social)) {
  if (url && !(socialHosts[name]?.test(url))) throw new Error(`social.json: "${name}" is not a valid ${name} profile address: ${url}`);
}
const sameAs = Object.values(social).filter(Boolean);
const homepageContent = JSON.parse(await readFile(path.join(webRoot, "src/lib/data/homepageContent.json"), "utf8"));
// The generator also writes index.html: remove only our generated blocks so
// rerunning it cannot inherit the homepage schema or duplicate no-JS content.
const baseHtml = (await readFile(path.join(outputRoot, "index.html"), "utf8"))
  .replace(/<script\b[^>]*id="nizamy-structured-data"[^>]*>[\s\S]*?<\/script>/g, "")
  .replace(/<noscript>([\s\S]*?)<\/noscript>/g, (tag, content) =>
    content.includes('class="seo-prerender"') ? "" : tag);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

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
  const graph = [
    {
      "@type": "Organization",
      "@id": `${config.site.url}/#organization`,
      name: config.site.name,
      alternateName: config.site.nameArabic,
      url: config.site.url,
      logo: `${config.site.url}/favicon.png`,
      email: config.site.email,
      ...(sameAs.length ? { sameAs } : {}),
      areaServed: { "@type": "Country", name: "Saudi Arabia" },
      knowsLanguage: ["ar", "en"]
    },
    {
      "@type": "WebSite",
      "@id": `${config.site.url}/#website`,
      url: config.site.url,
      name: config.site.name,
      alternateName: config.site.nameArabic,
      publisher: { "@id": `${config.site.url}/#organization` },
      inLanguage: ["ar", "en"]
    },
    {
      "@type": page.type,
      "@id": `${url}#webpage`,
      url,
      name: copy.title,
      headline: copy.heading,
      description: copy.description,
      isPartOf: { "@id": `${config.site.url}/#website` },
      about: { "@id": `${config.site.url}/#organization` },
      inLanguage: page.language ?? "ar"
    }
  ];
  if (pageKey === "home") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: homepageContent.faq.map(({ question, answer }) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }
  if (pageKey === "blogArticle" || pageKey === "nizamyAppArticle") {
    graph[2].image = `${config.site.url}/images/${pageKey === "blogArticle" ? "saudi-hr-editorial.webp" : "attendance-app-screen.webp"}`;
    graph[2].author = { "@id": `${config.site.url}/#organization` };
    graph[2].publisher = { "@id": `${config.site.url}/#organization` };
  }
  if (pageKey === "attendanceService") {
    graph[2].image = `${config.site.url}/images/face-id-checkin.png`;
  }
  if (serviceContent[pageKey]) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: copy.heading,
      description: copy.description,
      url,
      serviceType: copy.heading,
      provider: { "@id": `${config.site.url}/#organization` },
      areaServed: { "@type": "Country", name: "Saudi Arabia" }
    });
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: serviceContent[pageKey].ar.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    });
  }
  if (pageKey === "payrollInputsService") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: payrollContent[page.language ?? "ar"].faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    });
  }
  if (page.parent?.startsWith("hrBlog")) {
    const details = blogDetails[page.path.split("/").pop()]?.[page.language ?? "ar"];
    if (details) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: details.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
      });
    }
    if (details?.updated) { graph[2].datePublished = details.updated; graph[2].dateModified = details.updated; }
    graph[2].image = `${config.site.url}/opengraph.jpg`;
    graph[2].author = { "@id": `${config.site.url}/#organization` };
    graph[2].publisher = { "@id": `${config.site.url}/#organization` };
  }
  if (pageKey === "hrBlog" || pageKey === "hrBlogEn") {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#articles`,
      itemListElement: page.hubItems.map((item, index) => ({
        "@type": "ListItem", position: index + 1,
        name: item[page.language ?? "ar"].title,
        url: pageUrl(config, item.key)
      }))
    });
  }
  if (pageKey !== "home" && pageKey !== "notFound") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: page.language === "en" ? "Home" : "الرئيسية", item: `${config.site.url}/` },
        ...(page.parent ? [{ "@type": "ListItem", position: 2, name: config.pages[page.parent][page.language ?? "ar"].heading, item: pageUrl(config, page.parent) }] : []),
        { "@type": "ListItem", position: page.parent ? 3 : 2, name: copy.heading, item: url }
      ]
    });
  }
  if (pageKey === "faq" || pageKey === "faqEnglish") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: informationContent.faq[pageKey === "faqEnglish" ? "en" : "ar"].faqs.map(f => ({
        "@type": "Question", name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
}

function serviceStatic(pageKey) {
  const c = serviceContent[pageKey];
  const t = c.ar;
  const e = escapeHtml;
  const blocks = t.sections.map((s) => `<section><h2>${e(s.heading)}</h2>${(s.paragraphs ?? []).map((x) => `<p>${e(x)}</p>`).join("")}${s.items ? (s.kind === "steps" ? "<ol>" : "<ul>") + s.items.map((i) => `<li><strong>${e(i.title)}</strong>: ${e(i.text)}</li>`).join("") + (s.kind === "steps" ? "</ol>" : "</ul>") : ""}${s.plans ? `<p>${e(s.plans)}</p>` : ""}</section>`).join("");
  const faqs = t.faqs.map((f) => `<div><h3>${e(f.q)}</h3><p>${e(f.a)}</p></div>`).join("");
  return `<main class="seo-prerender"><img src="${c.image}" alt="${e(t.imageAlt)}" /><p>${e(t.eyebrow)}</p><h1>${e(t.title)}</h1><p>${e(t.intro)}</p><p>${e(t.primary)}</p><p><a href="https://apps.apple.com/sa/app/id6792693395">تنزيل لنظام iOS من App Store</a> <a href="https://play.google.com/store/apps/details?id=com.t2.nizamy">تنزيل لنظام Android من Google Play</a> <a href="/#contact-us">${e(t.secondary)}</a></p>${t.body.map((x) => `<p>${e(x)}</p>`).join("")}${blocks}<section><h2>${e(t.faqTitle)}</h2>${faqs}</section><section><h2>${e(t.closing.title)}</h2><p><a href="/#contact-us">${e(t.closing.secondary)}</a></p></section><p>${e(t.storeNote)}</p><p>${e(t.disclaimer)}</p><nav aria-label="روابط الموقع"><a href="/">الرئيسية</a> <a href="/services/attendance-performance">خدمة الحضور والانصراف</a> <a href="/services/ai-hr">الذكاء الاصطناعي في الموارد البشرية</a> <a href="/services/employee-rewards">مكافآت الموظفين</a> <a href="/services/ai-hr">الذكاء الاصطناعي في الموارد البشرية</a> <a href="/services/employee-rewards">مكافآت الموظفين</a> <a href="/sitemap">خريطة الموقع</a></nav></main>`;
}

function staticContent(copy, pageKey) {
  if (pageKey === "payrollInputsService") {
    const p = payrollContent.ar;
    const e = escapeHtml;
    const sections = p.sections.map((x) => `<section><h2>${e(x.h)}</h2><p>${e(x.p)}</p></section>`).join("");
    const faqs = p.faqs.map((f) => `<div><h3>${e(f.q)}</h3><p>${e(f.a)}</p></div>`).join("");
    return `<main class="seo-prerender"><p>${e(p.kicker)}</p><h1>${e(copy.heading)}</h1><p>${e(copy.summary)}</p><ul>${p.points.map((x) => `<li>${e(x)}</li>`).join("")}</ul>${sections}<section><h2>${e(p.faqTitle)}</h2>${faqs}</section><p><a href="/#partner">جرّب نظامي مجانًا</a></p><nav aria-label="روابط الموقع"><a href="/">الرئيسية</a> <a href="/hr-blog">سالفة اتش آر</a> <a href="/sitemap">خريطة الموقع</a></nav></main>`;
  }
  const blogHtml = blogStatic({ config, blogDetails, pageKey, copy, escape: escapeHtml });
  if (blogHtml) return blogHtml;
  if (pageKey === "home") {
    const faqs = homepageContent.faq.map(({ question, answer }) =>
      `<div><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></div>`).join("");
    return `<main class="seo-prerender"><h1>${escapeHtml(copy.heading)}</h1><p>${escapeHtml(copy.summary)}</p><p>${copy.sections.map(escapeHtml).join(" · ")}</p><section id="faq"><h2>أسئلة تتكرر</h2>${faqs}</section><nav><a href="/services/attendance-performance">بصمة من الجوال</a> <a href="/services/ai-hr">مساعدك الذكي</a> <a href="/services/employee-rewards">الالتزام صار له قيمة</a></nav></main>`;
  }
  if (informationContent[pageKey] || pageKey === "faqEnglish") {
    const page = informationContent[pageKey === "faqEnglish" ? "faq" : pageKey];
    const english = pageKey === "faqEnglish";
    const t = page[english ? "en" : "ar"];
    const e = escapeHtml;
    const sections = t.sections.map(s => `<section id="${e(s.id)}"><h2>${e(s.title)}</h2>${(s.paragraphs ?? []).map(p => `<p>${e(p)}</p>`).join("")}${s.items ? `<ul>${s.items.map(i => `<li><strong>${e(i.title)}</strong>: ${e(i.text)}</li>`).join("")}</ul>` : ""}</section>`).join("");
    const faqs = (pageKey === "faq" || pageKey === "faqEnglish") ? (t.faqs ?? []).map(f => `<details><summary>${e(f.q)}</summary><p>${e(f.a)}</p></details>`).join("") : "";
    const resources = Object.entries(informationContent).map(([key, p]) => `<a href="${e(key === "faq" ? (english ? "/faq/en" : "/faq/ar") : p.path)}">${e(key === "faq" ? (english ? "FAQs" : "الأسئلة الشائعة") : p[english ? "en" : "ar"].eyebrow)}</a>`).join(" ");
    return `<main class="seo-prerender"><p>${e(t.eyebrow)}</p><h1>${e(t.title)}</h1><p>${e(t.intro)}</p>${sections}${faqs}<p><a href="/#contact-us">${english ? "Contact Nizamy" : "تواصل مع نظامي"}</a></p></main><footer aria-label="${english ? "Website links" : "روابط الموقع"}"><a href="/">${english ? "Home" : "الرئيسية"}</a> ${resources} <a href="/sitemap">${english ? "Sitemap" : "خريطة الموقع"}</a></footer>`;
  }
  if (serviceContent[pageKey]) return serviceStatic(pageKey);
  if (pageKey === "attendanceService") {
    const li = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `<main class="seo-prerender"><p>خدمة الحضور والانصراف</p><h1>${escapeHtml(copy.heading)}</h1><p>${escapeHtml(copy.summary)}</p><p><a href="/#partner">جرّب مجانًا</a></p><h2>ليش أجهزة البصمة صارت من الماضي؟</h2><ul>${li(["تشتريها، تركّبها، تصلحها… ولكل فرع جهاز.", "الموظف الميداني ما يقدر يبصم أصلًا.", "البيانات تطلع ملف إكسل آخر الشهر، يعني تعرف المشكلة بعد ما خلصت."])}</ul><h2>نظامي يشتغل كذا</h2><ul>${li(["بصمة الوجه أو الإصبع من الجوال: الشخص اللي بصم هو نفسه الموظف", "التحقق من الموقع: الحضور يتسجل من الفرع، مو من البيت", "فروع وورديات متعددة: مطعم، صالون، عيادة، متجر — كلهم على شاشة وحدة", "تقارير لحظية: تشوف التأخير والغياب وهو يصير، مو بعدين"])}<li><a href="/services/employee-rewards">نقاط للملتزمين: الحضور بوقته يتحول لمكافأة</a></li></ul><h2>لمين هالخدمة؟</h2><ul>${li(["المطاعم والمقاهي — ورديات صباحية ومسائية بدون لخبطة.", "المحلات والفروع — تعرف مين فتح المحل بوقته.", "العيادات والصالونات — فريق صغير، لكن كل دقيقة تفرق.", "الفرق الميدانية — حضور من موقع العمل، مو من المكتب."])}</ul><h2>كل الأنظمة تعطيك سجل حضور. نظامي يغيّر الحضور نفسه.</h2><p>لأن الموظف اللي يعرف إن التزامه مشاهَد ومكافَأ، يجي بدري.</p><p><a href="/#partner">ابدأ مجانًا — أول يوم حضور بكرة</a></p><nav aria-label="روابط الموقع"><a href="/">الرئيسية</a> <a href="/blog">المدونة</a> <a href="/sitemap">خريطة الموقع</a></nav></main>`;
  }
  if (pageKey === "blogArticle" || pageKey === "nizamyAppArticle") {
    const article = (pageKey === "blogArticle" ? blogArticle : nizamyAppArticle).ar;
    const image = pageKey === "blogArticle" ? "saudi-hr-editorial.webp" : "attendance-app-screen.webp";
    const paragraph = (value) => `<p>${escapeHtml(value)}</p>`;
    const list = (items) => items?.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
    const sections = article.sections.map((section) => `
      <section><h2>${escapeHtml(section.heading)}</h2>
      ${(section.paragraphs ?? []).map(paragraph).join("")}
      ${list(section.list)}
      ${(section.closingParagraphs ?? []).map(paragraph).join("")}
      ${(section.subsections ?? []).map((sub) => `<div><h3>${escapeHtml(sub.heading)}</h3>${sub.paragraphs.map(paragraph).join("")}</div>`).join("")}
      ${(section.faqs ?? []).map((faq) => `<div><h3>${escapeHtml(faq.question)}</h3>${paragraph(faq.answer)}</div>`).join("")}
      ${section.cta ? '<p><a href="/">تعرف على نظامي وحمّل التطبيق</a></p>' : ""}
      </section>`).join("");
    return `<main class="seo-prerender"><article><img src="/images/${image}" alt="${escapeHtml(article.heroAlt)}" /><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.dek)}</p>${article.intro.map(paragraph).join("")}${sections}</article><nav aria-label="روابط الموقع"><a href="/blog">المدونة</a> <a href="/">الرئيسية</a></nav></main>`;
  }
  const sections = copy.sections
    .map((section) => `<li>${escapeHtml(section)}</li>`)
    .join("");
  const links = pageKey === "sitemap"
    ? '<nav aria-label="روابط الموقع"><a href="/">الرئيسية</a> <a href="/blog">المدونة</a> <a href="/blog/ai-hr-saudi-arabia">دليل الذكاء الاصطناعي في إدارة الموارد البشرية</a> <a href="/services/attendance-performance">خدمة الحضور والانصراف</a> <a href="/services/ai-hr">الذكاء الاصطناعي في الموارد البشرية</a> <a href="/services/employee-rewards">مكافآت الموظفين</a></nav>'
    : '<nav aria-label="روابط الموقع"><a href="/">الرئيسية</a> <a href="/blog">المدونة</a> <a href="/blog/ai-hr-saudi-arabia">دليل الذكاء الاصطناعي في إدارة الموارد البشرية</a> <a href="/services/attendance-performance">خدمة الحضور والانصراف</a> <a href="/services/ai-hr">الذكاء الاصطناعي في الموارد البشرية</a> <a href="/services/employee-rewards">مكافآت الموظفين</a> <a href="/sitemap">خريطة الموقع</a></nav>';
  const documentLinks = pageKey === "sitemap" ? `<nav aria-label="صفحات إضافية">${Object.entries(informationContent).filter(([key]) => key !== "faq" && key !== "privacyPolicy").map(([, p]) => `<a href="${escapeHtml(p.path)}">${escapeHtml(p.ar.eyebrow)}</a>`).join(" ")}</nav><footer><a href="/faq/ar">الأسئلة الشائعة</a> <a href="/privacy-policy">سياسة الخصوصية</a></footer>` : "";
  const newArticleLink = '<nav aria-label="مقال تطبيق الموارد البشرية"><a href="/blog/hr-app-nizamy">تطبيق الموارد البشرية نظامي لإدارة الموظفين والحضور والرواتب</a></nav>';
  return `<main class="seo-prerender"><h1>${escapeHtml(copy.heading)}</h1><p>${escapeHtml(copy.summary)}</p><ul>${sections}</ul>${links}${newArticleLink}</main>${documentLinks}`;
}

function renderPage(pageKey) {
  const page = config.pages[pageKey];
  const language = page.language ?? "ar";
  const copy = page[language];
  const meta = resolveSeoMetadata(config, pageKey, language);
  const url = meta.canonical ?? new URL(page.path, config.site.url).href;
  let html = baseHtml
    .replace(/<html\s+lang="[^"]*"(?:\s+dir="[^"]*")?>/i, `<html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}">`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${staticContent(copy, pageKey)}</noscript>`);

  html = replaceTitle(html, meta.title);
  for (const [attribute, key, value] of seoMetaTags(meta)) html = replaceMeta(html, attribute, key, value);
  html = html.replace(/\s*<link[^>]*data-nizamy-alternate[^>]*\/?>/g, "");
  for (const alternate of meta.alternates) {
    html = html.replace("</head>", `<link rel="alternate" hreflang="${escapeHtml(alternate.language)}" href="${escapeHtml(alternate.url)}" data-nizamy-alternate="" />\n</head>`);
  }
  if (pageKey === "notFound") {
    html = html
      .replace(/\s*<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, "")
      .replace(/\s*<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, "");
  } else {
    html = replaceCanonical(html, url);
    html = html.replace("</head>", `    <script type="application/ld+json" id="nizamy-structured-data">${structuredData(pageKey, page, copy, url)}</script>\n  </head>`);
  }
  return html;
}

await mkdir(seoOutputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "index.html"), renderPage("home"));
await Promise.all(
  ["reportsService", "payrollInputsService", "blog", "hrBlog", ...Object.keys(config.pages).filter((k) => k.startsWith("hrBlog") && k !== "hrBlog"), "blogArticle", "nizamyAppArticle", "faqEnglish", "attendanceService", "aiHrService", "employeeRewardsService", "sitemap", "notFound", ...Object.keys(informationContent)].map((pageKey) =>
    writeFile(path.join(seoOutputRoot, `${pageKey}.html`), renderPage(pageKey))
  )
);

console.log("Generated crawlable SEO HTML for /, /blog, its article, the attendance service, /sitemap, and 404 responses.");