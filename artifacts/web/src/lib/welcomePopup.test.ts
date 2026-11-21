import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("Arabic welcome visibility", () => {
  it("shows to a new browser, then remembers it across page loads", async () => {
    let popup = await import("./welcomePopup");
    expect(popup.hasSeenWelcome()).toBe(false);
    popup.markWelcomeSeen();
    expect(popup.hasSeenWelcome()).toBe(true);
    vi.resetModules();
    popup = await import("./welcomePopup");
    expect(popup.hasSeenWelcome()).toBe(true);
  });

  it("does not reopen in the same page if storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const popup = await import("./welcomePopup");
    expect(popup.hasSeenWelcome()).toBe(false);
    popup.markWelcomeSeen();
    expect(popup.hasSeenWelcome()).toBe(true);
  });
});
