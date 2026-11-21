import assert from "node:assert/strict";
import test from "node:test";
import {
  processWebsiteFormSubmissionCore,
  WebsiteFormRequestConflictError,
  WebsiteFormRetryableError,
  type WebsiteFormDependencies,
  type WebsiteFormInput,
} from "./websiteFormSubmissionCore";
import {
  createWebsiteFormDependencies,
  getHubspotFormSubmissionBody,
  getWebsiteContactProperties,
} from "./websiteFormSubmission";
import { renderWebsiteFormNotification } from "./mailer";

const input: WebsiteFormInput = {
  requestId: "2a35525a-3c58-47e2-9809-95833c707819",
  language: "ar",
  intent: "seeking_hr",
  firstname: "Test",
  lastname: "Visitor",
  email: "test@example.com",
  phone: "+966500000000",
  message: "Test message",
  pageUri: "https://mr-hr-ai-new.replit.app/",
  pageName: "Nizamy HR",
};

function dependencies(
  overrides: Partial<WebsiteFormDependencies> = {},
): WebsiteFormDependencies {
  return {
    reserve: async () => ({ kind: "acquired" }),
    release: async () => undefined,
    markAccepted: async () => undefined,
    submitToHubspot: async () => undefined,
    sendNotification: async () => undefined,
    ...overrides,
  };
}

test("reports complete success when HubSpot and email both succeed", async () => {
  const calls: string[] = [];
  const result = await processWebsiteFormSubmissionCore(input, dependencies({
    submitToHubspot: async () => {
      calls.push("hubspot");
    },
    sendNotification: async () => {
      calls.push("email");
    },
  }));

  assert.deepEqual(result, {
    hubspotSubmitted: true,
    notificationEmailSent: true,
  });
  assert.deepEqual(calls, ["hubspot", "email"]);
});

test("does not send email or report success when HubSpot rejects", async () => {
  let emails = 0;
  await assert.rejects(
    processWebsiteFormSubmissionCore(input, dependencies({
      submitToHubspot: async () => {
        throw new Error("HubSpot unavailable");
      },
      sendNotification: async () => {
        emails += 1;
      },
    })),
  );
  assert.equal(emails, 0);
});

test("keeps HubSpot success when the sales email fails", async () => {
  const result = await processWebsiteFormSubmissionCore(input, dependencies({
    submitToHubspot: async () => undefined,
    sendNotification: async () => {
      throw new Error("SMTP unavailable");
    },
  }));

  assert.deepEqual(result, {
    hubspotSubmitted: true,
    notificationEmailSent: false,
  });
});

test("replays accepted Forms result without resending a failed sales email", async () => {
  let forms = 0;
  let emails = 0;
  const deps = createWebsiteFormDependencies(
    async () => { forms++; },
    async () => { emails++; throw new Error("SMTP unavailable"); },
  );
  const first = await processWebsiteFormSubmissionCore(input, deps);
  assert.deepEqual(first, { hubspotSubmitted: true, notificationEmailSent: false });
  assert.deepEqual(await processWebsiteFormSubmissionCore(input, deps), first);
  assert.equal(forms, 1);
  assert.equal(emails, 1);
});

test("deduplicates retries with the same request id", async () => {
  let hubspotCalls = 0;
  let emailCalls = 0;
  const deps = createWebsiteFormDependencies(
    async () => {
      hubspotCalls += 1;
    },
    async () => {
      emailCalls += 1;
    },
  );

  const first = await processWebsiteFormSubmissionCore(input, deps);
  assert.deepEqual(await processWebsiteFormSubmissionCore(input, deps), first);

  assert.equal(hubspotCalls, 1);
  assert.equal(emailCalls, 1);
});

test("different request IDs with identical email and phone both submit without DB or CRM search", async () => {
  const submitted: string[] = [];
  const mailed: string[] = [];
  const deps = createWebsiteFormDependencies(
    async (form) => { submitted.push(form.requestId); },
    async (form) => { mailed.push(form.requestId); },
  );
  const secondId = "879ee2d0-4184-49bf-8e36-3dd8904e4422";
  await processWebsiteFormSubmissionCore(input, deps);
  await processWebsiteFormSubmissionCore({ ...input, requestId: secondId }, deps);
  assert.deepEqual(submitted, [input.requestId, secondId]);
  assert.deepEqual(mailed, submitted);
});

test("rejects a pending race without calling Forms or SMTP", async () => {
  let resolveSubmit!: () => void;
  const blocked = new Promise<void>((resolve) => { resolveSubmit = resolve; });
  let forms = 0;
  let emails = 0;
  const deps = createWebsiteFormDependencies(
    async () => { forms++; await blocked; },
    async () => { emails++; },
  );
  const first = processWebsiteFormSubmissionCore(input, deps);
  // reserve is synchronous before its resolved promise is awaited
  await Promise.resolve();
  await assert.rejects(
    processWebsiteFormSubmissionCore(input, deps),
    WebsiteFormRetryableError,
  );
  resolveSubmit();
  await first;
  assert.equal(forms, 1);
  assert.equal(emails, 1);
});

test("rejects changed-payload request id reuse", async () => {
  const deps = createWebsiteFormDependencies(async () => undefined, async () => undefined);
  await processWebsiteFormSubmissionCore(input, deps);
  await assert.rejects(
    processWebsiteFormSubmissionCore(
      { ...input, message: "changed" },
      deps,
    ),
    WebsiteFormRequestConflictError,
  );
});

test("keeps the idempotency payload stable when only tracking context changes", async () => {
  let submissions = 0;
  const deps = createWebsiteFormDependencies(
    async () => { submissions++; },
    async () => undefined,
  );
  await processWebsiteFormSubmissionCore(input, deps);
  await processWebsiteFormSubmissionCore(
    {
      ...input,
      hutk: "changed-cookie",
      pageName: "Changed title",
      pageUri: "https://mr-hr-ai-new.replit.app/?campaign=retry",
    },
    deps,
  );
  assert.equal(submissions, 1);
});

test("releases a failed Forms attempt so the same ID can retry", async () => {
  let forms = 0;
  let emails = 0;
  const deps = createWebsiteFormDependencies(
    async () => {
      forms++;
      if (forms === 1) throw new Error("Forms unavailable");
    },
    async () => { emails++; },
  );
  await assert.rejects(
    processWebsiteFormSubmissionCore(input, deps),
    /Forms unavailable/,
  );
  assert.deepEqual(await processWebsiteFormSubmissionCore(input, deps), {
    hubspotSubmitted: true,
    notificationEmailSent: true,
  });
  assert.equal(forms, 2);
  assert.equal(emails, 1);
});

test("keeps intent out of the unauthenticated Forms API payload", () => {
  const payload = getHubspotFormSubmissionBody(input);

  assert.deepEqual(
    payload.fields.map(({ name }) => name),
    ["firstname", "lastname", "email", "phone", "message"],
  );
  assert.equal(
    payload.fields.some(({ name }) => name === "nizamy_signup_intent"),
    false,
  );
});

test("maps intent through authenticated contact enrichment without reward fields", () => {
  const properties = getWebsiteContactProperties(input);

  assert.deepEqual(properties, {
    email: input.email,
    nizamy_signup_language: "Arabic",
    nizamy_lead_source: "Nizamy landing page",
    nizamy_signup_intent: "Looking for HR system",
  });
  assert.equal("nizamy_points_entitlement" in properties, false);
  assert.equal("nizamy_claim_result" in properties, false);
});

test("renders the selected reason in the sales notification email", () => {
  const rendered = renderWebsiteFormNotification({
    language: input.language,
    intent: input.intent,
    firstname: input.firstname,
    lastname: input.lastname,
    email: input.email,
    phone: input.phone,
    message: input.message,
    pageUri: input.pageUri,
    submittedAt: "2026-04-01T12:34:56.000Z",
  });

  assert.match(rendered.text, /Reason: Looking for HR system/);
  assert.match(rendered.html, /Looking for HR system/);
});

test("accepts historical website submissions without intent", () => {
  const historicalInput = { ...input, intent: undefined };
  assert.deepEqual(getWebsiteContactProperties(historicalInput), {
    email: input.email,
    nizamy_signup_language: "Arabic",
    nizamy_lead_source: "Nizamy landing page",
  });
  assert.match(
    renderWebsiteFormNotification({
      language: historicalInput.language,
      email: historicalInput.email,
      pageUri: historicalInput.pageUri,
      submittedAt: "2026-04-01T12:34:56.000Z",
    }).text,
    /Reason: —/,
  );
});

test("includes every selected reason in text and HTML sales emails", () => {
  const email = renderWebsiteFormNotification({
    ...input, intents: ["exploring", "seeking_hr"], submittedAt: "2026-04-01T12:34:56.000Z",
  });
  for (const body of [email.text, email.html]) {
    assert.match(body, /Just exploring; Looking for HR system/);
    assert.doesNotMatch(body, /Already using HR system/);
  }
});