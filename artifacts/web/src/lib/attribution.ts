import { track, setSourceProperties, setLocalCollector } from "./analytics";
import { installVisitorObservers, trackingDisabled, visitSession } from "./visitorTracking";
import { captureAcquisition, type Attribution } from "./acquisitionState";
export type { Attribution } from "./acquisitionState";

let attribution: Attribution;
export function getAttribution() { return attribution; }
export function initAttribution() {
  if (trackingDisabled()) return;
  const fallback = new Map<string,string>();
  const storage = {
    getItem: (k: string) => {
      try { return localStorage.getItem(k) || fallback.get(k) || null; } catch { return fallback.get(k) || null; }
    },
    setItem: (k: string,v: string) => {
      fallback.set(k,v);
      try { localStorage.setItem(k,v); } catch { /* Preserve in memory for this page. */ }
    },
  } as Storage;
  let capturedUrl = "";
  const refresh = () => {
    if (trackingDisabled() || capturedUrl === location.href) return;
    capturedUrl = location.href;
    attribution = captureAcquisition(new URL(location.href), document.referrer, visitSession(), storage);
  };
  refresh();
  for (const method of ["pushState","replaceState"] as const) {
    const original = history[method].bind(history);
    history[method] = (data, unused, url) => { original(data, unused, url); refresh(); };
  }
  window.addEventListener("popstate", refresh);
  const dimensions = () => ({source:attribution.latest.source,medium:attribution.latest.medium,
    campaign:attribution.latest.campaign,ad:attribution.latest.content,first_source:attribution.first.source});
  const collectorFetch = window.fetch.bind(window);
  let lastSpecificClick = -Infinity;
  setLocalCollector((event, props) => {
    if (trackingDisabled()) return;
    const aliases: Record<string,string> = {calculator_tier_selected:"package_selected",
      store_click_ios:"app_download_clicked",store_click_android:"app_download_clicked",app_badge_clicked:"app_download_clicked"};
    const originalEvent=event;
    event=aliases[event] || event;
    if (!["attributed_visit","website_click","submission_succeeded","chat_started","chat_ticket_created",
      "section_view","package_selected","package_cta_clicked","app_download_clicked","calculator_used","form_started","chatbot_opened"].includes(event)) return;
    if (["package_selected","package_cta_clicked","app_download_clicked","chatbot_opened"].includes(event)) lastSpecificClick=performance.now();
    const plans: Record<string,string>={Standard:"Free",Growth:"Starter",GrowthPlus:"Growth",Pro:"Pro"};
    const target = event.startsWith("package_") ? plans[String(props.tier)] || "" :
      event==="app_download_clicked" ? String(props.store || props.target || (originalEvent==="store_click_ios"?"iOS":"Android")) :
      event==="calculator_used" ? `${plans[String(props.tier)] || ""} / ${Number(props.employees) || 0}` : String(props.target || "");
    const data = {id:crypto.randomUUID(),event,visitor:attribution.session,session:visitSession(),
      source:String(attribution.latest.source||"direct").slice(0,200),campaign:String(attribution.latest.campaign||"").slice(0,200),
      location:String(props.location||props.endpoint||location.pathname).split("?")[0].slice(0,200),
      target:target.slice(0,180)+(props.position!==undefined?` #${props.position}`:"")};
    const send = () => collectorFetch(`${import.meta.env.BASE_URL}api/traffic-event`,{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),keepalive:true
    });
    // A retry keeps the same event ID, so a response lost after saving cannot duplicate it.
    void send().then(response => {if (response.status>=500) setTimeout(()=>{void send().catch(()=>{});},1000);})
      .catch(()=>{setTimeout(()=>{void send().catch(()=>{});},1000);});
  });
  setSourceProperties(dimensions());
  track("attributed_visit", dimensions());
  installVisitorObservers(track);
  document.addEventListener("click", event => {
    if (trackingDisabled() || performance.now()-lastSpecificClick<50) return;
    const target = (event.target as Element)?.closest?.("a,button");
    if (!target) return;
    const section = target.closest("section,header,footer,nav");
    const href=target.getAttribute("href") || "";
    if (/^https:\/\/(apps\.apple\.com|play\.google\.com)\//.test(href)) {
      track("app_download_clicked",{target:href.includes("apple.com")?"iOS":"Android",location:location.pathname});
      return;
    }
    // Do not capture arbitrary button text (it may contain personal information).
    track("website_click", {...dimensions(), location:section?.id || section?.tagName.toLowerCase() || "page",
      target:target.getAttribute("data-testid") || target.getAttribute("data-analytics-name") || target.tagName.toLowerCase(),
      position:section ? Array.from(section.querySelectorAll("a,button")).indexOf(target) : -1});
  });
  const original = window.fetch.bind(window);
  window.fetch = async (input, options) => {
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    const eligible = !trackingDisabled() && url.origin === location.origin && url.pathname.startsWith(`${import.meta.env.BASE_URL}api/`);
    if (!eligible) return original(input, options);
    const headers = new Headers(options?.headers || (input instanceof Request ? input.headers : undefined));
    refresh();
    headers.set("X-Nizamy-Attribution", encodeURIComponent(JSON.stringify(attribution)));
    const response = await original(input, {...options,headers});
    const method = options?.method || (input instanceof Request ? input.method : "GET");
    if (response.ok && method.toUpperCase() === "POST") {
      const path = url.pathname;
      if (/\/(lead|ticket|submit|signup|incentive-signup|hubspot-form)$/.test(path)) track("submission_succeeded",{...dimensions(),endpoint:path});
      if (path.endsWith("/openai/conversations")) track("chat_started",dimensions());
    }
    return response;
  };
}
