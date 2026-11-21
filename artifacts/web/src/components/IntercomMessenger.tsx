import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";

const APP_ID = "lrn5nc6m";
type IntercomApi = (command: string, settings?: Record<string, unknown>) => void;
declare global {
  interface Window { Intercom?: IntercomApi }
}
let loading: Promise<void> | undefined;

function loadMessenger() {
  if (loading) return loading;
  if (window.Intercom) return Promise.resolve();
  // Intercom's loader expects its official command queue to exist while it
  // downloads the runtime asynchronously.
  const queue = function () { queue.q.push(arguments); };
  queue.q = [] as IArguments[];
  window.Intercom = queue;
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${APP_ID}`;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = undefined;
      if (window.Intercom === queue) delete window.Intercom;
      script.remove();
      reject(new Error("Intercom Messenger could not load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** Anonymous visitors only; never pass staff identity or unverified customer IDs. */
export function IntercomMessenger() {
  const { language } = useLanguage();
  const currentLanguage = useRef(language);
  currentLanguage.current = language;
  const booted = useRef(false);

  useEffect(() => {
    let active = true;
    loadMessenger().then(() => {
      if (!active) return;
      window.Intercom?.("boot", {
        app_id: APP_ID,
        api_base: "https://api-iam.intercom.io",
        language_override: currentLanguage.current,
      });
      booted.current = true;
    }).catch(error => console.error("Intercom Messenger:", error));
    return () => {
      active = false;
      if (booted.current) window.Intercom?.("shutdown");
      booted.current = false;
    };
  }, []);

  useEffect(() => {
    if (booted.current) window.Intercom?.("update", { language_override: language });
  }, [language]);
  return null;
}
