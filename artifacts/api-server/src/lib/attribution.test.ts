import { beforeEach, describe, expect, it, vi } from "vitest";
const {query} = vi.hoisted(() => ({query:vi.fn().mockResolvedValue({rows:[]})}));
vi.mock("@workspace/db", () => ({getPool:() => ({query})}));
vi.mock("./visitors", () => ({linkVisitorContact:vi.fn()}));
vi.mock("./logger", () => ({logger:{error:vi.fn()}}));
import { attributionMiddleware, recordAcquisition, acquisitionText } from "./attribution";
const value = {session:"11111111-1111-4111-8111-111111111111",first:{source:"meta",content:"ad1",term:"hr",marketer:"agency"},latest:{source:"google",at:"2026-11-12T00:00:00Z"}};
beforeEach(() => query.mockClear());
describe("attribution storage", () => {
  it("keeps validated campaign fields and saves a stable form request reference", async () => {
    const req:any = {get:() => encodeURIComponent(JSON.stringify(value)),method:"GET"};
    const res:any = {json:vi.fn()};
    // The mock pool is used, no database connection is opened.
    vi.stubEnv("DATABASE_URL", "mock-only");
    try {
      await new Promise<void>((resolve,reject) => attributionMiddleware(req,res,() => {
        expect(acquisitionText()).toContain("agency");
        recordAcquisition("/hubspot-form","request-1").then(resolve,reject);
      }));
      const config = query.mock.calls[0][0];
      expect(config.values[1]).toBe("request-1");
      expect(JSON.parse(config.values[2]).first.content).toBe("ad1");
      expect(config.text).toContain("ON CONFLICT(kind,record_id) DO NOTHING");
      expect(config.query_timeout).toBe(1500);
    } finally { vi.unstubAllEnvs(); }
    expect(acquisitionText()).toBe("");
  });
  it("ignores malformed attribution without blocking requests", () => {
    let called = false;
    attributionMiddleware({get:() => "%bad"} as any, {} as any, () => { called = true; });
    expect(called).toBe(true);
    expect(query).not.toHaveBeenCalled();
  });
});
