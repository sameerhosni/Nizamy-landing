import express from "express";
import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("@workspace/db", () => ({ getPool: () => ({ query }) }));
vi.mock("../lib/visitors", () => ({ storeVisitorEvent: vi.fn(), validVisitorId: vi.fn() }));
import { trafficReportRouter } from "./traffic";

describe("website acquisition CSV query parameters", () => {
  let server: Server;
  let url: string;
  beforeAll(async () => {
    const app = express();
    app.use(trafficReportRouter);
    server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Missing server address");
    url = `http://127.0.0.1:${address.port}/acquisitions.csv`;
  });
  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });
  beforeEach(() => query.mockReset().mockResolvedValue({ rows: [] }));

  it.each(["", "?days=0", "?days=1", "?days=7", "?days=30"])("accepts %s", async (suffix) => {
    const response = await fetch(url + suffix);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv");
    expect(query).toHaveBeenCalledOnce();
    await response.text();
  });
  it.each(["?days=", "?days=90", "?days=abc", "?days=1&days=7"])("rejects %s", async (suffix) => {
    const response = await fetch(url + suffix);
    expect(response.status).toBe(400);
    expect(query).not.toHaveBeenCalled();
    await response.text();
  });
});
