import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PublicChat } from "./PublicChat";
vi.mock("./ChatWidget", () => ({ ChatWidget: () => <button>Existing public chat</button> }));
vi.mock("./IntercomMessenger", () => ({ IntercomMessenger: () => <div>Intercom Messenger</div> }));
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });
it("allows an explicit legacy chat opt-out", () => {
  vi.stubEnv("VITE_INTERCOM_MESSENGER_ENABLED", "false");
  render(<PublicChat />);
  expect(screen.getByRole("button", { name: "Existing public chat" })).toBeTruthy();
  expect(screen.queryByText("Intercom Messenger")).toBeNull();
});
it.each([undefined, "", "true"])("shows Intercom by default (%s)", value => {
  vi.stubEnv("VITE_INTERCOM_MESSENGER_ENABLED", value);
  render(<PublicChat />);
  expect(screen.getByText("Intercom Messenger")).toBeTruthy();
  expect(screen.queryByRole("button")).toBeNull();
});
