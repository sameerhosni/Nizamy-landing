import { afterEach, describe, expect, it, vi } from "vitest";
import { supportApi, SupportApiError } from "./supportApi";

afterEach(() => vi.unstubAllGlobals());

describe("supportApi.syncInbox", () => {
  it.each([
    { imported: 3, localSynced: true, emailSynced: true },
    { imported: null, localSynced: true, emailSynced: false },
    { imported: 0 },
  ])("preserves the sync payload: %j", async (payload) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
    vi.stubGlobal("fetch", fetchMock);
    expect(await supportApi.syncInbox()).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(`${import.meta.env.BASE_URL}api/support/inbox/sync`, {
      method: "POST", credentials: "same-origin", body: "{}",
      headers: { "X-Support-Request": "1", "Content-Type": "application/json" },
    });
  });
  it.each([409, 500, 401, 403])("rejects HTTP %i instead of returning success", async (status) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Test failure" }), { status })));
    await expect(supportApi.syncInbox()).rejects.toMatchObject({ status, message: "Test failure" });
  });
  it("normalizes a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("PRIVATE_TEST_CONNECTOR_ERROR")));
    await expect(supportApi.syncInbox()).rejects.toEqual(new SupportApiError(0, "Network error"));
  });
  it("rejects a non-JSON server failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("PRIVATE_TEST_CONNECTOR_ERROR", { status: 502 })));
    await expect(supportApi.syncInbox()).rejects.toMatchObject({ status: 502, message: "Request failed (502)" });
  });
});
