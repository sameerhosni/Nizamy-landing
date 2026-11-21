import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IntercomVisitors } from "./IntercomVisitors";
let client: QueryClient;
const onAuth = vi.fn(), onWebsite = vi.fn();
const contact = { id: "c1", source: "intercom", name: "Synthetic Person", email: "test@example.test", createdAt: null, updatedAt: null, lastSeenAt: null };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
beforeEach(() => { vi.clearAllMocks(); client = new QueryClient({ defaultOptions: { queries: { retry: false } } }); });
afterEach(() => { cleanup(); client.clear(); vi.unstubAllGlobals(); });
function open(l: "en" | "ar" = "en") {
  render(<QueryClientProvider client={client}><IntercomVisitors l={l} onAuth={onAuth} onWebsite={onWebsite} /></QueryClientProvider>);
}
it.each(["en", "ar"] as const)("shows configuration errors and retries in %s without signing staff out", async l => {
  const fetchMock = vi.fn().mockResolvedValue(json({ code: "not_configured" }, 503));
  vi.stubGlobal("fetch", fetchMock); open(l);
  expect((await screen.findByRole("alert")).textContent).toContain("INTERCOM_ACCESS_TOKEN");
  fetchMock.mockResolvedValue(json({ items: [], nextCursor: null, fetchedAt: new Date().toISOString() }));
  fireEvent.click(screen.getByText(l === "en" ? "Retry" : "إعادة المحاولة"));
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(onAuth).not.toHaveBeenCalled();
});
it("paginates contacts, resets cursor for email search, and shows source-labeled activity and candidate links", async () => {
  const requests: URL[] = [];
  vi.stubGlobal("fetch", vi.fn(async input => {
    const url = new URL(String(input), "https://test.local"); requests.push(url);
    if (url.pathname.endsWith("/activity")) return json({ contact, conversations: [{ id: "123", source: "intercom", state: "open", createdAt: null, updatedAt: null }], candidates: [{ profileId: "website1", basis: "exact_email_unverified" }], nextCursor: "conversation-next", fetchedAt: new Date().toISOString() });
    return json({ items: [contact], nextCursor: url.searchParams.has("cursor") ? null : "opaque+/=", fetchedAt: new Date().toISOString() });
  }));
  open();
  fireEvent.click(await screen.findByText("Synthetic Person"));
  expect(await screen.findByText(/exact email, unverified/)).toBeTruthy();
  expect(screen.getByText("Intercom · #123")).toBeTruthy();
  fireEvent.click(screen.getByText(/View website profile/)); expect(onWebsite).toHaveBeenCalledWith("website1");
  fireEvent.click(screen.getAllByText("Next")[1]);
  await waitFor(() => expect(requests.some(u => u.searchParams.get("cursor") === "conversation-next")).toBe(true));
  fireEvent.click(screen.getAllByText("Next")[0]);
  await waitFor(() => expect(requests.some(u => u.searchParams.get("cursor") === "opaque+/=")).toBe(true));
  fireEvent.change(screen.getByLabelText("Exact email address"), { target: { value: "Other@Example.test" } });
  fireEvent.click(screen.getByText("Search"));
  await waitFor(() => expect(requests.at(-1)?.searchParams.get("email")).toBe("other@example.test"));
  expect(requests.at(-1)?.searchParams.has("cursor")).toBe(false);
  expect(screen.queryByText("Intercom · #123")).toBeNull();
});
it("forwards staff session expiry to the sign-in boundary", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ error: "Staff sign-in required" }, 401)));
  open(); await waitFor(() => expect(onAuth).toHaveBeenCalledWith(expect.objectContaining({ status: 401 })));
});
