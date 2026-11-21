import { beforeEach, describe, expect, it } from "vitest";
import { captureAcquisition } from "./acquisitionState";
const visit = (path: string, session = "visit-a", referrer = "") =>
  captureAcquisition(new URL(`https://nizamy.example${path}`), referrer, session, localStorage, 1800000000000);
beforeEach(() => localStorage.clear());
describe("form acquisition persistence", () => {
  it("keeps all campaign fields through navigation and reload", () => {
    const first = visit("/?utm_source=meta&utm_medium=cpc&utm_campaign=launch&utm_content=ad1&utm_term=hr&utm_marketer=agency-a");
    const next = visit("/contact", "visit-a", "https://nizamy.example/");
    expect(next).toEqual(first);
    expect(next.first.marketer).toBe("agency-a");
    expect(next.first.term).toBe("hr");
  });
  it("preserves first visit and records a subsequent direct visit", () => {
    visit("/?utm_source=meta");
    const next = visit("/", "visit-b");
    expect(next.first.source).toBe("meta");
    expect(next.latest.source).toBe("direct");
  });
  it("updates last campaign without changing first", () => {
    visit("/?utm_source=meta");
    const next = visit("/?utm_source=google&utm_campaign=new&utm_content=ad2");
    expect(next.first.source).toBe("meta");
    expect(next.latest.campaign).toBe("new");
    expect(next.latest.content).toBe("ad2");
  });
  it("handles corrupt or expired data", () => {
    localStorage.setItem("nizamy_acquisition_v1", "{broken");
    expect(visit("/").first.source).toBe("direct");
    localStorage.setItem("nizamy_acquisition_v1", JSON.stringify({expires:1,value:{}}));
    expect(visit("/?gclid=test").first.source).toBe("google");
  });
  it("does not include arbitrary query parameters or referrer paths", () => {
    const value = visit("/?email=private", "visit-a", "https://example.com/private");
    expect(JSON.stringify(value)).not.toContain("private");
    expect(value.first.source).toBe("example.com");
  });
});
