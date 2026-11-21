import { afterEach, expect, it, vi } from "vitest";
const mock = vi.hoisted(() => ({ search: vi.fn(), close: vi.fn(), open: vi.fn(), connect: vi.fn(), fetch: vi.fn(), subject: "Test", usable: true }));
const legacy = vi.hoisted(() => ({ proxy: vi.fn() }));
vi.mock("@replit/connectors-sdk", () => ({ ReplitConnectors: class { proxy = legacy.proxy; } }));
vi.mock("imapflow", () => ({ ImapFlow: class {
  capabilities = new Set(["X-GM-EXT-1"]);
  get usable() { return mock.usable; }
  on() {}
  connect = mock.connect;
  close = mock.close;
  list = async () => [{ path: "[Gmail]/All Mail", specialUse: "\\All" }];
  mailboxOpen = mock.open;
  search = mock.search;
  async *fetch(range: any, query: any) { mock.fetch(range, query); yield { uid: 1, envelope: { subject: mock.subject }, emailId: "255", threadId: "256", internalDate: new Date(0), source: Buffer.from("Subject: Test\r\nFrom: customer@example.test\r\n\r\nHello"), size: 80 }; }
} }));
import { gmailId, withSupportMailbox } from "./supportMailbox";
afterEach(() => { vi.unstubAllEnvs(); vi.resetAllMocks(); vi.useRealTimers(); mock.usable = true; mock.subject = "Test"; });
function credentials() {
  vi.stubEnv("SUPPORT_MAIL_PROVIDER", "imap");
  vi.stubEnv("IMAP_USERNAME", "support@example.test");
  vi.stubEnv("IMAP_PASSWORD", "test-only");
}
it.each(["Explee", "Re: EXPLEE update", "Notice ( Explee)", "prefixexpleesuffix"])("never fetches bodies for excluded subject %s", async subject => {
  credentials(); mock.subject = subject; mock.search.mockResolvedValue([1]);
  await withSupportMailbox("support@example.test", async get => {
    expect((await get("/gmail/v1/users/me/threads")).threads).toEqual([]);
    expect((await get("/gmail/v1/users/me/threads/100")).messages).toEqual([]);
    expect(await get("/gmail/v1/users/me/messages/ff")).toBeNull();
  });
  expect(mock.fetch.mock.calls.every(([, query]) => query.envelope === true && !query.source)).toBe(true);
});
it.each(["messages", "threads"])("blocks excluded legacy %s before full-content retrieval", async kind => {
  vi.stubEnv("SUPPORT_MAIL_PROVIDER", "replit");
  const message = { payload: { headers: [{ name: "Subject", value: "Re: EXPLEE" }] } };
  legacy.proxy.mockResolvedValue({ ok: true, json: async () => kind === "threads" ? { messages: [message] } : message });
  const result = await withSupportMailbox("support@example.test", get => get(`/gmail/v1/users/me/${kind}/ff?format=full`));
  expect(result).toEqual(kind === "threads" ? { messages: [] } : null);
  expect(legacy.proxy).toHaveBeenCalledTimes(1);
  expect(legacy.proxy.mock.calls[0][1]).toContain("format=metadata");
});
it("preserves Gmail IDs without precision loss", () => {
  expect(gmailId("18446744073709551615")).toBe("ffffffffffffffff");
  expect(() => gmailId(undefined)).toThrow();
});
it("reads threads with native Gmail IDs and closes read-only mailbox", async () => {
  credentials(); mock.search.mockResolvedValue([1]);
  const result = await withSupportMailbox("support@example.test", async get => {
    const list = await get("/gmail/v1/users/me/threads?maxResults=100&q=to%3Asupport");
    expect(list.threads).toEqual([{ id: "100" }]);
    return get("/gmail/v1/users/me/threads/100?format=full");
  });
  expect(mock.search).toHaveBeenLastCalledWith({ threadId: "256", gmailraw: "-in:spam -in:trash -in:drafts" }, { uid: true });
  expect(result.messages[0].id).toBe("ff");
  expect(Buffer.from(result.messages[0].payload.body.data, "base64url").toString()).toContain("Hello");
  expect(mock.open).toHaveBeenCalledWith("[Gmail]/All Mail", { readOnly: true });
  expect(mock.close).toHaveBeenCalled();
});
it("closes connection after failure", async () => {
  credentials(); mock.search.mockRejectedValueOnce(new Error("failure"));
  await expect(withSupportMailbox("support@example.test", get => get("/gmail/v1/users/me/messages"))).rejects.toThrow("failure");
  expect(mock.close).toHaveBeenCalled();
});
it("rejects wrong mailbox before connecting", async () => {
  credentials();
  await expect(withSupportMailbox("wrong@example.test", async () => 0)).rejects.toThrow("credentials");
  expect(mock.connect).not.toHaveBeenCalled();
});
it("closes reads before classification and opens a fresh connection after a long pause", async () => {
  credentials(); vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] }); mock.search.mockResolvedValue([1]);
  await withSupportMailbox("support@example.test", async get => {
    await get("/gmail/v1/users/me/threads");
    expect(mock.close).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(300000);
    await get("/gmail/v1/users/me/threads/100");
    expect(mock.connect).toHaveBeenCalledTimes(2);
    expect(mock.close).toHaveBeenCalledTimes(2);
  });
});
it("handles messages removed between listing and detail without stopping the import", async () => {
  credentials(); mock.search.mockResolvedValue([]);
  await withSupportMailbox("support@example.test", async get => {
    expect((await get("/gmail/v1/users/me/threads/100")).messages).toEqual([]);
    expect(await get("/gmail/v1/users/me/messages/ff")).toBeNull();
  });
});
it("times out a stalled read explicitly and closes the connection", async () => {
  credentials(); vi.useFakeTimers();
  mock.search.mockImplementation(() => new Promise(() => {}));
  const pending = withSupportMailbox("support@example.test", get => get("/gmail/v1/users/me/threads"));
  const assertion = expect(pending).rejects.toThrow("four-minute deadline");
  await vi.advanceTimersByTimeAsync(240000);
  await assertion;
  expect(mock.close).toHaveBeenCalled();
});
it("does not report a closed connection as a missing email", async () => {
  credentials();
  mock.search.mockImplementation(async () => { mock.usable = false; return []; });
  await expect(withSupportMailbox("support@example.test", get => get("/gmail/v1/users/me/messages/ff"))).rejects.toThrow("connection closed");
  expect(mock.close).toHaveBeenCalled();
});
it("reuses only list data, not connections, for pagination", async () => {
  credentials(); mock.search.mockResolvedValue([1]);
  await withSupportMailbox("support@example.test", async get => {
    await get("/gmail/v1/users/me/threads?maxResults=1");
    const page = await get("/gmail/v1/users/me/threads?maxResults=1&pageToken=1");
    expect(page.threads).toEqual([]);
    expect(mock.connect).toHaveBeenCalledTimes(1);
  });
});
