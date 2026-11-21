const KEY = "nizamy_ar_welcome_seen";
let seenInThisPage = false;

/** Anonymous browser preference, not an account or tracking identifier. */
export function hasSeenWelcome() {
  if (seenInThisPage) return true;
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}

export function markWelcomeSeen() {
  seenInThisPage = true;
  try { localStorage.setItem(KEY, "1"); } catch {
    // Storage may be blocked; still avoid reopening within this page session.
  }
}
