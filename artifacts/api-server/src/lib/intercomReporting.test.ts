import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contactMetadata, listIntercomContacts, listIntercomConversations } from "./intercomReporting";

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubEnv("INTERCOM_ACCESS_TOKEN", "synthetic-test-token");
  vi.stubEnv("INTERCOM_API_REGION", "eu");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const response = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
describe("Intercom reporting boundary", () => {
  it("needs explicit credentials, without a Replit runtime dependency", async () => {
    vi.stubEnv("INTERCOM_ACCESS_TOKEN", "");
    await expect(listIntercomContacts()).rejects.toMatchObject({ code: "not_configured", status: 503 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects arbitrary hosts before sending a credential", async () => {
    vi.stubEnv("INTERCOM_API_REGION", "https://invalid.test");
    await expect(listIntercomContacts()).rejects.toMatchObject({ code: "invalid_region" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("sends exact-email search and opaque pagination to a fixed regional host", async () => {
    fetchMock.mockResolvedValue(response({ data: [{ id: "contact1", name: "Synthetic", email: "test@example.test", created_at: 100, notes: "PRIVATE" }], pages: { next: { starting_after: "next+cursor=" } } }));
    const result = await listIntercomContacts("test@example.test", "cursor+/=");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.eu.intercom.io/contacts/search");
    expect(init.redirect).toBe("error");
    expect(init.headers["Intercom-Version"]).toBe("2.14");
    expect(JSON.parse(init.body)).toMatchObject({ query: { field: "email", operator: "=", value: "test@example.test" }, pagination: { per_page: 30, starting_after: "cursor+/=" } });
    expect(result.nextCursor).toBe("next+cursor=");
    expect(JSON.stringify(result)).not.toContain("PRIVATE");
    expect(result.items[0].createdAt).toBe("1970-01-01T00:01:40.000Z");
  });
  it("uses contact IDs for conversations and strips all message content", async () => {
    fetchMock.mockResolvedValue(response({ conversations: [{ id: "123", state: "open", source: { body: "PRIVATE" }, conversation_parts: ["PRIVATE"], title: "PRIVATE" }], pages: {} }));
    const result = await listIntercomConversations("contact1", "next");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).query).toEqual({ field: "contact_ids", operator: "=", value: "contact1" });
    expect(result).toEqual({ conversations: [{ id: "123", source: "intercom", state: "open", createdAt: null, updatedAt: null }], nextCursor: null });
  });
  it.each([[401, 503, "access_denied"], [403, 503, "access_denied"], [429, 429, "rate_limited"], [500, 502, "upstream_error"], [404, 404, "not_found"]])("sanitizes provider %s", async (upstream, status, code) => {
    fetchMock.mockResolvedValue(response({ message: "PRIVATE_TOKEN_AND_CONTENT" }, upstream as number));
    await expect(listIntercomContacts()).rejects.toMatchObject({ status, code });
  });
  it.each([{ data: {} }, { data: [{ name: "missing ID" }] }, { data: [], pages: { next: "https://evil.test" } }])("rejects malformed success instead of pretending it is empty", async value => {
    fetchMock.mockResolvedValue(response(value));
    await expect(listIntercomContacts()).rejects.toMatchObject({ code: "invalid_response" });
  });
  it("aborts a stalled body read as well as stalled headers", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(async (_url, init) => ({
      ok: true, json: () => new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(new Error("aborted")))),
    }));
    const pending = expect(listIntercomContacts()).rejects.toMatchObject({ code: "timeout", status: 504 });
    await vi.advanceTimersByTimeAsync(12001);
    await pending;
  });
  it("preserves anonymous contacts without inventing identities", () => {
    expect(contactMetadata({ id: "anonymous", external_id: "not-a-website-id" })).toEqual({
      id: "anonymous", source: "intercom", name: null, email: null, role: null, createdAt: null, updatedAt: null, lastSeenAt: null,
    });
  });
});
