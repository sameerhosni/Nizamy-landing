import { describe, expect, it } from "vitest";
import { HERO_INTERVAL_MS, HERO_SLIDE_COUNT, heroReducer, initialHeroState, shouldAutoRotate } from "./heroRotation";

describe("hero rotation", () => {
  it("loops through all seven panels including shift planning", () => {
    let s = initialHeroState;
    const seen = [s.index];
    expect(HERO_SLIDE_COUNT).toBe(7);
    for (let i = 0; i < HERO_SLIDE_COUNT; i++) { s = heroReducer(s, { type: "tick" }); seen.push(s.index); }
    expect(seen).toEqual([0, 1, 2, 3, 4, 5, 6, 0]);
  });

  it("uses a three-second interval and continues after selection", () => {
    expect(HERO_INTERVAL_MS).toBe(3000);
    const s = heroReducer(initialHeroState, { type: "select", index: 2 });
    expect(s).toEqual({ index: 2 });
    expect(heroReducer(s, { type: "tick" }).index).toBe(3);
  });

  it.each([4, 5, 6])("continues cycling after selecting panel %i", (index) => {
    const s = heroReducer(initialHeroState, { type: "select", index });
    expect(s).toEqual({ index });
    expect(heroReducer(s, { type: "tick" }).index).toBe((index + 1) % HERO_SLIDE_COUNT);
  });

  it("pauses for reduced motion or a hidden browser tab", () => {
    const base = { reducedMotion: false, hidden: false };
    expect(shouldAutoRotate(base)).toBe(true);
    for (const k of Object.keys(base) as (keyof typeof base)[]) {
      expect(shouldAutoRotate({ ...base, [k]: true })).toBe(false);
    }
  });
});
