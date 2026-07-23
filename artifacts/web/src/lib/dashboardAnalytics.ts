const ENDPOINT =
  "https://709d27e4-fdf1-42ab-8064-ee41ee4591ed-00-3uo3vnwoy8xmj.pike.replit.dev/api/analytics/track";
const SESSION_KEY = "_a_sid";

function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function send(payload: Record<string, string>) {
  const data = JSON.stringify({
    sessionId: getSessionId(),
    referrer: document.referrer || "",
    pageUrl: location.href,
    ...payload,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, data);
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      });
    }
  } catch {
    /* ignore */
  }
}

let initialized = false;

export function initDashboardAnalytics() {
  if (initialized) return;
  initialized = true;

  send({ eventType: "pageview" });

  if ("IntersectionObserver" in window) {
    const viewed: Record<string, boolean> = {};
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          const id = el.id || el.dataset.analyticsSection;
          if (e.isIntersecting && id && !viewed[id]) {
            viewed[id] = true;
            send({
              eventType: "section_view",
              sectionId: id,
              sectionName: el.dataset.analyticsName || id,
            });
          }
        });
      },
      { threshold: 0.4 },
    );
    document
      .querySelectorAll("[data-analytics-section]")
      .forEach((el) => observer.observe(el));
  }
}

export function dashboardTrackLead(meta?: Record<string, unknown>) {
  send({ eventType: "lead", metadata: JSON.stringify(meta || {}) });
}

export function dashboardTrackConversion(meta?: Record<string, unknown>) {
  send({ eventType: "conversion", metadata: JSON.stringify(meta || {}) });
}
