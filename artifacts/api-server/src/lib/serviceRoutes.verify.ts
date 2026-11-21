/** Read-only requests to built static pages; no customer fixtures or background workers. */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

async function main() {
  process.env.STATIC_DIR = fileURLToPath(new URL("../../../web/dist/public", import.meta.url));
  assert.ok(path.isAbsolute(process.env.STATIC_DIR));
  const { default: app } = await import("../app");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  try {
    for (const route of ["/services/ai-hr", "/services/employee-rewards"]) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(`rel="canonical" href="https://nizamy.app${route}"`));
      assert.ok(html.includes('"@type":"Service"'));
      for (const alias of [route + "/", route.toUpperCase()]) {
        const redirect = await fetch(base + alias, { redirect: "manual" });
        assert.equal(redirect.status, 308);
        assert.equal(redirect.headers.get("location"), route);
      }
    }
    assert.equal((await fetch(base + "/services/does-not-exist")).status, 404);
    console.log("Service routes: production HTML, canonical redirects and unknown-page 404 passed.");
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
