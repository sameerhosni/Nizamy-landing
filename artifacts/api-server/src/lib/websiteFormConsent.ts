import type { WebsiteFormInput } from "./websiteFormSubmissionCore";

// Keep text identical to the visible marketing label and submit action.
// The submit label is not a separate explicit processing-consent disclosure.
export const WEBSITE_FORM_CONSENT_COPY = {
  ar: {
    marketing: "أوافق على تلقي رسائل بريد إلكتروني تسويقية من نظامي، ويمكنني إلغاء الاشتراك في أي وقت.",
    processing: "إرسال",
  },
  en: {
    marketing: "I agree to receive marketing emails from Nizamy. I can unsubscribe at any time.",
    processing: "Send",
  },
} as const;

export class MarketingConsentUnavailableError extends Error {
  constructor() {
    super("Marketing consent requires a verified HubSpot subscription type");
    this.name = "MarketingConsentUnavailableError";
  }
}

export class ProcessingConsentRequiredError extends Error {
  constructor() {
    super("Processing consent is required");
    this.name = "ProcessingConsentRequiredError";
  }
}

export function getWebsiteFormConsent(
  input: Pick<WebsiteFormInput, "language" | "marketingOptIn" | "consentToProcess">,
  subscriptionId = process.env.HUBSPOT_MARKETING_SUBSCRIPTION_TYPE_ID,
) {
  const optedIn = input.marketingOptIn === true;
  // Legacy clients with neither consent field retain their original flow.
  // Consent-aware clients must acknowledge the visible processing-consent action.
  if ((input.marketingOptIn !== undefined || input.consentToProcess !== undefined) &&
      input.consentToProcess !== true) {
    throw new ProcessingConsentRequiredError();
  }
  const rawId = subscriptionId?.trim() ?? "";
  const id = Number(rawId);
  // Never guess an account-specific ID, coerce strings into consent, or report
  // success after dropping an opt-in. Ordinary inquiries need no marketing ID.
  if (optedIn && (
    !/^[1-9]\d*$/.test(rawId) ||
    !Number.isSafeInteger(id)
  )) throw new MarketingConsentUnavailableError();

  // Marketing selection does not imply agreement to a processing disclosure.
  const processingAgreed = input.consentToProcess === true;
  if (!processingAgreed && !optedIn) return undefined;
  const copy = WEBSITE_FORM_CONSENT_COPY[input.language];
  return {
    consent: {
      consentToProcess: processingAgreed,
      text: processingAgreed ? copy.processing : copy.marketing,
      // An unchecked box is not a request to unsubscribe an existing contact.
      communications: optedIn
        ? [{ value: true, subscriptionTypeId: id, text: copy.marketing }]
        : [],
    },
  };
}
