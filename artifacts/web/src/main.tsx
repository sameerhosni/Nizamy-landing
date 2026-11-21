import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import App from "./App";
import { setBaseUrl } from "@workspace/api-client-react";
import "./index.css";
import { initAttribution } from "./lib/attribution";
import { trackingDisabled } from "./lib/visitorTracking";

import {
  POSTHOG_KEY,
  initMixpanel,
  markPosthogReady,
} from "./lib/analytics";

const hostname = window.location.hostname;
const isTrackedDomain =
  hostname.endsWith("nizamy.app") || hostname === "mr-hr-ai-new.replit.app";
if (isTrackedDomain && !trackingDisabled()) {
  initMixpanel();
  posthog.init(POSTHOG_KEY, {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    // Analytics only: never show remotely configured PostHog surveys on the site.
    disable_surveys: true,
  });
  markPosthogReady();
}

// Served under a path: API calls must include the base (e.g. /ai-position/api/...).
setBaseUrl(import.meta.env.BASE_URL);
initAttribution();
createRoot(document.getElementById("root")!).render(<App />);
