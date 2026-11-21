import assert from "node:assert/strict";
import path from "node:path";

process.env["STATIC_DIR"] ??= path.resolve(import.meta.dirname, "../../../web/dist/public");
const { default: app } = await import("../app");
const server = app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Expected test HTTP port");
const origin = `http://127.0.0.1:${address.port}`;
const routes = [
  ["/privacy-policy", true], ["/biometric-data-security", true],
  ["/faq/ar", false], ["/faq/en", false], ["/help", false],
  ["/small-business-hr-software-saudi-arabia", false], ["/pricing", true],
  ["/blog/hr-app-nizamy", false],
] as const;
try {
  for (const [route, draft] of routes) {
    const response = await fetch(`${origin}${route}`);
    assert.equal(response.status, 200, route);
    assert((await response.text()).includes(`${route}"`), `${route}: route-specific content`);
    assert.equal(response.headers.get("x-robots-tag"), draft ? "noindex, nofollow" : null);
    const alternate = await fetch(`${origin}${route.toUpperCase()}/`, { redirect: "manual" });
    assert.equal(alternate.status, 308, route);
    assert.equal(alternate.headers.get("location"), route);
  }
  assert.equal((await fetch(`${origin}/support`)).status, 200, "Staff support preserved");
  const oldFaq = await fetch(`${origin}/faq`, { redirect: "manual" });
  assert.equal(oldFaq.status, 308);
  assert.equal(oldFaq.headers.get("location"), "/faq/ar");
  assert.equal((await fetch(`${origin}/does-not-exist`)).status, 404);
  console.log("Six production routes: HTTP 200, canonical redirects, draft robots, preserved support and 404 passed.");
} finally {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
