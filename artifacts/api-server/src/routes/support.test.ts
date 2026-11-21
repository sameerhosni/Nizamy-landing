import { createHash, createHmac } from "node:crypto";
import type { Server } from "node:http";
import express from "express";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Mount the real parent router and authentication middleware, unlike the
// inbox-sync unit suite. No database, mailbox, or customer fixtures are loaded.
const storage = vi.hoisted(() => ({ query: vi.fn(), connect: vi.fn() }));
vi.mock("@workspace/db", () => ({ getPool: () => storage }));
vi.mock("../lib/mailer", () => ({ sendStaffLoginCode: vi.fn() }));
vi.mock("../lib/supportImport", () => ({ importSupportReplies: vi.fn() }));
vi.mock("../lib/supportInbox", () => ({ syncLocalInbox: vi.fn(), syncEmailInbox: vi.fn() }));
vi.mock("./supportRelevance", () => ({ default: express.Router() }));
vi.mock("./supportReplies", () => ({ default: express.Router() }));
vi.mock("./traffic", () => ({ trafficReportRouter: express.Router() }));
vi.mock("./visitors", () => ({ visitorsRouter: express.Router() }));

import router from "./support";
import { staffEmail } from "../lib/supportAuth";
import { syncLocalInbox, syncEmailInbox } from "../lib/supportInbox";
import { importSupportReplies } from "../lib/supportImport";
import { sendStaffLoginCode } from "../lib/mailer";

const token = "a".repeat(64);
const digest = createHash("sha256").update(token).digest("hex");
const cookie = `nz_staff=${token}`;
const syntheticQuestion = { id: 1, title: "Synthetic question", question: "Test only" };
let sessionRow: { email: string; expiresAt: number } | undefined;
let server: Server;
let baseUrl: string;
const errors = vi.fn();

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.log = { error: errors, warn: vi.fn() } as unknown as typeof req.log;
    next();
  });
  app.use("/api/support", router);
  server = await new Promise<Server>(resolve => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test port");
  baseUrl = `http://127.0.0.1:${address.port}/api/support`;
});

afterAll(() => new Promise<void>((resolve, reject) => {
  server.close(error => error ? reject(error) : resolve());
}));

beforeEach(() => {
  vi.resetAllMocks();
  sessionRow = undefined;
  storage.connect.mockRejectedValue(new Error("Unexpected transaction"));
  storage.query.mockImplementation(async (sql: string, params: unknown[]) => {
    if (sql.startsWith("SELECT email FROM support_sessions")) {
      // Assert the real expiry predicate, not merely a mocked denial result.
      expect(sql).toContain("token_hash=$1 AND expires_at>now()");
      expect(params).toEqual([digest]);
      return { rows: sessionRow && sessionRow.expiresAt > Date.now() ? [{ email: sessionRow.email }] : [] };
    }
    throw new Error("Unexpected storage access");
  });
  vi.mocked(syncLocalInbox).mockResolvedValue(undefined);
  vi.mocked(syncEmailInbox).mockResolvedValue(2);
});

function authorize() {
  sessionRow = { email: staffEmail, expiresAt: Date.now() + 60_000 };
}

function request(path: string, method = "GET", headers: Record<string, string> = {}, body?: unknown) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function expectNoProtectedWork() {
  expect(syncLocalInbox).not.toHaveBeenCalled();
  expect(syncEmailInbox).not.toHaveBeenCalled();
  expect(importSupportReplies).not.toHaveBeenCalled();
  expect(sendStaffLoginCode).not.toHaveBeenCalled();
  expect(storage.connect).not.toHaveBeenCalled();
  expect(storage.query.mock.calls.every(([sql]) => sql.startsWith("SELECT email FROM support_sessions"))).toBe(true);
  expect(errors).not.toHaveBeenCalled();
}

describe("support authentication boundary", () => {
  const denied = [
    { name: "missing cookie", cookie: undefined, lookup: false },
    { name: "malformed cookie", cookie: "nz_staff=invalid", lookup: false },
    { name: "overlong token", cookie: `nz_staff=${token}a`, lookup: false },
    { name: "wrong cookie name", cookie: `other_nz_staff=${token}`, lookup: false },
    { name: "unknown session", cookie, lookup: true },
    { name: "expired session", cookie, lookup: true },
    { name: "non-staff session", cookie, lookup: true },
  ];

  describe.each(denied)("$name", scenario => {
    beforeEach(() => {
      if (scenario.name === "expired session") sessionRow = { email: staffEmail, expiresAt: Date.now() - 1 };
      if (scenario.name === "non-staff session") sessionRow = { email: "outsider@example.invalid", expiresAt: Date.now() + 60_000 };
    });
    it.each([
      ["GET", "/inbox"], ["GET", "/tickets"], ["GET", "/cases"],
      ["POST", "/inbox/sync"], ["POST", "/import"],
    ])("blocks %s %s before protected work", async (method, path) => {
      const res = await request(path, method, {
        "X-Support-Request": "1",
        ...(scenario.cookie ? { Cookie: scenario.cookie } : {}),
      });
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Staff sign-in required" });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      expect(storage.query).toHaveBeenCalledTimes(scenario.lookup ? 1 : 0);
      expectNoProtectedWork();
    });
    it("exposes no staff identity through the public session endpoint", async () => {
      const res = await request("/session", "GET", scenario.cookie ? { Cookie: scenario.cookie } : {});
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ email: null });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      expectNoProtectedWork();
    });
  });

  it("recognizes a valid staff cookie among unrelated cookies", async () => {
    authorize();
    const res = await request("/session", "GET", { Cookie: `theme=dark; ${cookie}; locale=en` });
    expect(await res.json()).toEqual({ email: staffEmail });
    expect(storage.query).toHaveBeenCalledOnce();
    expectNoProtectedWork();
  });

  it("lets authorized staff read synthetic questions without a mutation header", async () => {
    authorize();
    const authQuery = storage.query.getMockImplementation()!;
    storage.query.mockImplementation(async (sql, params) => {
      if (sql.includes("FROM support_inbox")) return { rows: [syntheticQuestion] };
      return authQuery(sql, params);
    });
    const res = await request("/inbox", "GET", { Cookie: cookie });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ items: [syntheticQuestion], localSynced: true });
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(storage.query).toHaveBeenCalledTimes(2);
    expect(syncLocalInbox).toHaveBeenCalledOnce();
    expect(syncEmailInbox).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });

  it("lets authorized staff sync only with the valid mutation header", async () => {
    authorize();
    const res = await request("/inbox/sync", "POST", { Cookie: cookie, "X-Support-Request": "1" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ imported: 2, localSynced: true, emailSynced: true });
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(storage.query).toHaveBeenCalledOnce();
    expect(syncLocalInbox).toHaveBeenCalledOnce();
    expect(syncEmailInbox).toHaveBeenCalledOnce();
    expect(errors).not.toHaveBeenCalled();
  });

  it("fails closed when session storage is unavailable", async () => {
    storage.query.mockRejectedValueOnce(new Error("Synthetic storage failure"));
    const res = await request("/inbox/sync", "POST", { Cookie: cookie, "X-Support-Request": "1" });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Support service temporarily unavailable" });
    expect(syncLocalInbox).not.toHaveBeenCalled();
    expect(syncEmailInbox).not.toHaveBeenCalled();
    expect(errors).toHaveBeenCalledOnce();
  });
});

describe("support logout lifecycle", () => {
  const securityAttributes = ["Path=/api/support", "HttpOnly", "Secure", "SameSite=Strict"];
  const hashToken = (value: string) => createHash("sha256").update(value).digest("hex");
  let sessions: Map<string, string>;

  function expectSecureCookie(res: Response) {
    const header = res.headers.get("Set-Cookie");
    expect(header).not.toBeNull();
    const parts = header!.split("; ");
    for (const attribute of securityAttributes) expect(parts).toContain(attribute);
    expect(parts.some(part => part.startsWith("Domain="))).toBe(false);
    return parts;
  }

  beforeEach(() => {
    sessions = new Map([[digest, staffEmail]]);
    storage.query.mockImplementation(async (sql: string, params: string[]) => {
      if (sql === "SELECT email FROM support_sessions WHERE token_hash=$1 AND expires_at>now()") {
        return { rows: sessions.has(params[0]) ? [{ email: sessions.get(params[0]) }] : [] };
      }
      if (sql === "DELETE FROM support_sessions WHERE token_hash=$1") {
        expect(params).toHaveLength(1);
        return { rows: [], rowCount: Number(sessions.delete(params[0])) };
      }
      throw new Error(`Unexpected storage access: ${sql}`);
    });
  });

  afterEach(() => vi.unstubAllEnvs());

  it("issues a secure support-only cookie and revokes only that hashed session on logout", async () => {
    // Synthetic secret/code only; real storage and mail remain mocked.
    const secret = "isolated-support-test-secret";
    const code = "123456";
    vi.stubEnv("SESSION_SECRET", secret);
    const transaction = {
      query: vi.fn(async (sql: string, params?: string[]) => {
        if (sql === "SELECT * FROM support_login WHERE email=$1 FOR UPDATE") {
          return { rows: [{
            code_hash: createHmac("sha256", secret).update(code).digest("hex"),
            attempts: 0, expires_at: new Date(Date.now() + 60_000),
          }] };
        }
        if (sql.startsWith("INSERT INTO support_sessions")) {
          expect(params).toHaveLength(2);
          sessions.set(params![0], params![1]);
        } else if (![
          "BEGIN", "COMMIT",
          "UPDATE support_login SET attempts=attempts+1 WHERE email=$1",
          "UPDATE support_login SET attempts=5 WHERE email=$1",
          "DELETE FROM support_sessions WHERE expires_at<now()",
        ].includes(sql)) {
          throw new Error(`Unexpected transaction query: ${sql}`);
        }
        return { rows: [] };
      }),
      release: vi.fn(),
    };
    storage.connect.mockResolvedValue(transaction);
    const verified = await request("/verify", "POST", { "X-Support-Request": "1" }, { email: staffEmail, code });
    expect(verified.status).toBe(200);
    expect(await verified.json()).toEqual({ email: staffEmail });
    const issuedParts = expectSecureCookie(verified);
    expect(issuedParts).toContain("Max-Age=259200");
    const issuedCookie = issuedParts[0];
    expect(issuedCookie).toMatch(/^nz_staff=[a-f0-9]{64}$/);
    const issuedToken = issuedCookie.slice("nz_staff=".length);
    const issuedDigest = hashToken(issuedToken);
    expect(transaction.query).toHaveBeenCalledWith(
      "INSERT INTO support_sessions (token_hash,email,expires_at) VALUES ($1,$2,now()+interval '3 days')",
      [issuedDigest, staffEmail],
    );
    expect(transaction.release).toHaveBeenCalledOnce();
    expect(sessions.size).toBe(2);
    const before = await request("/session", "GET", { Cookie: issuedCookie });
    expect(await before.json()).toEqual({ email: staffEmail });

    storage.query.mockClear();
    const loggedOut = await request("/logout", "POST", {
      Cookie: `theme=dark; ${issuedCookie}; locale=en`, "X-Support-Request": "1",
    });
    expect(loggedOut.status).toBe(200);
    expect(await loggedOut.json()).toEqual({ ok: true });
    expect(loggedOut.headers.get("Cache-Control")).toBe("no-store");
    const clearedParts = expectSecureCookie(loggedOut);
    expect(clearedParts[0]).toBe("nz_staff=");
    expect(clearedParts).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    expect(clearedParts.some(part => part.startsWith("Max-Age="))).toBe(false);
    expect(storage.query).toHaveBeenCalledExactlyOnceWith(
      "DELETE FROM support_sessions WHERE token_hash=$1", [issuedDigest],
    );
    expect([...sessions]).toEqual([[digest, staffEmail]]);

    // Replay the old cookie explicitly: denial must come from revocation,
    // not merely from a browser discarding the cleared cookie.
    vi.clearAllMocks();
    const after = await request("/session", "GET", { Cookie: issuedCookie });
    expect(await after.json()).toEqual({ email: null });
    for (const [method, path] of [
      ["GET", "/inbox"], ["GET", "/tickets"], ["GET", "/cases"],
      ["POST", "/inbox/sync"], ["POST", "/import"],
    ]) {
      const res = await request(path, method, { Cookie: issuedCookie, "X-Support-Request": "1" });
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Staff sign-in required" });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    }
    expectNoProtectedWork();
    const otherSession = await request("/session", "GET", { Cookie: cookie });
    expect(await otherSession.json()).toEqual({ email: staffEmail });

    const repeated = await request("/logout", "POST", { Cookie: issuedCookie, "X-Support-Request": "1" });
    expect(repeated.status).toBe(200);
    expect(await repeated.json()).toEqual({ ok: true });
    expectSecureCookie(repeated);
    expect([...sessions]).toEqual([[digest, staffEmail]]);
  });

  it.each([undefined, "nz_staff=invalid", `nz_staff=${token}a`, `other_nz_staff=${token}`])(
    "clears absent or malformed cookies without deleting any session (%s)",
    async suppliedCookie => {
      const res = await request("/logout", "POST", {
        "X-Support-Request": "1", ...(suppliedCookie ? { Cookie: suppliedCookie } : {}),
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(expectSecureCookie(res)[0]).toBe("nz_staff=");
      expect(storage.query).not.toHaveBeenCalled();
      expect([...sessions]).toEqual([[digest, staffEmail]]);
      expectNoProtectedWork();
    },
  );
});

describe("support mutation request guard", () => {
  it.each([
    ["POST", "/inbox/sync"], ["POST", "/inbox"], ["PATCH", "/inbox/1"],
    ["POST", "/inbox/1/case"], ["POST", "/cases"], ["PUT", "/cases/1"],
    ["POST", "/cases/1/feedback"], ["POST", "/import"],
    ["POST", "/login"], ["POST", "/verify"], ["POST", "/logout"],
    ["DELETE", "/inbox/1"],
  ])("rejects missing or incorrect headers on %s %s even for staff", async (method, path) => {
    authorize();
    for (const value of [undefined, "0", "true", "1, 1"]) {
      const res = await request(path, method, {
        Cookie: cookie, ...(value === undefined ? {} : { "X-Support-Request": value }),
      });
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "Invalid request" });
      expect(res.headers.get("Cache-Control")).toBe("no-store");
    }
    expect(storage.query).not.toHaveBeenCalled();
    expectNoProtectedWork();
  });

  it.each([
    ["POST", "/inbox", { title: "", question: "Synthetic" }],
    ["PATCH", "/inbox/not-an-id", { status: "resolved" }],
    ["PATCH", "/inbox/1", { status: "invalid" }],
    ["POST", "/inbox/not-an-id/case", {}],
    ["POST", "/cases", {}],
    ["PUT", "/cases/1", {}],
    ["POST", "/cases/1/feedback", { helpful: true, comment: "" }],
  ])("rejects invalid input on %s %s without storage mutations", async (method, path, body) => {
    authorize();
    const res = await request(path, method, { Cookie: cookie, "X-Support-Request": "1" }, body);
    expect(res.status).toBe(400);
    expect(storage.query).toHaveBeenCalledOnce();
    expectNoProtectedWork();
  });
});
