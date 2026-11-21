import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Support } from "./Support";

const locale = vi.hoisted(() => ({ language: "en" }));
vi.mock("@/lib/i18n", () => ({ useLanguage: () => ({
  language: locale.language, dir: locale.language === "ar" ? "rtl" : "ltr", toggleLanguage: vi.fn(),
}) }));
vi.mock("@/lib/analytics", () => ({ stopStaffAnalytics: vi.fn() }));
vi.mock("@/components/SupportTraffic", () => ({ SupportTraffic: () => null }));
vi.mock("@/pages/SupportVisitors", () => ({ SupportVisitors: () => null }));
vi.mock("@/components/ChatRelevanceReview", () => ({ ChatRelevanceReview: () => null }));

// Exercise the real page, React Query lifecycle, and supportApi fetch wrapper.
// All endpoints are intercepted; these synthetic records never enter a database.
const item = (id: number) => ({
  id, source: "manual", title: `Synthetic question ${id}`, question: "Test question",
  status: "new", caseId: null, createdAt: "2026-01-01T00:00:00Z",
});
let items = [item(1)];
let syncReply: () => Promise<Response>;
let inboxReply: () => Response;
let inboxReads: number;
let syncCalls: number;
let client: QueryClient;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
beforeEach(() => {
  items = [item(1)];
  inboxReads = 0;
  syncCalls = 0;
  inboxReply = () => json({ items });
  syncReply = async () => json({ imported: 2, localSynced: true, emailSynced: true });
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    if (url.endsWith("/session")) return json({ email: "staff@example.invalid" });
    if (url.endsWith("/cases")) return json({ cases: [] });
    if (url.includes("/inbox?")) { inboxReads++; return inboxReply(); }
    if (url.endsWith("/inbox/sync")) { syncCalls++; return syncReply(); }
    throw new Error(`Unexpected test request: ${url}`);
  }));
  client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
});
afterEach(() => { cleanup(); client.clear(); vi.unstubAllGlobals(); });

async function open(language: string) {
  locale.language = language;
  render(<QueryClientProvider client={client}><Support /></QueryClientProvider>);
  await screen.findByTestId("card-inbox-1");
  return screen.getByTestId("button-sync") as HTMLButtonElement;
}

describe.each([
  { lang: "en", success: "2 new question(s) imported.", partial: "Website conversations synced, but email import did not finish.", failed: "Source sync could not complete." },
  { lang: "ar", success: "تم استيراد 2 سؤال جديد.", partial: "تمت مزامنة محادثات الموقع", failed: "تعذر إكمال مزامنة المصادر." },
])("inbox sync in $lang", ({ lang, success, partial, failed }) => {
  it.each(["local refresh", "inbox refetch"])("keeps questions visible after a later %s failure and clears the warning on retry", async (failure) => {
    const button = await open(lang);
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe(success));
    inboxReply = failure === "local refresh"
      ? () => json({ items, localSynced: false })
      : () => json({ error: "PRIVATE_TEST_CONNECTOR_ERROR" }, 500);
    // Same query refetch used by the inbox polling interval, without a 30s sleep.
    await act(async () => { await client.refetchQueries({ queryKey: ["support", "inbox"] }); });
    expect(screen.getByTestId("card-inbox-1")).toBeTruthy();
    expect((await screen.findByRole("alert")).textContent).toContain(lang === "en" ? "Questions could not be refreshed." : "تعذر تحديث الأسئلة.");
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.body.textContent).not.toContain("PRIVATE_TEST_CONNECTOR_ERROR");
    inboxReply = () => json({ items: [item(1), item(2)], localSynced: true });
    fireEvent.click(screen.getByTestId("button-inbox-retry"));
    await screen.findByTestId("card-inbox-2");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows a safe error rather than an empty inbox when the first read fails", async () => {
    inboxReply = () => json({ error: "PRIVATE_TEST_CONNECTOR_ERROR" }, 500);
    locale.language = lang;
    render(<QueryClientProvider client={client}><Support /></QueryClientProvider>);
    await screen.findByTestId("button-inbox-retry");
    expect(screen.getByRole("alert").textContent).toContain(lang === "en" ? "Questions could not be refreshed." : "تعذر تحديث الأسئلة.");
    expect(document.body.textContent).not.toContain("PRIVATE_TEST_CONNECTOR_ERROR");
    expect(screen.queryByTestId("card-inbox-1")).toBeNull();
  });

  it("refreshes local questions after partial success and replaces earlier success with a warning", async () => {
    const button = await open(lang);
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe(success));
    expect(inboxReads).toBe(2);
    let finish!: (r: Response) => void;
    syncReply = () => new Promise(resolve => { finish = resolve; });
    fireEvent.click(button);
    await waitFor(() => expect(button.disabled).toBe(true));
    expect(screen.queryByRole("status")).toBeNull();
    fireEvent.click(button);
    expect(syncCalls).toBe(2);
    items = [item(1), item(2)];
    await act(async () => finish(json({ imported: null, localSynced: true, emailSynced: false })));
    await screen.findByTestId("card-inbox-2");
    expect(screen.getByTestId("card-inbox-1")).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain(partial));
    expect(screen.getByRole("status").textContent).not.toContain(success);
    expect(screen.getByRole("status").textContent).not.toContain(lang === "en" ? "0 new question" : "تم استيراد 0");
    expect(inboxReads).toBe(3);
    expect(button.disabled).toBe(false);
  });

  it.each([500, 409, 0])("keeps loaded questions on failure %i, suppresses stale success and connector details, and permits retry", async (status) => {
    const button = await open(lang);
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe(success));
    syncReply = async () => {
      if (!status) throw new Error("PRIVATE_TEST_CONNECTOR_ERROR");
      return json({ error: "PRIVATE_TEST_CONNECTOR_ERROR" }, status);
    };
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain(failed));
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.body.textContent).not.toContain("PRIVATE_TEST_CONNECTOR_ERROR");
    expect(screen.getByTestId("card-inbox-1")).toBeTruthy();
    expect(inboxReads).toBe(2);
    expect(button.disabled).toBe(false);
    syncReply = async () => json({ imported: 2, localSynced: true, emailSynced: true });
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe(success));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(inboxReads).toBe(3);
  });
});
