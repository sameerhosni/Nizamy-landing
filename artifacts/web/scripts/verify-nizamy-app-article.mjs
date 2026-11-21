import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = p => readFile(path.join(root, p), "utf8");
const data = JSON.parse(await read("src/pages/nizamyAppArticleContent.json"));
const config = JSON.parse(await read("seo.config.json"));
const page = config.pages.nizamyAppArticle;
const html = await read("dist/public/seo/nizamyAppArticle.html");
const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";
const graph = JSON.parse(html.match(/id="nizamy-structured-data">([\s\S]*?)<\/script>/)[1])["@graph"];
const article = graph.find(node => node["@type"] === "BlogPosting");

assert.equal(page.path, "/blog/hr-app-nizamy");
assert(page.ar.title.includes("تطبيق الموارد البشرية"), "Keyword in title tag");
assert(page.ar.description.includes("تطبيق الموارد البشرية"), "Keyword in description");
assert(html.includes(`<title>${page.ar.title}</title>`));
assert(html.includes(`content="${page.ar.description}"`));
assert(html.includes(`href="${config.site.url}${page.path}"`), "Canonical");
assert(html.includes('content="index, follow"'));
assert(html.includes('property="og:type" content="article"'));
assert.equal((fallback.match(/<h1\b/g) ?? []).length, 1);
assert(fallback.includes(`<h1>${data.ar.title}</h1>`));
assert(fallback.includes(`alt="${data.ar.heroAlt}"`));
assert.equal(article.headline, data.ar.title);
assert.equal(article.url, config.site.url + page.path);
assert(article.image.endsWith("/images/attendance-app-screen.webp"));
assert.equal((html.match(/id="nizamy-structured-data"/g) ?? []).length, 1);
for (const language of ["ar", "en"]) {
  const copy = data[language];
  assert.equal(copy.sections.length, 12, `${language}: all document sections`);
  assert(copy.intro.join(" ").length > 100);
  const body = copy.intro.concat(copy.sections.flatMap(s => s.paragraphs)).join(" ");
  assert(body.split(/\s+/).length >= 1100, `${language}: full source, not a summary`);
  assert(copy.heroAlt.length > 40, `${language}: meaningful image alt`);
}
assert((await read("src/pages/Blog.tsx")).includes('href="/blog/hr-app-nizamy"'));
assert((await read("public/sitemap.xml")).includes(`${config.site.url}${page.path}</loc>`));
assert((await read("public/llms.txt")).includes(config.site.url + page.path));
assert((await read("dist/public/seo/blog.html")).includes('href="/blog/hr-app-nizamy"'));
assert((await read("dist/public/seo/sitemap.html")).includes('href="/blog/hr-app-nizamy"'));
assert((await read("dist/public/seo/blogArticle.html")).includes("saudi-hr-editorial.webp"), "Original article preserved");
await access(path.join(root, "public/images/attendance-app-screen.webp"));
console.log("New bilingual HR app article: complete source, keyword metadata, alt text, schema, canonical, blog listing and crawler discovery passed.");
