import type { IncentiveSignupEmailData } from "./mailer";

const HUBSPOT_CONTACTS_PATH = "/crm/v3/objects/contacts";
const HUBSPOT_CONTACTS_SEARCH_PATH = `${HUBSPOT_CONTACTS_PATH}/search`;
const HUBSPOT_REQUEST_TIMEOUT_MS = 8_000;

export type HubspotRequest = (
  path: string,
  init: RequestInit,
) => Promise<Response>;

export type HubspotContactProperties = {
  email: string;
  nizamy_signup_language?: "Arabic" | "English";
  nizamy_lead_source?: "Nizamy landing page";
  nizamy_signup_intent?: string;
  nizamy_claim_result?: "New entitlement awarded" | "Already claimed";
  nizamy_points_entitlement?: number;
  nizamy_submitted_at?: string;
};

export interface HubspotIncentiveContactProperties {
  email: string;
  nizamy_signup_intent: string;
  nizamy_signup_language: "Arabic" | "English";
  nizamy_claim_result: "New entitlement awarded" | "Already claimed";
  nizamy_points_entitlement: number;
  nizamy_submitted_at: string;
  nizamy_lead_source: "Nizamy landing page";
}

const intentLabels = {
  existing_hr: "Already using HR system",
  seeking_hr: "Looking for HR system",
  exploring: "Just exploring",
} as const;

export type HubspotSignupIntent = keyof typeof intentLabels;

export function toHubspotSignupIntentLabel(
  intent: HubspotSignupIntent,
): (typeof intentLabels)[HubspotSignupIntent] {
  return intentLabels[intent];
}

export function toHubspotIncentiveProperties(
  signup: IncentiveSignupEmailData,
): HubspotIncentiveContactProperties {
  return {
    email: signup.email,
    nizamy_signup_intent: toHubspotSignupIntentLabel(signup.intent),
    nizamy_signup_language: signup.language === "ar" ? "Arabic" : "English",
    nizamy_claim_result:
      signup.status === "awarded"
        ? "New entitlement awarded"
        : "Already claimed",
    nizamy_points_entitlement: signup.pointsAwarded,
    nizamy_submitted_at: signup.createdAt,
    nizamy_lead_source: "Nizamy landing page",
  };
}

export async function getDefaultHubspotRequest(): Promise<HubspotRequest> {
  const privateToken = process.env["HUBSPOT_PRIVATE_APP_TOKEN"]?.trim();

  if (privateToken) {
    return (path, init) =>
      fetch(`https://api.hubapi.com${path}`, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${privateToken}`,
        },
      });
  }

  if (
    !process.env["REPLIT_CONNECTORS_HOSTNAME"] &&
    !process.env["REPL_IDENTITY"]
  ) {
    throw new Error(
      "HubSpot contact sync is not configured (set HUBSPOT_PRIVATE_APP_TOKEN outside Replit)",
    );
  }

  // Keep the SDK lazy: self-hosted deployments must not require Replit
  // connector environment variables merely to start the API server.
  const packageName = "@replit/connectors-sdk";
  const { ReplitConnectors } = await import(packageName);
  return (path, init) =>
    new ReplitConnectors().proxy("hubspot", path, init);
}

async function readErrorDetails(response: Response): Promise<string> {
  const body = (await response.text()).slice(0, 1_000).trim();
  return body ? `: ${body}` : "";
}

type HubspotSearchResponse = {
  results?: Array<{
    id?: unknown;
    properties?: { email?: unknown };
  }>;
};

async function searchContactIdByEmail(
  email: string,
  request: HubspotRequest,
  signal: AbortSignal,
): Promise<string | undefined> {
  const response = await request(HUBSPOT_CONTACTS_SEARCH_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
      properties: ["email"],
      limit: 1,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `HubSpot contact search failed (${response.status})${await readErrorDetails(response)}`,
    );
  }

  const body = (await response.json()) as HubspotSearchResponse;
  const match = body.results?.[0];
  return typeof match?.id === "string" ? match.id : undefined;
}

async function writeContact(
  path: string,
  method: "POST" | "PATCH",
  properties: HubspotContactProperties,
  request: HubspotRequest,
  signal: AbortSignal,
): Promise<Response> {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ properties }),
    signal,
  });
}

export async function upsertHubspotContact(
  email: string,
  properties: HubspotContactProperties,
  request?: HubspotRequest,
): Promise<void> {
  const hubspotRequest = request ?? (await getDefaultHubspotRequest());
  // Every search/create/update call shares one deadline.
  const signal = AbortSignal.timeout(HUBSPOT_REQUEST_TIMEOUT_MS);
  const existingId = await searchContactIdByEmail(
    email,
    hubspotRequest,
    signal,
  );
  let response: Response;

  if (existingId) {
    response = await writeContact(
      `${HUBSPOT_CONTACTS_PATH}/${encodeURIComponent(existingId)}`,
      "PATCH",
      properties,
      hubspotRequest,
      signal,
    );
  } else {
    response = await writeContact(
      HUBSPOT_CONTACTS_PATH,
      "POST",
      properties,
      hubspotRequest,
      signal,
    );

    // A form submission or another request may create the same email between
    // our search and create. Resolve that race with one exact-email search and
    // patch rather than creating a duplicate.
    if (response.status === 409) {
      const racedContactId = await searchContactIdByEmail(
        email,
        hubspotRequest,
        signal,
      );
      if (racedContactId) {
        response = await writeContact(
          `${HUBSPOT_CONTACTS_PATH}/${encodeURIComponent(racedContactId)}`,
          "PATCH",
          properties,
          hubspotRequest,
          signal,
        );
      }
    }
  }

  if (!response.ok) {
    throw new Error(
      `HubSpot contact write failed (${response.status})${await readErrorDetails(response)}`,
    );
  }
}

export async function upsertHubspotIncentiveContact(
  signup: IncentiveSignupEmailData,
  request?: HubspotRequest,
): Promise<void> {
  await upsertHubspotContact(
    signup.email,
    toHubspotIncentiveProperties(signup),
    request,
  );
}