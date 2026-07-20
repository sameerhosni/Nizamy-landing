import posthog from "posthog-js";

export const POSTHOG_KEY = "phc_mPnDY7ZwMNWfjF97z3neHyicudVR7rZJ6AaUw2vsAQGw";

export function track(event: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

export function identifyLead(
  email: string,
  properties: Record<string, unknown>,
) {
  if (!posthog.__loaded) return;
  posthog.identify(email.trim().toLowerCase(), properties);
}
