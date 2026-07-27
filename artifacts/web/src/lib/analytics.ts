import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

export const POSTHOG_KEY = "phc_mPnDY7ZwMNWfjF97z3neHyicudVR7rZJ6AaUw2vsAQGw";
export const MIXPANEL_TOKEN = "c3155bec9cb32c2ef466799e6560462e";

let mixpanelReady = false;

export function initMixpanel() {
  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: true,
    record_sessions_percent: 0,
    persistence: "localStorage",
  });
  mixpanelReady = true;
}

let posthogReady = false;

export function markPosthogReady() {
  posthogReady = true;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (posthogReady) {
    posthog.capture(event, properties);
  }
  if (mixpanelReady) {
    mixpanel.track(event, properties);
  }
}

export function identifyLead(
  email: string,
  properties: Record<string, unknown>,
) {
  const id = email.trim().toLowerCase();
  if (posthogReady) {
    posthog.identify(id, properties);
  }
  if (mixpanelReady) {
    mixpanel.identify(id);
    mixpanel.people.set({ $email: id, ...properties });
  }
}
