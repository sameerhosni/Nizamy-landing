import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";
import { trackingDisabled } from "./visitorTracking";

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
let sourceProperties: Record<string, unknown> = {};
let localCollector: ((event:string,properties:Record<string,unknown>)=>void) | undefined;
export function setLocalCollector(collector: typeof localCollector) { localCollector = collector; }
export function setSourceProperties(properties: Record<string, unknown>) { sourceProperties = properties; }

export function markPosthogReady() {
  posthogReady = true;
}
export function stopStaffAnalytics() {
  // Covers client-side navigation from a public page after SDKs were initialized.
  if (posthogReady) { posthog.opt_out_capturing(); posthogReady = false; }
  if (mixpanelReady) { mixpanel.opt_out_tracking(); mixpanelReady = false; }
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (trackingDisabled()) return;
  properties = {...sourceProperties, ...properties};
  try { localCollector?.(event,properties); } catch { /* Do not block user actions. */ }
  if (posthogReady) {
    try { posthog.capture(event, properties); } catch { /* Analytics must not break user actions. */ }
  }
  if (mixpanelReady) {
    try { mixpanel.track(event, properties); } catch { /* Analytics must not break user actions. */ }
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
