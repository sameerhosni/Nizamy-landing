/**
 * Inbox imports retain original customer questions for staff review. Those are
 * examples of the issue, not staff-authored diagnostic instructions or facts.
 * Keep the stored provenance intact, but never promote it into trusted guidance.
 */
export function trustedDiagnosticGuidance(value: string) {
  return /^\s*Customer question \(remove identifying details before approving\):/i.test(value)
    ? ""
    : value;
}
