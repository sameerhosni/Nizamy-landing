import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import App from "./App";
import "./index.css";

import { POSTHOG_KEY } from "./lib/analytics";

const hostname = window.location.hostname;
const isTrackedDomain =
  hostname.endsWith("nizamy.app") || hostname === "mr-hr-ai-new.replit.app";
if (isTrackedDomain) {
  posthog.init(POSTHOG_KEY, {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
  });
}

createRoot(document.getElementById("root")!).render(<App />);
