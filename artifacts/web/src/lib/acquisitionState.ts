export type Touch = {
  source: string; medium: string; campaign: string; content: string; landing: string;
  term?: string; marketer?: string; at?: string;
};
export type Attribution = { session: string; first: Touch; latest: Touch };
const key = "nizamy_acquisition_v1";
const clean = (value: string | null) => (value || "").replace(/[\r\n<>]/g, "").slice(0, 160);

export function captureAcquisition(url: URL, referrer: string, visit: string, storage: Storage, now = Date.now()): Attribution {
  let previous: Attribution | undefined;
  let previousVisit: string | undefined;
  try {
    const saved = JSON.parse(storage.getItem(key) || "null");
    if (saved?.expires > now && /^[a-f0-9-]{36}$/i.test(saved.value?.session) &&
      typeof saved.value?.first?.source === "string" && typeof saved.value?.latest?.source === "string") {
      previous = saved.value;
      previousVisit = saved.visit;
    }
  } catch { /* Storage restrictions must never prevent form submission. */ }
  let host = "";
  try { host = new URL(referrer).hostname; } catch {}
  const external = host !== url.hostname ? host : "";
  const tagged = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_marketer", "gclid", "fbclid"]
    .some(field => Boolean(url.searchParams.get(field)));
  const source = clean(url.searchParams.get("utm_source")) ||
    (url.searchParams.has("gclid") ? "google" : url.searchParams.has("fbclid") ? "meta" :
      /^(www\.)?(chatgpt\.com|chat\.openai\.com)$/.test(external) ? "chatgpt" : external || (tagged ? "unknown" : "direct"));
  const touch: Touch = {
    source, medium: clean(url.searchParams.get("utm_medium")) || (url.searchParams.has("gclid") ? "cpc" :
      url.searchParams.has("fbclid") ? "social" : source === "direct" ? "none" : "referral"),
    campaign: clean(url.searchParams.get("utm_campaign")), content: clean(url.searchParams.get("utm_content")),
    term: clean(url.searchParams.get("utm_term")), marketer: clean(url.searchParams.get("utm_marketer")),
    landing: clean(url.pathname), at: new Date(now).toISOString(),
  };
  // Internal navigation never overwrites a visit. A new direct visit does:
  // latest means last visit, not last paid/non-direct click.
  const latest = previous && previousVisit === visit && !tagged ? previous.latest : touch;
  const value = { session: previous?.session || crypto.randomUUID(), first: previous?.first || touch, latest };
  try { storage.setItem(key, JSON.stringify({value, visit, expires: now + 90 * 86400000})); } catch {}
  return value;
}
