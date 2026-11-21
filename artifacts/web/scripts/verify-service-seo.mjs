// Run after building: node artifacts/web/scripts/verify-service-seo.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const config = JSON.parse(await readFile(new URL("seo.config.json", root), "utf8"));
const content = JSON.parse(await readFile(new URL("src/pages/serviceLandingContent.json", root), "utf8"));
const xml = await readFile(new URL("dist/public/sitemap.xml", root), "utf8");
const llms = await readFile(new URL("dist/public/llms.txt", root), "utf8");
const escape = (text) => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

for (const key of ["aiHrService", "employeeRewardsService"]) {
  const page = config.pages[key];
  const copy = content[key].ar;
  const html = await readFile(new URL(`dist/public/seo/${key}.html`, root), "utf8");
  const canonical = `${config.site.url}${page.path}`;
  assert.ok(html.includes(`<title>${escape(page.ar.title)}</title>`));
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
  assert.ok(html.includes(`property="og:url" content="${canonical}"`));
  assert.ok(html.includes('name="robots" content="index, follow'));
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) ?? []).length, 1);
  const noscript = html.match(/<noscript><main class="seo-prerender">([\s\S]*?)<\/main><\/noscript>/)?.[1] ?? "";
  assert.ok(noscript.length > 3000, `${key}: substantial no-JS content`);
  for (const section of copy.sections) {
    assert.ok(noscript.includes(escape(section.heading)), `${key}: section ${section.id}`);
    for (const paragraph of section.paragraphs ?? []) assert.ok(noscript.includes(escape(paragraph)));
    for (const item of section.items ?? []) assert.ok(noscript.includes(escape(item.text)));
  }
  assert.ok(noscript.includes(escape(copy.disclaimer)));
  const schema = JSON.parse(html.match(/id="nizamy-structured-data">([\s\S]*?)<\/script>/)?.[1] ?? "{}");
  const graph = schema["@graph"];
  assert.ok(graph.some((entry) => entry["@type"] === "Service"));
  assert.ok(graph.some((entry) => entry["@type"] === "BreadcrumbList"));
  const faq = graph.find((entry) => entry["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, copy.faqs.length);
  for (const question of copy.faqs) {
    assert.ok(noscript.includes(escape(question.q)));
    assert.ok(noscript.includes(escape(question.a)));
    assert.ok(faq.mainEntity.some((item) => item.name === question.q && item.acceptedAnswer.text === question.a));
  }
  assert.ok(xml.includes(canonical));
  assert.ok(llms.includes(canonical));
  assert.equal((html.match(/id="hs-script-loader"/g) ?? []).length, 1);
}
console.log("Both service pages: static content, metadata, one H1, matching FAQ/Service schemas, sitemap, AI discovery links and HubSpot passed.");
