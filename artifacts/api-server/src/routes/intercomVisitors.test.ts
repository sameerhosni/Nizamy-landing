import express from "express";
import type { Server } from "node:http";
import { afterAll, beforeAll, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ query: vi.fn(), contacts: vi.fn(), contact: vi.fn(), conversations: vi.fn() }));
vi.mock("@workspace/db", () => ({ getPool: () => ({ query: mocks.query }) }));
vi.mock("../lib/mailer", () => ({ sendStaffLoginCode: vi.fn() }));
vi.mock("../lib/intercomReporting", async importOriginal => ({
  ...await importOriginal<typeof import("../lib/intercomReporting")>(),
  listIntercomContacts: mocks.contacts, getIntercomContact: mocks.contact, listIntercomConversations: mocks.conversations,
}));
import { requireStaff, staffEmail } from "../lib/supportAuth";
import { visitorsRouter } from "./visitors";
let server: Server, base: string;
const cookie = `nz_staff=${"a".repeat(64)}`;
const contact = { id: "c1", source: "intercom", email: " Person@Example.test ", name: "Name", role: null, createdAt: null, updatedAt: null, lastSeenAt: null };
beforeAll(async () => {
  const app = express();
  app.use("/api/support", requireStaff, visitorsRouter);
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/support/visitors/intercom`;
});
afterAll(() => new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve())));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.query.mockImplementation(async sql => ({ rows: sql.includes("support_sessions") ? [{ email: staffEmail }] : [{ profile_id: "website1" }, { profile_id: "website2" }] }));
  mocks.contact.mockResolvedValue(contact);
  mocks.conversations.mockResolvedValue({ conversations: [], nextCursor: null });
  mocks.contacts.mockResolvedValue({ items: [contact], nextCursor: "next", fetchedAt: new Date().toISOString() });
});
it.each(["", "/activity?contactId=c1"])("denies anonymous access before provider calls: %s", async path => {
  expect((await fetch(base + path)).status).toBe(401);
  expect(mocks.query).not.toHaveBeenCalled();
  expect(mocks.contacts).not.toHaveBeenCalled();
  expect(mocks.contact).not.toHaveBeenCalled();
});
it("denies expired/non-staff sessions", async () => {
  mocks.query.mockResolvedValue({ rows: [] });
  expect((await fetch(base, { headers: { cookie } })).status).toBe(401);
  expect(mocks.contacts).not.toHaveBeenCalled();
});
it("only reads exact normalized email candidates, labels all unverified, and never merges", async () => {
  const res = await fetch(`${base}/activity?contactId=c1&cursor=opaque`, { headers: { cookie } });
  expect(res.status).toBe(200);
  expect(res.headers.get("cache-control")).toBe("no-store");
  expect(((await res.json()) as { candidates: unknown }).candidates).toEqual([
    { profileId: "website1", basis: "exact_email_unverified" }, { profileId: "website2", basis: "exact_email_unverified" },
  ]);
  expect(mocks.conversations).toHaveBeenCalledWith("c1", "opaque");
  expect(mocks.query.mock.calls[1]).toEqual([
    "SELECT DISTINCT profile_id FROM visitor_identities WHERE kind='email' AND value=$1 ORDER BY profile_id", ["person@example.test"],
  ]);
  expect(mocks.query.mock.calls.every(([sql]) => sql.startsWith("SELECT"))).toBe(true);
});
it("does not infer identity from a name when email is absent", async () => {
  mocks.contact.mockResolvedValue({ ...contact, email: null });
  const res = await fetch(`${base}/activity?contactId=c1`, { headers: { cookie } });
  expect(((await res.json()) as { candidates: unknown }).candidates).toEqual([]);
  expect(mocks.query).toHaveBeenCalledTimes(1);
});
it.each(["?email=a&email=b", "?cursor=" + "x".repeat(2049), "/activity?contactId=../../other", "/activity"])("rejects malformed filters %s", async path => {
  expect((await fetch(base + path, { headers: { cookie } })).status).toBe(400);
  expect(mocks.contacts).not.toHaveBeenCalled();
  expect(mocks.contact).not.toHaveBeenCalled();
});
