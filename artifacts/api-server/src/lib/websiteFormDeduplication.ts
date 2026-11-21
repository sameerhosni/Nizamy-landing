import {
  getDefaultHubspotRequest,
  type HubspotRequest,
} from "./hubspotIncentiveContact";

const CONTACT_SEARCH_PATH = "/crm/v3/objects/contacts/search";
const TIMEOUT_MS = 8_000;

export type DuplicateFields = {
  email: boolean;
  phone: boolean;
};

const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
const easternArabicDigits = "۰۱۲۳۴۵۶۷۸۹";

function toAsciiDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndex = arabicDigits.indexOf(digit);
    return String(arabicIndex >= 0 ? arabicIndex : easternArabicDigits.indexOf(digit));
  });
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone?: string): string | undefined {
  if (!phone?.trim()) return undefined;
  let value = toAsciiDigits(phone.trim())
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");

  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (/^05\d{8}$/.test(value)) value = `+966${value.slice(1)}`;
  else if (/^9665\d{8}$/.test(value)) value = `+${value}`;
  return value || undefined;
}

export function phoneSearchVariants(normalizedPhone: string): string[] {
  const variants = new Set([normalizedPhone]);
  if (/^\+9665\d{8}$/.test(normalizedPhone)) {
    const subscriber = normalizedPhone.slice(4);
    variants.add(`0${subscriber}`);
    variants.add(`966${subscriber}`);
    variants.add(`00966${subscriber}`);
  }
  return [...variants];
}

type SearchBody = { total?: number; results?: unknown[] };
type ContactSearchBody = {
  total?: number;
  results?: Array<{
    properties?: { phone?: unknown; mobilephone?: unknown };
  }>;
  paging?: { next?: { after?: string } };
};

type SearchFilter =
  | { propertyName: string; operator: "EQ" | "CONTAINS_TOKEN"; value: string }
  | { propertyName: string; operator: "IN"; values: string[] };

let searchQueue = Promise.resolve();
let lastSearchStartedAt = 0;
const SEARCH_INTERVAL_MS = 260;

async function waitForPace(
  waitMs: number,
  signal?: AbortSignal | null,
): Promise<void> {
  if (signal?.aborted) throw signal.reason;
  if (!waitMs) return;
  await new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, waitMs);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function pacedSearch(
  request: HubspotRequest,
  init: RequestInit,
): Promise<Response> {
  let response!: Response;
  const run = async () => {
    const waitMs = Math.max(
      0,
      SEARCH_INTERVAL_MS - (Date.now() - lastSearchStartedAt),
    );
    await waitForPace(waitMs, init.signal);
    lastSearchStartedAt = Date.now();
    response = await request(CONTACT_SEARCH_PATH, init);
  };
  searchQueue = searchQueue.then(run, run);
  await searchQueue;
  return response;
}

async function hasMatch(
  filters: SearchFilter[],
  request: HubspotRequest,
  signal: AbortSignal,
): Promise<boolean> {
  for (let offset = 0; offset < filters.length; offset += 5) {
    const response = await pacedSearch(request, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filterGroups: filters.slice(offset, offset + 5).map((filter) => ({
          filters: [filter],
        })),
        properties: ["email", "hs_additional_emails", "phone", "mobilephone"],
        limit: 1,
      }),
      signal,
    });
    if (!response.ok) {
      const details = (await response.text()).slice(0, 1_000).trim();
      throw new Error(
        `HubSpot duplicate search failed (${response.status})${details ? `: ${details}` : ""}`,
      );
    }
    const body = (await response.json()) as SearchBody;
    if (
      !Array.isArray(body.results) ||
      (body.total !== undefined &&
        (!Number.isInteger(body.total) || body.total < 0))
    ) {
      throw new Error("HubSpot duplicate search returned an invalid response");
    }
    if (
      (typeof body.total === "number" && body.total > 0) ||
      body.results.length > 0
    ) {
      return true;
    }
  }
  return false;
}

export async function checkHubspotDuplicates(
  email: string,
  phone?: string,
  request?: HubspotRequest,
): Promise<DuplicateFields> {
  const hubspotRequest = request ?? (await getDefaultHubspotRequest());
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const normalizedEmail = normalizeEmail(email);
  const emailDuplicate = await hasMatch(
    [
      { propertyName: "email", operator: "EQ", value: normalizedEmail },
      {
        propertyName: "hs_additional_emails",
        operator: "CONTAINS_TOKEN",
        value: normalizedEmail,
      },
    ],
    hubspotRequest,
    signal,
  );

  let phoneDuplicate = false;
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone) {
    const variants = phoneSearchVariants(normalizedPhone);
    const saudiMobile = /^\+966(5\d{8})$/.exec(normalizedPhone);
    const internationalProperties = [
      "phone",
      "mobilephone",
      "hs_searchable_calculated_international_phone_number",
      "hs_searchable_calculated_international_mobile_number",
    ];
    const phoneFilters: SearchFilter[] = internationalProperties.map(
      (propertyName) => ({ propertyName, operator: "IN", values: variants }),
    );
    if (saudiMobile) {
      for (const propertyName of [
        "hs_searchable_calculated_phone_number",
        "hs_searchable_calculated_mobile_number",
      ]) {
        phoneFilters.push({
          propertyName,
          operator: "IN",
          values: [saudiMobile[1]!, `0${saudiMobile[1]!}`],
        });
      }
    }
    phoneDuplicate = await hasMatch(
      phoneFilters,
      hubspotRequest,
      signal,
    );

    // If the indexed searches miss, compare fully normalized raw values so
    // historical formatting is not silently missed.
    if (!phoneDuplicate) {
      let after: string | undefined;
      let inspected = 0;
      do {
        const response = await pacedSearch(hubspotRequest, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filterGroups: ["phone", "mobilephone"].map((propertyName) => ({
              filters: [{ propertyName, operator: "HAS_PROPERTY" }],
            })),
            properties: ["phone", "mobilephone"],
            limit: 200,
            ...(after ? { after } : {}),
          }),
          signal,
        });
        if (!response.ok) {
          const details = (await response.text()).slice(0, 1_000).trim();
          throw new Error(
            `HubSpot formatted phone scan failed (${response.status})${details ? `: ${details}` : ""}`,
          );
        }
        const body = (await response.json()) as ContactSearchBody;
        if (
          !Array.isArray(body.results) ||
          (body.total !== undefined &&
            (!Number.isInteger(body.total) || body.total < 0))
        ) {
          throw new Error(
            "HubSpot formatted phone scan returned an invalid response",
          );
        }
        inspected += body.results.length;
        phoneDuplicate =
          body.results.some(({ properties }) =>
            [properties?.phone, properties?.mobilephone].some(
              (value) =>
                typeof value === "string" &&
                normalizePhone(value) === normalizedPhone,
            ),
          );
        if (phoneDuplicate) break;
        after = body.paging?.next?.after;
        if (after && inspected >= 10_000) {
          throw new Error(
            "HubSpot formatted phone scan exceeded the CRM search result limit",
          );
        }
      } while (after);
    }
  }

  return { email: emailDuplicate, phone: phoneDuplicate };
}