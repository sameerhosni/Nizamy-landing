import assert from "node:assert/strict";
import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { resolveSeoMetadata, seoMetaTags } from "../src/lib/seoMetadata.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = file => readFile(path.join(root, file), "utf8");
const config = JSON.parse(await read("seo.config.json"));
const decode = text => text.replaceAll("&quot;", '"').replaceAll("&#039;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
const normalized = text => decode(text).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const seen = new Map();
const matrix = [];
for (const [key, page] of Object.entries(config.pages)) {
  if (key === "notFound") continue;
  const html = await read(key === "home" ? "dist/public/index.html" : `dist/public/seo/${key}.html`);
  for (const lang of page.language ? [page.language] : ["ar", "en"]) {
    const meta = resolveSeoMetadata(config, key, lang);
    for (const field of ["title", "description", "h1"]) {
      const uniqueKey = `${meta.language}:${field}:${normalized(meta[field]).toLowerCase()}`;
      assert(!seen.has(uniqueKey), `${key}: duplicate ${field} from ${seen.get(uniqueKey)}`);
      seen.set(uniqueKey, key);
    }
    assert.equal(meta.openGraph.url, meta.canonical);
    assert.equal(meta.twitter.title, meta.title);
    assert.equal(meta.twitter.description, meta.description);
    const imageUrl = new URL(meta.openGraph.image);
    assert.equal(imageUrl.origin, new URL(config.site.url).origin);
    await access(path.join(root, "public", decodeURIComponent(imageUrl.pathname)));
    matrix.push(meta);
    if (lang !== (page.language ?? "ar")) continue;
    assert.equal(decode(html.match(/<title>([\s\S]*?)<\/title>/)[1]), meta.title);
    assert(html.includes(`href="${meta.canonical}"`), `${key}: canonical missing`);
    for (const [attribute, name, value] of seoMetaTags(meta)) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const tags = [...html.matchAll(new RegExp(`<meta\\s+${attribute}="${escaped}"\\s+content="([^"]*)"\\s*\\/?>`, "g"))];
      assert.equal(tags.length, 1, `${key}: exactly one ${name}`);
      assert.equal(decode(tags[0][1]), value, `${key}: ${name} differs from shared template`);
    }
    const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";
    const headings = [...fallback.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `${key}: one H1`);
    assert.equal(normalized(headings[0][1]), normalized(meta.h1), `${key}: H1 differs from template`);
    assert(!/\b(?:draft|drafts)\b|مسودة/i.test(fallback), `${key}: visible draft labels`);
    for (const alternate of meta.alternates) assert(html.includes(`hreflang="${alternate.language}" href="${alternate.url}"`));
  }
}
const faq = JSON.parse(await read("src/pages/informationPagesContent.json")).faq;
for (const [key, language] of [["faq", "ar"], ["faqEnglish", "en"]]) {
  for (const entry of faq[language].faqs) {
    assert(entry.q.length >= 8 && entry.a.length >= 24, `${language}/${entry.id}: complete question and answer, not placeholders`);
    const letters = language === "ar" ? /[\u0600-\u06ff]/ : /[A-Za-z]{3}/;
    assert(letters.test(entry.q) && letters.test(entry.a), `${language}/${entry.id}: correct language`);
  }
  const html = await read(`dist/public/seo/${key}.html`);
  assert(html.includes(`<html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}">`));
  const graph = JSON.parse(html.match(/id="nizamy-structured-data">([\s\S]*?)<\/script>/)[1])["@graph"];
  const questions = graph.find(node => node["@type"] === "FAQPage").mainEntity;
  assert.deepEqual(questions.map(q => q.name), faq[language].faqs.map(q => q.q));
  assert.equal(questions.length, 51);
}
assert(!(await read("src/pages/BlogArticle.tsx")).includes('id="article-sources-heading"'));
await writeFile(path.join(root, "dist/seo-metadata-audit.json"), JSON.stringify(matrix, null, 2) + "\n");
console.log(`Metadata/social templates verified for ${Object.keys(config.pages).length - 1} priority URLs and ${matrix.length} language variants; fixed-language FAQ schema and label/reference-panel removal passed.`);
