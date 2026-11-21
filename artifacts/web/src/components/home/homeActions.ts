/** Same destination as the Navbar start CTA (scrollTo("partner")). */
export function goToStart() {
  document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" });
}

/** Use the site's existing contact section; an Intercom queue can exist without a working launcher. */
export function openChat() {
  document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
}

/** Invoke the existing Messenger API without changing the widget or its configuration. */
export function openSiteChat() {
  if (window.Intercom) {
    window.Intercom("show");
  }
}
