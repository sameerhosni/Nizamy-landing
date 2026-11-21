import { isMailerConfigured, sendWebsiteFormNotification, sendWebsiteWelcome } from "./mailer";
import { smtpFailureDetails } from "./smtpFailure";
import {
  toHubspotSignupIntentLabel,
  upsertHubspotContact,
  type HubspotContactProperties,
} from "./hubspotIncentiveContact";
import { logger } from "./logger";
import { getWebsiteFormConsent } from "./websiteFormConsent";
import {
  processWebsiteFormSubmissionCore,
  type WebsiteFormDependencies,
  type WebsiteFormInput,
  type WebsiteFormResult,
  WebsiteFormRetryableError,
} from "./websiteFormSubmissionCore";
export type { WebsiteFormInput, WebsiteFormResult } from "./websiteFormSubmissionCore";

export const HUBSPOT_PORTAL_ID = "149373460";
export const HUBSPOT_FORM_IDS = {
  ar: "0c83c892-5129-4d80-9c06-821490fb0981",
  en: "3333869c-bbf7-4d14-aa50-96482624d6c6",
} as const;

export function getWebsiteContactProperties(
  input: WebsiteFormInput,
): HubspotContactProperties {
  const primaryIntent = input.intents?.[0] ?? input.intent;
  return {
    email: input.email,
    nizamy_signup_language: input.language === "ar" ? "Arabic" : "English",
    nizamy_lead_source: "Nizamy landing page",
    ...(primaryIntent
      ? { nizamy_signup_intent: toHubspotSignupIntentLabel(primaryIntent) }
      : {}),
  };
}

export function getHubspotFormSubmissionBody(input: WebsiteFormInput) {
  const fields = [
    ["firstname", input.firstname],
    ["lastname", input.lastname],
    ["email", input.email],
    ["phone", input.phone],
    ["message", input.message],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
    .map(([name, value]) => ({ name, value: value.trim() }));

  return {
    fields,
    legalConsentOptions: getWebsiteFormConsent(input),
    context: {
      ...(input.hutk ? { hutk: input.hutk } : {}),
      pageUri: input.pageUri,
      pageName: input.pageName,
    },
  };
}

export async function submitToHubspot(input: WebsiteFormInput): Promise<void> {
  const response = await fetch(
    `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_IDS[input.language]}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getHubspotFormSubmissionBody(input)),
      signal: AbortSignal.timeout(12_000),
    },
  );

  if (!response.ok) {
    throw new Error(`HubSpot rejected website form (${response.status})`);
  }

  try {
    await upsertHubspotContact(input.email, getWebsiteContactProperties(input));
  } catch (error) {
    // The public form has already been accepted. This enrichment is
    // intentionally non-fatal and never writes reward/entitlement fields.
    logger.error(
      { err: error, requestId: input.requestId },
      "HubSpot accepted website form but contact enrichment failed",
    );
  }
}

async function sendNotification(input: WebsiteFormInput): Promise<void> {
  try {
    const deliveries = await Promise.allSettled([sendWebsiteWelcome(input.email, input.language), sendWebsiteFormNotification({
      language: input.language,
      intent: input.intent,
      intents: input.intents,
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      phone: input.phone,
      message: input.message,
      pageUri: input.pageUri,
      submittedAt: new Date().toISOString(),
    })]);
    if (deliveries.some(result => result.status === "rejected")) throw new Error("Form email delivery failed");
  } catch (error) {
    logger.error(
      { requestId: input.requestId, smtp: smtpFailureDetails(error, isMailerConfigured()) },
      "Website form sales notification failed",
    );
    throw error;
  }
}

const RETRY_TTL_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 10_000;

type RequestState = {
  hash: string;
  result?: WebsiteFormResult;
  inFlight: boolean;
  expiresAt?: number;
};

export function createWebsiteFormDependencies(
  submit: WebsiteFormDependencies["submitToHubspot"] = submitToHubspot,
  notify: WebsiteFormDependencies["sendNotification"] = sendNotification,
): WebsiteFormDependencies {
  // Request IDs only: no contact uniqueness checks. This bounded cache protects
  // retries within this process, not across restarts or multiple server instances.
  // Never evict pending submissions: that could submit the same in-flight ID twice.
  const requests = new Map<string, RequestState>();
  return {
    reserve: async (input, hash) => {
      const now = Date.now();
      const existing = requests.get(input.requestId);
      if (existing && (existing.expiresAt === undefined || existing.expiresAt > now)) {
        if (existing.hash !== hash) return { kind: "request_conflict" };
        return existing.result
          ? { kind: "replay", result: existing.result }
          : { kind: "pending" };
      }
      if (existing) requests.delete(input.requestId);
      if (requests.size >= MAX_REQUESTS) {
        for (const [id, state] of requests) {
          if (!state.inFlight && state.expiresAt !== undefined && state.expiresAt <= now) requests.delete(id);
        }
        // Evict only completed entries, oldest first. If all entries are still
        // pending, fail closed rather than lose in-flight idempotency protection.
        for (const [id, state] of requests) {
          if (requests.size < MAX_REQUESTS) break;
          if (!state.inFlight) requests.delete(id);
        }
        if (requests.size >= MAX_REQUESTS) throw new WebsiteFormRetryableError();
      }
      requests.set(input.requestId, { hash, inFlight: true });
      return { kind: "acquired" };
    },
    release: async (requestId, hash) => {
      const state = requests.get(requestId);
      if (state?.hash === hash && !state.result) requests.delete(requestId);
    },
    markAccepted: async (requestId, hash, notificationEmailSent) => {
      const state = requests.get(requestId);
      if (!state || state.hash !== hash) throw new Error("Website form reservation was lost");
      state.result = { hubspotSubmitted: true, notificationEmailSent: notificationEmailSent ?? false };
      if (notificationEmailSent !== null) {
        state.inFlight = false;
        state.expiresAt = Date.now() + RETRY_TTL_MS;
      }
    },
    submitToHubspot: submit,
    sendNotification: notify,
  };
}

const defaultDependencies = createWebsiteFormDependencies();

export async function processWebsiteFormSubmission(
  input: WebsiteFormInput,
  dependencies: WebsiteFormDependencies = defaultDependencies,
): Promise<WebsiteFormResult> {
  return processWebsiteFormSubmissionCore(input, dependencies);
}