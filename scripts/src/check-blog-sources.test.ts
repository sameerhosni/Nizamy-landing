import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { articlePath, checkArticles, checkSource, formatReport, type Articles } from "./check-blog-sources.js";

const contractUrl = "https://www.hrsd.gov.sa/en/ministry-services/services/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%B9%D9%82%D9%88%D8%AF";
const pdfUrl = "https://www.hrsd.gov.sa/sites/default/files/2024-03/G20%20stocktaking%20report%20on%20BI_OECD_Final.pdf";
const source = (id: string, url: string) => ({ id, url, label: id });
function response(url: string, status: number, body: string, type = "text/html"): Response {
  const result = new Response(body, { status, headers: { "content-type": type } });
  Object.defineProperty(result, "url", { value: url });
  return result;
}
function fetchReturning(result: Response): typeof fetch {
  return async () => result;
}

test("current bilingual sources all have citation-to-claim mappings and known destinations", async () => {
  const articles = JSON.parse(await readFile(articlePath, "utf8")) as Articles;
  const results = await checkArticles(articles, async (url) =>
    response(String(url), 403, "blocked"),
  );
  assert.equal(results.length, 6);
  assert.deepEqual(new Set(results.map(({ language }) => language)), new Set(["en", "ar"]));
  assert.equal(results.filter(({ source: item }) => item.id === "behavioralInsights").length, 2);
  assert.ok(results.every(({ references }) => references.length > 0));
  assert.ok(results.every(({ outcome }) => outcome === "unavailable"));
  const report = formatReport(results);
  assert.match(report, /Qiwa/);
  assert.match(report, /UNAVAILABLE/);
});

test("missing page fails but temporary access block and outage do not", async () => {
  const entry = source("contract", contractUrl);
  assert.equal((await checkSource("en", entry, fetchReturning(response(contractUrl, 404, "")))).outcome, "broken");
  assert.equal((await checkSource("en", entry, fetchReturning(response(contractUrl, 410, "")))).outcome, "broken");
  assert.equal((await checkSource("en", entry, fetchReturning(response(contractUrl, 503, "")))).outcome, "unavailable");
  assert.equal((await checkSource("en", entry, fetchReturning(response(contractUrl, 403, "")))).outcome, "unavailable");
  assert.equal((await checkSource("en", entry, async () => { throw new Error("timeout"); })).outcome, "unavailable");
});

test("redirects to homepage or unrelated official service fail", async () => {
  const entry = source("contract", contractUrl);
  for (const url of ["https://www.hrsd.gov.sa/en", "https://www.hrsd.gov.sa/en/knowledge-centre/other"]) {
    assert.equal((await checkSource("en", entry, fetchReturning(response(url, 200, "Contract Management")))).outcome, "broken");
  }
  assert.equal((await checkSource("en", source("contract", "https://www.hrsd.gov.sa/en"), fetchReturning(response(contractUrl, 200, "Contract Management")))).outcome, "broken");
});

test("successful pages need relevant content, PDFs need real PDF bytes", async () => {
  const contract = source("contract", contractUrl);
  const pdf = source("behavioralInsights", pdfUrl);
  assert.equal((await checkSource("en", contract, fetchReturning(response(contractUrl, 200, "<title>Contract Management</title>")))).outcome, "ok");
  assert.equal((await checkSource("en", contract, fetchReturning(response(contractUrl, 200, "<title>Home</title><nav>Contract Management</nav>")))).outcome, "broken");
  assert.equal((await checkSource("en", pdf, fetchReturning(response(pdfUrl, 200, "%PDF-1.7\n", "application/pdf")))).outcome, "ok");
  assert.equal((await checkSource("en", pdf, fetchReturning(response(pdfUrl, 200, "<html>Not found</html>")))).outcome, "broken");
});

test("unmapped claims and sources fail locally before any network request", async () => {
  const articles = JSON.parse(await readFile(articlePath, "utf8")) as Articles;
  articles.en.sections[1].citations = { "1": "removed-source" };
  await assert.rejects(checkArticles(articles, async () => {
    throw new Error("Should not fetch");
  }), /no matching source/);
});