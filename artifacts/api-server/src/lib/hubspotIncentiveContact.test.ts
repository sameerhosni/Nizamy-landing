import assert from "node:assert/strict";
import test from "node:test";
import {
  toHubspotIncentiveProperties,
  upsertHubspotContact,
  upsertHubspotIncentiveContact,
  type HubspotRequest,
} from "./hubspotIncentiveContact";
import type { IncentiveSignupEmailData } from "./mailer";

const awardedSignup: IncentiveSignupEmailData = {
  intent: "exploring",
  email: "visitor@example.com",
  language: "en",
  status: "awarded",
  pointsAwarded: 5000,
  createdAt: "2026-04-01T12:34:56.000Z",
};

type MockResponse = { status?: number; body?: unknown };

function recordingRequest(responses: MockResponse[]) {
  const calls: Array<{ path: string; init: RequestInit }> = [];
  const request: HubspotRequest = async (path, init) => {
    calls.push({ path, init });
    const response = responses.shift();
    assert.ok(response, `Unexpected HubSpot request to ${path}`);
    const status = response.status ?? 200;
    return new Response(
      typeof response.body === "string"
        ? response.body
        : JSON.stringify(response.body ?? {}),
      {
        status,
        headers: { "Content-Type": "application/json" },
      },
    );
  };
  return { calls, request };
}

test("searches then creates a new contact with the reward email fields", async () => {
  const mock = recordingRequest([{ body: { results: [] } }, {}]);
  await upsertHubspotIncentiveContact(awardedSignup, mock.request);

  assert.equal(mock.calls.length, 2);
  assert.equal(mock.calls[0]!.path, "/crm/v3/objects/contacts/search");
  assert.deepEqual(JSON.parse(String(mock.calls[0]!.init.body)), {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: "visitor@example.com",
          },
        ],
      },
    ],
    properties: ["email"],
    limit: 1,
  });
  assert.equal(mock.calls[1]!.path, "/crm/v3/objects/contacts");
  assert.equal(mock.calls[1]!.init.method, "POST");
  assert.deepEqual(JSON.parse(String(mock.calls[1]!.init.body)), {
    properties: {
      email: "visitor@example.com",
      nizamy_signup_intent: "Just exploring",
      nizamy_signup_language: "English",
      nizamy_claim_result: "New entitlement awarded",
      nizamy_points_entitlement: 5000,
      nizamy_submitted_at: "2026-04-01T12:34:56.000Z",
      nizamy_lead_source: "Nizamy landing page",
    },
  });
});

test("patches an existing contact without sending unrelated existing properties", async () => {
  const mock = recordingRequest([
    {
      body: {
        results: [
          {
            id: "contact-123",
            properties: {
              email: awardedSignup.email,
              firstname: "Existing",
              lastname: "Name",
              custom_property: "keep me",
            },
          },
        ],
      },
    },
    {},
  ]);

  await upsertHubspotContact(
    awardedSignup.email,
    {
      email: awardedSignup.email,
      nizamy_signup_language: "Arabic",
      nizamy_lead_source: "Nizamy landing page",
    },
    mock.request,
  );

  assert.equal(
    mock.calls[1]!.path,
    "/crm/v3/objects/contacts/contact-123",
  );
  assert.equal(mock.calls[1]!.init.method, "PATCH");
  assert.deepEqual(JSON.parse(String(mock.calls[1]!.init.body)), {
    properties: {
      email: awardedSignup.email,
      nizamy_signup_language: "Arabic",
      nizamy_lead_source: "Nizamy landing page",
    },
  });
});

test("does not issue a duplicate create when the email already exists", async () => {
  const mock = recordingRequest([
    {
      body: {
        results: [
          { id: "42", properties: { email: awardedSignup.email } },
        ],
      },
    },
    {},
  ]);

  await upsertHubspotIncentiveContact(
    { ...awardedSignup, status: "already_claimed" },
    mock.request,
  );

  assert.deepEqual(
    mock.calls.map(({ init }) => init.method),
    ["POST", "PATCH"],
  );
});

test("surfaces a useful error when HubSpot search fails", async () => {
  const mock = recordingRequest([{ status: 503, body: "mock failure" }]);
  await assert.rejects(
    upsertHubspotIncentiveContact(awardedSignup, mock.request),
    /HubSpot contact search failed \(503\): mock failure/,
  );
});

test("resolves a create race by searching again then patching", async () => {
  const mock = recordingRequest([
    { body: { results: [] } },
    { status: 409, body: "contact exists" },
    {
      body: {
        results: [
          { id: "race-winner", properties: { email: awardedSignup.email } },
        ],
      },
    },
    {},
  ]);

  await upsertHubspotContact(
    awardedSignup.email,
    {
      email: awardedSignup.email,
      nizamy_signup_language: "English",
      nizamy_lead_source: "Nizamy landing page",
    },
    mock.request,
  );

  assert.deepEqual(
    mock.calls.map(({ path, init }) => [path, init.method]),
    [
      ["/crm/v3/objects/contacts/search", "POST"],
      ["/crm/v3/objects/contacts", "POST"],
      ["/crm/v3/objects/contacts/search", "POST"],
      ["/crm/v3/objects/contacts/race-winner", "PATCH"],
    ],
  );
});

test("website-form enrichment omits reward, name, and other contact fields", async () => {
  const mock = recordingRequest([
    {
      body: {
        results: [
          { id: "7", properties: { email: awardedSignup.email } },
        ],
      },
    },
    {},
  ]);
  await upsertHubspotContact(
    awardedSignup.email,
    {
      email: awardedSignup.email,
      nizamy_signup_language: "English",
      nizamy_lead_source: "Nizamy landing page",
    },
    mock.request,
  );

  const properties = JSON.parse(String(mock.calls[1]!.init.body)).properties;
  assert.deepEqual(properties, {
    email: awardedSignup.email,
    nizamy_signup_language: "English",
    nizamy_lead_source: "Nizamy landing page",
  });
  assert.equal("firstname" in properties, false);
  assert.equal("lastname" in properties, false);
  assert.equal("nizamy_claim_result" in properties, false);
});

test("maps existing intent labels without inventing an intent", () => {
  assert.equal(
    toHubspotIncentiveProperties({
      ...awardedSignup,
      intent: "existing_hr",
    }).nizamy_signup_intent,
    "Already using HR system",
  );
});