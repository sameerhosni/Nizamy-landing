import assert from "node:assert/strict";
import test from "node:test";
import {
  checkHubspotDuplicates,
  normalizeEmail,
  normalizePhone,
  type DuplicateFields,
} from "./websiteFormDeduplication";
import type { HubspotRequest } from "./hubspotIncentiveContact";

function searchMock(matches: Record<string, boolean>) {
  const calls: Array<Record<string, unknown>> = [];
  const startedAt: number[] = [];
  const request: HubspotRequest = async (_path, init) => {
    startedAt.push(Date.now());
    const body = JSON.parse(String(init.body)) as {
      filterGroups: Array<{
        filters: Array<{
          propertyName: string;
          value?: string;
          values?: string[];
        }>;
      }>;
    };
    calls.push(body);
    const hasMatch = body.filterGroups.some(({ filters }) => {
      const filter = filters[0]!;
      return (filter.values ?? [filter.value]).some(
        (value) => matches[`${filter.propertyName}:${value}`],
      );
    });
    return new Response(
      JSON.stringify({ total: hasMatch ? 1 : 0, results: hasMatch ? [{}] : [] }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  return { calls, request, startedAt };
}

test("normalizes email casing and Saudi mobile equivalents including Arabic digits", () => {
  assert.equal(normalizeEmail("  PERSON@Example.COM "), "person@example.com");
  for (const phone of [
    "05 1234-5678",
    "+966 51 234 5678",
    "00966-51-234-5678",
    "٠٥١٢٣٤٥٦٧٨",
  ]) {
    assert.equal(normalizePhone(phone), "+966512345678");
  }
  assert.equal(normalizePhone("+44 20 7946 0958"), "+442079460958");
  assert.equal(normalizePhone(""), undefined);
});

test("finds a secondary email and normalized mobilephone duplicate", async () => {
  const mock = searchMock({
    "hs_additional_emails:person@example.com": true,
    "mobilephone:00966512345678": true,
  });
  const result: DuplicateFields = await checkHubspotDuplicates(
    "PERSON@example.com",
    "051 234 5678",
    mock.request,
  );
  assert.deepEqual(result, { email: true, phone: true });
  assert.equal(mock.calls.length, 2);
  assert.ok(mock.startedAt[1]! - mock.startedAt[0]! >= 200);
  assert.ok(
    mock.calls.every(
      (body) =>
        (
          body as {
            filterGroups: unknown[];
          }
        ).filterGroups.length <= 5,
    ),
  );
  assert.ok(
    mock.calls.some((body) =>
      JSON.stringify(body).includes('"propertyName":"hs_additional_emails"'),
    ),
  );
  assert.ok(
    mock.calls.some((body) =>
      JSON.stringify(body).includes('"propertyName":"mobilephone"'),
    ),
  );
});

test("surfaces HubSpot search failures instead of failing open", async () => {
  const request: HubspotRequest = async () =>
    new Response("unavailable", { status: 503 });
  await assert.rejects(
    checkHubspotDuplicates("person@example.com", undefined, request),
    /duplicate search failed \(503\)/,
  );
});

test("uses HubSpot's verified calculated phone property", async () => {
  const mock = searchMock({
    "hs_searchable_calculated_international_mobile_number:+966501234567": true,
  });
  const result = await checkHubspotDuplicates(
    "new@example.com",
    "+966 50 123 4567",
    mock.request,
  );
  assert.deepEqual(result, { email: false, phone: true });
  assert.equal(mock.calls.length, 2);
  const phoneBody = mock.calls[1] as {
    filterGroups: Array<{
      filters: Array<{ operator: string; values?: string[] }>;
    }>;
  };
  assert.equal(phoneBody.filterGroups.length, 5);
  assert.ok(
    phoneBody.filterGroups.every(
      ({ filters }) =>
        filters[0]?.operator === "IN" &&
        Array.isArray(filters[0].values),
    ),
  );
});

test("normalizes formatted raw HubSpot phone and mobilephone values before matching", async () => {
  const request: HubspotRequest = async (_path, init) => {
    const body = JSON.parse(String(init.body)) as {
      filterGroups: Array<{
        filters: Array<{ propertyName: string; operator: string }>;
      }>;
    };
    const isScan = body.filterGroups.some(
      ({ filters }) => filters[0]?.operator === "HAS_PROPERTY",
    );
    return new Response(
      JSON.stringify(
        isScan
          ? {
              total: 1,
              results: [
                {
                  properties: {
                    phone: "",
                    mobilephone: "+966 50-123-4567",
                  },
                },
              ],
            }
          : { total: 0, results: [] },
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  assert.deepEqual(
    await checkHubspotDuplicates(
      "new@example.com",
      "٠٥٠١٢٣٤٥٦٧",
      request,
    ),
    { email: false, phone: true },
  );
});

test("rejects an unknown successful response shape instead of failing open", async () => {
  let calls = 0;
  const request: HubspotRequest = async () => {
    calls += 1;
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  await assert.rejects(
    checkHubspotDuplicates("new@example.com", "0501234567", request),
    /invalid response/,
  );
  assert.equal(calls, 1);
});