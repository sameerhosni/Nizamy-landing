import express, { type ErrorRequestHandler } from "express";
import type { Server } from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Never load the database, mailbox connector, or unrelated relevance routes.
const database = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("@workspace/db", () => ({ getPool: () => database }));
vi.mock("../lib/supportInbox", () => ({
  syncLocalInbox: vi.fn(), syncEmailInbox: vi.fn(),
  EmailSyncInProgressError: class extends Error {
    constructor(){super("Mailbox synchronization already running");}
  },
}));
vi.mock("./supportRelevance", () => ({ default: express.Router() }));
import router from "./supportInbox";
import { EmailSyncInProgressError, syncLocalInbox, syncEmailInbox } from "../lib/supportInbox";

const local = vi.mocked(syncLocalInbox);
const email = vi.mocked(syncEmailInbox);
const warn = vi.fn();
let server: Server;
let url: string;
const errors: unknown[] = [];
const sync = () => fetch(url, { method: "POST" });

beforeAll(async () => {
  const app = express();
  app.use((req, _res, next) => {
    req.log = { warn } as unknown as typeof req.log;
    next();
  });
  app.use(router);
  // Capture Express error forwarding without printing errors or contacting services.
  app.use(((error, _req, res, _next) => {
    errors.push(error);
    res.status(500).json({ error: "Internal server error" });
  }) as ErrorRequestHandler);
  server = await new Promise<Server>((resolve) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test port");
  url = `http://127.0.0.1:${address.port}/inbox/sync`;
});
afterAll(() => new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve())));
beforeEach(() => {
  vi.resetAllMocks();
  errors.length = 0;
  database.query.mockRejectedValue(new Error("Unexpected database access"));
  local.mockResolvedValue(undefined);
  email.mockResolvedValue(4);
});

describe("GET /inbox saved-question fallback", () => {
  it("returns saved questions with an explicit warning flag after local refresh fails", async () => {
    local.mockRejectedValueOnce(new Error("PRIVATE_TEST_CONNECTOR_ERROR"));
    const saved = [{ id: 1, title: "Synthetic saved question" }];
    database.query.mockResolvedValueOnce({ rows: saved });
    const res = await fetch(url.replace("/sync", "?view=active"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ items: saved, localSynced: false });
    expect(warn.mock.calls).toEqual([[
      { phase: "local_sync" }, "Support inbox refresh failed; reading saved questions",
    ]]);
    expect(database.query.mock.calls[0][1]).toEqual(["active"]);
    expect(email).not.toHaveBeenCalled();
  });

  it("reports a successful local refresh and returns saved rows", async () => {
    database.query.mockResolvedValueOnce({ rows: [] });
    const res = await fetch(url.replace("/sync", ""));
    expect(await res.json()).toEqual({ items: [], localSynced: true });
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not turn a failed saved-row read into an empty success", async () => {
    local.mockRejectedValueOnce(new Error("Refresh failure"));
    database.query.mockRejectedValueOnce(new Error("Saved rows unavailable"));
    const res = await fetch(url.replace("/sync", ""));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
    expect(errors).toHaveLength(1);
  });
});

describe("POST /inbox/sync", () => {
  it("reports shared importer contention as a conflict, not partial success", async () => {
    email.mockRejectedValueOnce(new EmailSyncInProgressError());
    const res=await sync();
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({error:"Mailbox synchronization already running"});
    expect(warn).not.toHaveBeenCalled();
    expect((await sync()).status).toBe(200);
  });
  it("syncs local questions before email and returns the complete success contract", async () => {
    email.mockImplementation(async () => {
      expect(local).toHaveBeenCalledOnce();
      return 4;
    });
    const res = await sync();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ imported: 4, localSynced: true, emailSynced: true });
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([
    [new Error("Mailbox access failed (401)"), 401],
    [new Error("Connector secret=TEST_ONLY message=PRIVATE_TEST_TEXT"), undefined],
    [{ token: "TEST_ONLY", body: "PRIVATE_TEST_TEXT" }, undefined],
  ])("keeps local success on email failure and logs only safe metadata", async (failure, status) => {
    email.mockRejectedValueOnce(failure);
    const res = await sync();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ imported: null, localSynced: true, emailSynced: false });
    expect(local).toHaveBeenCalledOnce();
    expect(warn.mock.calls).toEqual([[
      { phase: "email_sync", mailboxStatus: status },
      "Support source sync partially completed",
    ]]);
    expect(errors).toEqual([]);
    // The finally block must unlock even after partial success.
    expect(await (await sync()).json()).toEqual({ imported: 4, localSynced: true, emailSynced: true });
  });

  it("forwards local failure without attempting email or reporting partial success, then unlocks", async () => {
    const failure = new Error("Local refresh failed");
    local.mockRejectedValueOnce(failure);
    const res = await sync();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
    expect(errors).toEqual([failure]);
    expect(email).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect((await sync()).status).toBe(200);
    expect(local).toHaveBeenCalledTimes(2);
    expect(email).toHaveBeenCalledOnce();
  });

  it.each(["local", "email"] as const)("rejects overlapping requests during %s work without releasing the first lock", async (phase) => {
    let release!: () => void;
    let started!: () => void;
    const entered = new Promise<void>(resolve => { started = resolve; });
    const pending = new Promise<void>(resolve => { release = resolve; });
    if (phase === "local") local.mockImplementationOnce(async () => { started(); await pending; });
    else email.mockImplementationOnce(async () => { started(); await pending; return 4; });
    const first = sync();
    await entered;
    try {
      for (let i = 0; i < 2; i++) {
        const conflict = await sync();
        expect(conflict.status).toBe(409);
        expect(await conflict.json()).toEqual({ error: "Mailbox synchronization already running" });
      }
      expect(local).toHaveBeenCalledOnce();
      expect(email).toHaveBeenCalledTimes(phase === "email" ? 1 : 0);
    } finally { release(); }
    expect((await first).status).toBe(200);
    expect((await sync()).status).toBe(200);
    expect(local).toHaveBeenCalledTimes(2);
    expect(email).toHaveBeenCalledTimes(2);
  });
});
