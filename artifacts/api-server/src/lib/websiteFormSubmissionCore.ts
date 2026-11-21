import { createHash } from "node:crypto";
import { normalizeEmail, normalizePhone } from "./websiteFormDeduplication";

export type WebsiteFormInput = {
  requestId: string;
  language: "ar" | "en";
  intent?: "existing_hr" | "exploring" | "seeking_hr";
  intents?: ("existing_hr" | "exploring" | "seeking_hr")[];
  marketingOptIn?: boolean;
  consentToProcess?: boolean;
  firstname?: string;
  lastname?: string;
  email: string;
  phone?: string;
  message?: string;
  pageUri: string;
  pageName: string;
  hutk?: string;
};

export type WebsiteFormResult = {
  hubspotSubmitted: true;
  notificationEmailSent: boolean;
};

export type ReservationResult =
  | { kind: "acquired" }
  | { kind: "replay"; result: WebsiteFormResult }
  | { kind: "pending" }
  | { kind: "request_conflict" };

export type WebsiteFormDependencies = {
  reserve: (
    input: WebsiteFormInput,
    payloadHash: string,
  ) => Promise<ReservationResult>;
  release: (requestId: string, payloadHash: string) => Promise<void>;
  markAccepted: (
    requestId: string,
    payloadHash: string,
    notificationEmailSent: boolean | null,
  ) => Promise<void>;
  submitToHubspot: (input: WebsiteFormInput) => Promise<void>;
  sendNotification: (input: WebsiteFormInput) => Promise<void>;
};

export class WebsiteFormRequestConflictError extends Error {
  constructor() {
    super("requestId was already used with different form data");
    this.name = "WebsiteFormRequestConflictError";
  }
}

export class WebsiteFormRetryableError extends Error {
  constructor(message = "Form submission is still being processed") {
    super(message);
    this.name = "WebsiteFormRetryableError";
  }
}

function payloadHash(input: WebsiteFormInput): string {
  // Tracking context can legitimately change between retries (cookie/title/URL)
  // and is not user-edited form data.
  const formPayload = {
    language: input.language,
    intent: input.intent,
    intents: input.intents && [...new Set(input.intents)].sort(),
    firstname: input.firstname,
    lastname: input.lastname,
    email: input.email,
    phone: input.phone,
    message: input.message,
    marketingOptIn: input.marketingOptIn === true,
    consentToProcess: input.consentToProcess === true,
  };
  return createHash("sha256").update(JSON.stringify(formPayload)).digest("hex");
}

export async function processWebsiteFormSubmissionCore(
  unnormalizedInput: WebsiteFormInput,
  dependencies: WebsiteFormDependencies,
): Promise<WebsiteFormResult> {
  const input = {
    ...unnormalizedInput,
    email: normalizeEmail(unnormalizedInput.email),
    phone: normalizePhone(unnormalizedInput.phone),
  };
  const hash = payloadHash(input);
  const reservation = await dependencies.reserve(input, hash);

  if (reservation.kind === "replay") return reservation.result;
  if (reservation.kind === "request_conflict") {
    throw new WebsiteFormRequestConflictError();
  }
  if (reservation.kind === "pending") throw new WebsiteFormRetryableError();

  let hubspotAccepted = false;
  try {
    await dependencies.submitToHubspot(input);
    hubspotAccepted = true;
    await dependencies.markAccepted(input.requestId, hash, null);

    try {
      await dependencies.sendNotification(input);
      await dependencies.markAccepted(input.requestId, hash, true);
      return { hubspotSubmitted: true, notificationEmailSent: true };
    } catch {
      await dependencies.markAccepted(input.requestId, hash, false);
      return { hubspotSubmitted: true, notificationEmailSent: false };
    }
  } catch (error) {
    if (!hubspotAccepted) {
      await dependencies.release(input.requestId, hash);
    }
    throw error;
  }
}