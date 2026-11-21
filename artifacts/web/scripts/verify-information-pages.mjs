import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => readFile(path.join(root, p), "utf8");
const content = JSON.parse(await read("src/pages/informationPagesContent.json"));
const config = JSON.parse(await read("seo.config.json"));
const sitemap = await read("public/sitemap.xml");
const navbar = await read("src/components/layout/Navbar.tsx");
const footer = await read("src/components/layout/Footer.tsx");
const contentText = value => typeof value === "string" ? value
  : value && typeof value === "object" ? Object.values(value).map(contentText).join("\n") : "";
assert(!/href: "\/faq(?:\/(?:ar|en))?"/.test(navbar), "FAQ must not enter main navigation");
assert(!navbar.includes('href: "/privacy-policy"'), "Privacy must remain footer-only");
assert(footer.includes('href: "/privacy-policy"'), "Privacy needs a footer link");
const siteMapHtml = await read("dist/public/seo/sitemap.html");
assert(siteMapHtml.includes('href="/help"'), "No-JS sitemap includes public help");
assert(siteMapHtml.includes('href="/small-business-hr-software-saudi-arabia"'), "No-JS sitemap includes HR page");
const sitemapMain = siteMapHtml.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
assert(!sitemapMain.includes('href="/privacy-policy"'), "Privacy absent from sitemap main navigation");

for (const [key, page] of Object.entries(content)) {
  const html = await read(`dist/public/seo/${key}.html`);
  const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";
  assert.equal((fallback.match(/<h1\b/g) ?? []).length, 1, `${key}: one H1`);
  assert(fallback.length > 1800, `${key}: substantial no-JS copy`);
  assert.equal(page.path, config.pages[key].path, `${key}: consistent route`);
  assert(html.includes(`href="${config.site.url}${page.path}"`), `${key}: canonical`);
  assert(html.includes(`content="${page.draft ? "noindex, nofollow" : "index, follow"}"`), `${key}: robots`);
  assert.equal(sitemap.includes(`${config.site.url}${page.path}<`), !page.draft, `${key}: indexable sitemap only`);
  for (const language of ["ar", "en"]) {
    if (key !== "faq") assert(page[language].sections.length >= 3, `${key}/${language}: document sections`);
    assert(!/\[[^\]]+\]/.test(contentText(page[language])), `${key}/${language}: no unresolved placeholders`);
  }
  assert(!/بعض التفاصيل تحتاج إلى تأكيد|هذه معلومات مرجعية وليست عرضاً سارياً|Some details need confirmation|This is reference information, not a live offer/.test(fallback), `${key}: removed notice absent`);
}
const faqHtml = await read("dist/public/seo/faq.html");
assert(!faqHtml.includes("الأسئلة الشائعة بالإنجليزية"), "No separate English FAQ entry on Arabic page");
assert.equal((faqHtml.match(/href="\/faq\/ar"/g) || []).length, 1, "Single Arabic FAQ footer entry");
const faqEnglishHtml = await read("dist/public/seo/faqEnglish.html");
assert.equal((faqEnglishHtml.match(/href="\/faq\/en"/g) || []).length, 1, "Single translated FAQ footer entry");
assert(!faqEnglishHtml.includes('href="/faq/ar"'), "English footer uses only the English translation");
const graph = JSON.parse(faqHtml.match(/id="nizamy-structured-data">([\s\S]*?)<\/script>/)[1])["@graph"];
const schema = graph.find(node => node["@type"] === "FAQPage");
assert.equal(schema.mainEntity.length, content.faq.ar.faqs.length);
assert(schema.mainEntity.length >= 25, "Complete document-based FAQ collection");
assert.equal(content.faq.en.faqs.length, content.faq.ar.faqs.length);
for (const [i, question] of content.faq.ar.faqs.entries()) {
  assert.equal(schema.mainEntity[i].name, question.q);
  assert.equal(schema.mainEntity[i].acceptedAnswer.text, question.a);
  assert.equal(content.faq.en.faqs[i].id, question.id);
}
console.log("Six separate pages: routes, bilingual substantive copy, draft safeguards, crawlable HTML, footer FAQ and schema passed.");
