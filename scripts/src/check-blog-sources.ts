import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

type Source = { id: string; label: string; url: string };
type Section = {
  heading?: string;
  paragraphs?: string[];
  citations?: Record<string, string>;
  subsections?: Section[];
};
type Article = { sources: Source[]; sections: Section[] };
export type Articles = Record<string, Article>;
type Reference = { language: string; heading: string; claim: string };
type Result = {
  language: string;
  source: Source;
  references: Reference[];
  outcome: "ok" | "broken" | "unavailable";
  detail: string;
};

// Keep these independent of the article URLs: changing a link must not silently
// change the expected destination for the claim it supports.
const expected: Record<string, { path: string; markers?: RegExp[]; pdf?: boolean }> = {
  contract: {
    path: "/ministry-services/services/إدارة-العقود",
    markers: [/إدارة\s*العقود|contract management/i],
  },
  laborLaw: {
    path: "/knowledge-centre/نظام-العمل",
    markers: [/نظام\s*العمل|labor law/i],
  },
  behavioralInsights: {
    path: "/sites/default/files/2024-03/G20 stocktaking report on BI_OECD_Final.pdf",
    pdf: true,
  },
};

export const articlePath = fileURLToPath(
  new URL("../../artifacts/web/src/pages/blogArticleContent.json", import.meta.url),
);

function normalizedPath(url: URL) {
  return decodeURIComponent(url.pathname).replace(/\/+$/, "").toLowerCase();
}

function expectedPath(language: string, id: string) {
  const spec = expected[id];
  if (!spec) throw new Error(`Unknown citation ID "${id}": add a destination expectation before checking it`);
  return `${language === "en" && !spec.pdf ? "/en" : ""}${spec.path}`.toLowerCase();
}

function referencesFor(article: Article, language: string): Map<string, Reference[]> {
  const references = new Map(article.sources.map((source) => [source.id, [] as Reference[]]));
  if (references.size !== article.sources.length) throw new Error(`${language}: duplicate source IDs`);
  for (const source of article.sources) expectedPath(language, source.id);
  const visit = (section: Section, parent = "") => {
    const heading = [parent, section.heading].filter(Boolean).join(" / ");
    for (const [index, id] of Object.entries(section.citations ?? {})) {
      const claim = section.paragraphs?.[Number(index)];
      if (!claim || !references.has(id)) {
        throw new Error(`${language}: citation ${id} in "${heading}" has no matching source or paragraph ${index}`);
      }
      references.get(id)!.push({ language, heading, claim: claim.slice(0, 170) });
    }
    for (const child of section.subsections ?? []) visit(child, heading);
  };
  for (const section of article.sections) visit(section);
  for (const [id, refs] of references) {
    if (!refs.length) throw new Error(`${language}: source ${id} is not cited by any claim`);
  }
  return references;
}

// Read just enough to inspect HTML and PDF signatures; cancel large downloads.
async function readPrefix(response: Response, limit: number): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (size < limit) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value.subarray(0, limit - size));
      size += value.length;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const output = new Uint8Array(Math.min(size, limit));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

export async function checkSource(
  language: string,
  source: Source,
  fetcher: typeof fetch = fetch,
): Promise<Pick<Result, "outcome" | "detail">> {
  const url = new URL(source.url);
  if (url.protocol !== "https:" || url.hostname !== "www.hrsd.gov.sa" ||
      normalizedPath(url) !== expectedPath(language, source.id)) {
    return { outcome: "broken", detail: `URL does not match the expected Ministry destination for ${source.id}: ${source.url}` };
  }
  try {
    const response = await fetcher(source.url, {
      headers: { "Accept": expected[source.id].pdf ? "application/pdf" : "text/html" },
      signal: AbortSignal.timeout(15000),
    });
    const final = new URL(response.url);
    if (final.protocol !== "https:" || final.hostname !== "www.hrsd.gov.sa" ||
        normalizedPath(final) !== expectedPath(language, source.id)) {
      return { outcome: "broken", detail: `Redirected to a different destination: ${response.url} (HTTP ${response.status})` };
    }
    if (response.status === 404 || response.status === 410) {
      return { outcome: "broken", detail: `HTTP ${response.status}: destination disappeared` };
    }
    if (!response.ok) {
      return { outcome: "unavailable", detail: `HTTP ${response.status}: access or service unavailable; retry manually` };
    }
    const bytes = await readPrefix(response, expected[source.id].pdf ? 64 : 1_000_000);
    if (expected[source.id].pdf) {
      const signature = new TextDecoder().decode(bytes.subarray(0, 5));
      return signature === "%PDF-"
        ? { outcome: "ok", detail: `PDF verified (HTTP ${response.status})` }
        : { outcome: "broken", detail: `Expected PDF, received ${response.headers.get("content-type") ?? "unknown type"} without a PDF signature` };
    }
    const body = new TextDecoder().decode(bytes);
    // Navigation/footer text can mention many services, even on an unrelated
    // page. Require the cited topic in the page's own title or H1 instead.
    const heading = [...body.matchAll(/<(title|h1)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map((match) => match[2].replace(/<[^>]+>/g, " "))
      .join(" ");
    if (!expected[source.id].markers?.some((marker) => marker.test(heading))) {
      return { outcome: "broken", detail: "Page title/H1 does not identify the cited topic (possible soft 404 or unrelated page)" };
    }
    return { outcome: "ok", detail: `Relevant page verified (HTTP ${response.status})` };
  } catch (error) {
    return { outcome: "unavailable", detail: `Request failed: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function checkArticles(articles: Articles, fetcher: typeof fetch = fetch): Promise<Result[]> {
  const results: Result[] = [];
  // Fetch each locale separately, including the PDF: reports still show both
  // citation-to-claim mappings even where URLs happen to be identical.
  for (const [language, article] of Object.entries(articles)) {
    const references = referencesFor(article, language);
    for (const source of article.sources) {
      const check = await checkSource(language, source, fetcher);
      results.push({ language, source, references: references.get(source.id)!, ...check });
    }
  }
  return results;
}

function escapeMd(text: string) {
  return text.replace(/[|\r\n]/g, " ");
}

export function formatReport(results: Result[]): string {
  const lines = [
    "# Saudi HR article source check",
    "",
    "BROKEN = a missing or unrelated destination (fails this scheduled run). UNAVAILABLE = timeout, access block or server error (review, but does not fail).",
    "",
    "| Result | Language / citation | Destination | Evidence |",
    "| --- | --- | --- | --- |",
  ];
  for (const result of results) {
    lines.push(`| ${result.outcome.toUpperCase()} | ${result.language} / ${result.source.id} | ${escapeMd(result.source.url)} | ${escapeMd(result.detail)} |`);
    for (const ref of result.references) {
      lines.push(`| ↳ Claim | ${result.language} / ${result.source.id} | ${escapeMd(ref.heading)} | ${escapeMd(ref.claim)}… |`);
    }
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const articles = JSON.parse(await readFile(articlePath, "utf8")) as Articles;
  const results = await checkArticles(articles);
  const report = formatReport(results);
  process.stdout.write(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = await import("node:fs/promises");
    await appendFile(process.env.GITHUB_STEP_SUMMARY, report);
  }
  if (results.some((result) => result.outcome === "broken")) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}