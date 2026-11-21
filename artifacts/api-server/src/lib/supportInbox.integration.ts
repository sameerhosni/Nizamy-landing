import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type pg from "pg";
import { hasBinary, isolatedPostgres } from "./testFixtures/isolatedPostgres";

const mocks = vi.hoisted(() => ({ connect: vi.fn(), proxy: vi.fn(), classify: vi.fn() }));
vi.mock("@workspace/db", () => ({
  getPool: () => ({
    connect: mocks.connect,
    query: () => { throw new Error("Synthetic test must not access application tables"); },
  }),
}));
vi.mock("@replit/connectors-sdk", () => ({ ReplitConnectors: class { proxy = mocks.proxy; } }));
vi.mock("./supportAuth", () => ({ staffEmail: "support@example.test" }));
vi.mock("@workspace/integrations-openai-ai-server", () => ({
  openai: { chat: { completions: { create: mocks.classify } } },
}));
import { EmailSyncInProgressError, syncEmailInbox } from "./supportInbox";

function gate() {
  let resolve!: () => void;
  const promise = new Promise<void>(r => { resolve = r; });
  return { promise, resolve };
}

// An explicit command runs this suite; missing PostgreSQL is a failure, not a skip.
let cluster: ReturnType<typeof isolatedPostgres>;
beforeAll(() => { cluster = isolatedPostgres(); }, 60_000);
afterAll(() => { cluster?.stop(); });

for (const pooled of [false, true]) {
  describe.skipIf(pooled && !hasBinary("pgbouncer"))(
    pooled ? "real PgBouncer transaction pooling" : "real PostgreSQL connections", () => {
      let ownerPool: pg.Pool, contenderPool: pg.Pool, admin: pg.Pool;
      let clients: { pid: number; release: ReturnType<typeof vi.fn>; lost: ReturnType<typeof gate> }[];
      beforeAll(async () => {
        ownerPool = cluster.pool(pooled);
        contenderPool = cluster.pool(pooled);
        admin = cluster.pool();
        const identity = (await admin.query("SELECT current_user AS name, current_setting('data_directory') AS dir")).rows[0];
        expect(identity).toEqual({ name: "inbox_test", dir: cluster.data });
        expect((await admin.query("SELECT count(*)::int AS n FROM pg_tables WHERE schemaname='public'")).rows[0].n).toBe(0);
      });
      afterAll(async () => {
        await Promise.all([ownerPool?.end(), contenderPool?.end(), admin?.end()]);
      });
      beforeEach(() => {
        vi.stubEnv("SUPPORT_MAIL_PROVIDER", "replit");
        vi.resetAllMocks();
        clients = [];
        mocks.classify.mockImplementation(() => { throw new Error("AI forbidden"); });
        mocks.proxy.mockImplementation(async (_provider: string, path: string) => ({
          ok: true,
          json: async () => path.endsWith("/profile") ? { emailAddress: "support@example.test" } : { threads: [] },
        }));
        mocks.connect.mockImplementation(async () => {
          const client = await (clients.length === 0 ? ownerPool : contenderPool).connect();
          const lost = gate();
          // Observe pg's asynchronous error so the harness can inspect cleanup.
          // This is deliberately not a production error-handling fix.
          client.on("error", lost.resolve);
          const release = vi.fn((discard: boolean) => {
            if (!discard) client.removeListener("error", lost.resolve);
            client.release(discard);
          });
          const entry = { pid: 0, release, lost };
          clients.push(entry);
          // Capture the PID inside BEGIN, when a transaction pooler pins it.
          const query = client.query.bind(client);
          return {
            release,
            async query(sql: string) {
              const result = await query(sql);
              if (sql === "BEGIN") entry.pid = (await query("SELECT pg_backend_pid() AS pid")).rows[0].pid;
              return result;
            },
          };
        });
      });

      async function hold() {
        const entered = gate(), finish = gate();
        mocks.proxy.mockImplementationOnce(async () => {
          entered.resolve();
          await finish.promise;
          return { ok: true, json: async () => ({ emailAddress: "support@example.test" }) };
        });
        const run = syncEmailInbox();
        await entered.promise;
        return { run, finish };
      }

      it("rejects independent contenders without releasing the owner's lock, then permits retry", async () => {
        const { run, finish } = await hold();
        try {
          await expect(syncEmailInbox()).rejects.toBeInstanceOf(EmailSyncInProgressError);
          await expect(syncEmailInbox()).rejects.toBeInstanceOf(EmailSyncInProgressError);
          expect(clients[1].pid).not.toBe(clients[0].pid);
          expect(mocks.proxy).toHaveBeenCalledTimes(1);
          expect(clients[1].release).toHaveBeenCalledWith(false);
        } finally { finish.resolve(); await run; }
        expect(clients[0].release).toHaveBeenCalledWith(false);
        await expect(syncEmailInbox()).resolves.toBe(0);
        expect(mocks.classify).not.toHaveBeenCalled();
      });

      it("rolls back after synthetic work fails and allows another connection to retry", async () => {
        mocks.proxy.mockRejectedValueOnce(new Error("Synthetic failure"));
        await expect(syncEmailInbox()).rejects.toThrow("Synthetic failure");
        expect(clients[0].release).toHaveBeenCalledWith(false);
        await expect(syncEmailInbox()).resolves.toBe(0);
      });

      it("releases a killed backend's lock and discards the broken client on cleanup", async () => {
        const { run, finish } = await hold();
        // Attach rejection handling before inducing connection loss.
        const outcome = run.then(() => null, error => error);
        try {
          const owner = clients[0];
          expect((await admin.query("SELECT pg_terminate_backend($1) AS killed", [owner.pid])).rows[0].killed).toBe(true);
          await owner.lost.promise;
          // PostgreSQL releases the lock even while synthetic work is paused.
          await expect(syncEmailInbox()).resolves.toBe(0);
        } finally { finish.resolve(); }
        expect(await outcome).toBeInstanceOf(Error);
        expect(clients[0].release).toHaveBeenCalledWith(true);
        await expect(syncEmailInbox()).resolves.toBe(0);
      });
    },
  );
}
