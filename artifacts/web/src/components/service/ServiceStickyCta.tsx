import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import { explorerCopy } from "@/pages/serviceInteractionCopy";

/** Mobile-only bar; appears after the hero and hides while the enquiry form is on screen. */
export function ServiceStickyCta({ pageKey }: { pageKey: string }) {
  const { language } = useLanguage();
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById("service-enquiry");
    const io = el ? new IntersectionObserver(([e]) => setAtForm(e.isIntersecting)) : undefined;
    if (el) io?.observe(el);
    return () => { window.removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, []);

  const show = pastHero && !atForm;
  return (
    <div aria-hidden={!show} className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#C9E0EF] bg-[#F7FAFD]/95 p-3 transition-transform motion-reduce:transition-none md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}>
      <a href="#service-enquiry" tabIndex={show ? 0 : -1} data-testid={`link-${pageKey}-sticky-contact`}
        onClick={() => {
          track("service_page_cta_click", { service_page: pageKey, cta: "sticky_contact", language, destination: "#service-enquiry" });
          setTimeout(() => document.getElementById("service-enquiry")?.focus({ preventScroll: true }), 50);
        }}
        className="flex w-full items-center justify-center rounded-full bg-[#153957] px-6 py-3 text-sm font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1689DC]">
        {explorerCopy[pageKey][language as "en" | "ar"].stickyCta}
      </a>
    </div>
  );
}
