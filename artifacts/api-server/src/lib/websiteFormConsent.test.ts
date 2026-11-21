import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { SubmitHubspotFormBody } from "@workspace/api-zod";
import { getWebsiteFormConsent, MarketingConsentUnavailableError, ProcessingConsentRequiredError, WEBSITE_FORM_CONSENT_COPY } from "./websiteFormConsent";
import { createWebsiteFormDependencies, getHubspotFormSubmissionBody } from "./websiteFormSubmission";
import { processWebsiteFormSubmissionCore, WebsiteFormRequestConflictError, type WebsiteFormInput } from "./websiteFormSubmissionCore";

const input: WebsiteFormInput = {
  requestId: "2a35525a-3c58-47e2-9809-95833c707819",
  language: "ar",
  email: "consent-test@example.com",
  pageUri: "https://example.com/",
  pageName: "Consent test",
  consentToProcess: true,
  marketingOptIn: false,
};

test("only strict boolean consent is accepted at the API boundary", () => {
  for (const marketingOptIn of [true, false, undefined]) {
    assert(SubmitHubspotFormBody.safeParse({ ...input, marketingOptIn }).success);
  }
  for (const marketingOptIn of ["true", "false", 1, null]) {
    assert(!SubmitHubspotFormBody.safeParse({ ...input, marketingOptIn }).success);
  }
  assert(!SubmitHubspotFormBody.safeParse({ ...input, consentToProcess: "true" }).success);
});

test("Arabic and English opt-ins use the configured subscription and exact displayed disclosure", () => {
  const component = readFileSync("artifacts/web/src/components/HubSpotForm.tsx", "utf8");
  for (const language of ["ar", "en"] as const) {
    const consent = getWebsiteFormConsent({ ...input, language, marketingOptIn: true }, "98765");
    assert.deepEqual(consent, {
      consent: {
        consentToProcess: true,
        text: WEBSITE_FORM_CONSENT_COPY[language].processing,
        communications: [{
          value: true,
          subscriptionTypeId: 98765,
          text: WEBSITE_FORM_CONSENT_COPY[language].marketing,
        }],
      },
    });
    assert(component.includes(WEBSITE_FORM_CONSENT_COPY[language].marketing));
    assert(component.includes(WEBSITE_FORM_CONSENT_COPY[language].processing));
  }
});

test("unchecked or omitted marketing consent never subscribes or unsubscribes", () => {
  for (const marketingOptIn of [false, undefined]) {
    const body = getWebsiteFormConsent({ ...input, marketingOptIn }, "");
    assert.deepEqual(body?.consent.communications, []);
  }
  assert.equal(getWebsiteFormConsent({ language: "ar" }, ""), undefined);
  const body = getHubspotFormSubmissionBody(input);
  assert.deepEqual(body.legalConsentOptions?.consent.communications, []);
  assert(!body.fields.some(field => /consent|subscription|marketing/i.test(field.name)));
});

test("missing, malformed or unsafe subscription IDs cannot silently drop an opt-in", () => {
  for (const id of ["", "abc", "0", "-1", "12.5", "1e5", "9007199254740992"]) {
    assert.throws(() => getWebsiteFormConsent({ ...input, marketingOptIn: true }, id), MarketingConsentUnavailableError);
  }
});

test("Send stays short and the marketing option is hidden without changing its submitted value", () => {
  const component = readFileSync("artifacts/web/src/components/HubSpotForm.tsx", "utf8");
  assert.match(component, /marketingOptIn: true/);
  assert.match(component, /<div hidden className="space-y-3 border-t border-slate-200 pt-3">/);
  assert.match(component, /marketingOptIn: values\.marketingOptIn/);
  assert.match(component, /setField\("marketingOptIn", event\.target\.checked\)/);
  assert.match(component, /consentToProcess: true/);
  assert(!component.includes('name="consentToProcess"'));
  assert(!component.includes("checkbox-processing-consent"));
  assert(!component.includes("values.consentToProcess"));
  assert.match(component, /submit: isAr \? "إرسال" : "Send"/);
  assert(!component.includes("{copy.processing}"));
  assert(!component.includes('aria-describedby={`${fieldId}-processing`}'));
  assert(!component.includes("بالضغط على إرسال"));
  assert(!component.includes("By clicking Send"));
  assert.equal(WEBSITE_FORM_CONSENT_COPY.ar.processing, "إرسال");
  assert.equal(WEBSITE_FORM_CONSENT_COPY.en.processing, "Send");
  for (const language of ["ar", "en"] as const) {
    assert(component.includes(WEBSITE_FORM_CONSENT_COPY[language].processing));
  }
  assert(!component.includes("text-processing-consent"));
  for (const consentToProcess of [false, undefined]) {
    for (const marketingOptIn of [true, false]) {
      assert.throws(
        () => getWebsiteFormConsent({ ...input, marketingOptIn, consentToProcess }, "98765"),
        ProcessingConsentRequiredError,
      );
    }
  }
});

test("changed consent cannot reuse an accepted request ID", async () => {
  let calls = 0;
  const deps = createWebsiteFormDependencies(async () => { calls++; }, async () => {});
  await processWebsiteFormSubmissionCore(input, deps);
  await assert.rejects(
    processWebsiteFormSubmissionCore({ ...input, marketingOptIn: true }, deps),
    WebsiteFormRequestConflictError,
  );
  assert.equal(calls, 1);
});

test("configuration failure sends no inquiry or email and allows a deliberate unchecked retry", async () => {
  let forms = 0;
  let emails = 0;
  const deps = createWebsiteFormDependencies(async form => {
    getWebsiteFormConsent(form, "");
    forms++;
  }, async () => { emails++; });
  await assert.rejects(
    processWebsiteFormSubmissionCore({ ...input, marketingOptIn: true }, deps),
    MarketingConsentUnavailableError,
  );
  assert.equal(forms, 0);
  assert.equal(emails, 0);
  await processWebsiteFormSubmissionCore(input, deps);
  assert.equal(forms, 1);
  assert.equal(emails, 1);
});
