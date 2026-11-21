// Deliberately collect named actions, never form values, chat text or query strings.
export const isStaffPage = () => /\/support(?:\/|$)/.test(location.pathname);
export const trackingDisabled = () => isStaffPage() || navigator.doNotTrack === "1" ||
  Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);

let session = crypto.randomUUID();
export function visitSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem("nz_visit_session") || "null");
    if (saved?.id && Date.now() - saved.time < 30 * 60 * 1000) session = saved.id;
    else session = crypto.randomUUID();
    sessionStorage.setItem("nz_visit_session", JSON.stringify({id:session,time:Date.now()}));
  } catch { /* In-memory identity when storage is unavailable. */ }
  return session;
}

export function installVisitorObservers(emit: (event: string, props: Record<string, unknown>) => void) {
  let path = location.pathname;
  let viewed = new Set<string>();
  const forms = new WeakSet<Element>();
  const observed = new WeakSet<Element>();
  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element=entry.target as HTMLElement;
      const id=element.dataset.analyticsSection || element.id;
      if (!entry.isIntersecting) {
        clearTimeout(timers.get(element)); timers.delete(element);
      } else if (id && !viewed.has(id) && !timers.has(element)) {
        timers.set(element,setTimeout(() => {
          timers.delete(element);
          if (!trackingDisabled() && !viewed.has(id)) {
            viewed.add(id);
            emit("section_view",{location:path,target:id});
          }
        },800));
      }
    }
  },{threshold:0.1});
  const observe = () => {
    document.querySelectorAll("section[id], [data-analytics-section]").forEach(el => {
      if (!observed.has(el)) { observed.add(el); observer.observe(el); }
    });
  };
  new MutationObserver(observe).observe(document.documentElement,{childList:true,subtree:true});
  observe();
  const navigation = () => {
    if (location.pathname === path) return;
    path = location.pathname;
    viewed = new Set();
    timers.forEach(clearTimeout); timers.clear();
    if (!trackingDisabled()) emit("attributed_visit",{location:path});
    // Re-observe visible sections after client-side navigation.
    observer.disconnect();
    setTimeout(() => document.querySelectorAll("section[id], [data-analytics-section]").forEach(el=>observer.observe(el)),0);
  };
  for (const method of ["pushState","replaceState"] as const) {
    const original=history[method].bind(history);
    history[method]=(data: unknown, unused: string, url?: string | URL | null) => { original(data,unused,url); navigation(); };
  }
  window.addEventListener("popstate",navigation);
  document.addEventListener("input",event => {
    if (trackingDisabled()) return;
    const form=(event.target as Element)?.closest?.("form");
    if (form && !forms.has(form)) {
      forms.add(form);
      emit("form_started",{location:path,target:form.getAttribute("data-testid") || form.id || form.closest("section")?.id || "form"});
    }
  });
}
