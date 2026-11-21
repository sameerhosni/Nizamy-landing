import content from "./data/homepageContent.json";

export const HERO_INTERVAL_MS = 3000;
export const HERO_SLIDE_COUNT = content.hero.slides.length;

export type HeroState = { index: number };
export type HeroAction = { type: "tick" } | { type: "select"; index: number };

export const initialHeroState: HeroState = { index: 0 };

/** Ticks loop through every configured slide, including after a manual selection. */
export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  if (action.type === "select") {
    const index = ((action.index % HERO_SLIDE_COUNT) + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT;
    return { index };
  }
  return { ...state, index: (state.index + 1) % HERO_SLIDE_COUNT };
}

export function shouldAutoRotate(o: { reducedMotion: boolean; hidden: boolean }) {
  return !o.reducedMotion && !o.hidden;
}
