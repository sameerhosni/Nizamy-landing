# Website marketing consent

## Verified mapping and processing requirement

The Nizamy portal's CRM contact-property metadata identifies **Marketing
Information** as subscription type **3672270952** (property
`hs_email_optout_3672270952`). Portal identity was separately confirmed as
`149373460`. This non-secret ID is configured in the Replit shared environment;
the self-hosted deployment still requires its own configuration and release.

A live Forms submission with marketing permission and `consentToProcess: false`
was rejected with HTTP 400, `MISSING_PROCESSING_CONSENT`. The user subsequently
requested a Send-only button and removal of the processing notice entirely.
The existing submit-based processing flag is preserved, but its recorded text
now matches only the visible “إرسال” / “Send” action, not the removed disclosure.
Do not describe this as a separately obtained explicit processing consent.
The screenshot showed Marketing Information as an available option, not yet
selected in the email draft.

## Verification status

The earlier checkbox-based Arabic browser flow was submitted once with both checkboxes explicitly
selected. The app returned HTTP 200 with HubSpot acceptance and sales-notification
success. A separate CRM read confirmed creation of the authorized test contact,
and its processing legal-basis history records “Freely given consent from
contact” with a FORM source.

The available CRM subscription opt-out property was null with no history.
That is not evidence of a marketing opt-in or opt-out. The operator subsequently
provided a HubSpot **Communication subscriptions → History** screenshot showing
the authorized test contact's **Marketing Information** entry with new status
**Opted in**, legal basis **Freely given consent from contact**, and an
**API_SUBMISSION** explanation containing the Arabic marketing-consent wording.
This verifies that HubSpot recorded the test marketing opt-in, not just that it
accepted a form request. The screenshot does not establish email delivery or
show the event timestamp; it shows subscription history rather than a new API read.
No marketing campaign was sent. Earlier browser checks also confirmed that the
optional marketing-unchecked path sends false; that used a mocked response
rather than a second live contact. Those live checks predate the button-wording
change; no additional live submission was made for that presentation change.

## Configuration required before rollout

Set `HUBSPOT_MARKETING_SUBSCRIPTION_TYPE_ID` on the API server to the numeric
subscription type used by the intended HubSpot marketing email in portal
`149373460`. This is a non-secret account-specific identifier, **not** a form ID,
contact property, or marketing-contact status. Do not use an example/default ID.
Configure the self-hosted server separately from Replit; restart after changing it.

Confirm the same subscription type in both website forms:
- Arabic: `0c83c892-5129-4d80-9c06-821490fb0981`
- English: `3333869c-bbf7-4d14-aa50-96482624d6c6`

The existing connector's CRM permissions do not include Forms, Communication
Preferences, or Marketing Email access. A reconnection with the same permission
set does not grant those scopes. The matching CRM property identified the
subscription ID, but detailed subscription-status verification and marketing
sends still require appropriate permissions or inspection in HubSpot.

## Behavior

- Every instance retains the selected marketing default, but the option is now
  hidden at the user's explicit request. Visitors cannot uncheck it in the UI.
  This hidden default is not affirmative opt-in;
  do not represent this UI as a verified explicit-consent mechanism.
- The processing checkbox and notice are removed. The button says only
  “إرسال” / “Send”. The existing submission flag remains true on submit, with
  only that visible action text recorded, never the removed processing statement.
  This does not establish a separate explicit processing consent.
  Marketing selection stays independent.
  The API rejects consent-aware submissions without processing consent before
  contacting HubSpot. Legacy requests with neither flag retain their old flow.
- The server sends opted-in communication consent through
  `legalConsentOptions.consent.communications` with the configured
  `subscriptionTypeId` and the existing Arabic/English wording. This wording is
  now hidden, not a disclosure shown to visitors; the visibility change must
  not be represented as evidence of explicit consent.
- An unchecked box sends no communication consent and makes no unsubscribe call.
- Requests from older clients do not gain consent by default.
- An opted-in request without a valid mapping fails **before** the inquiry is
  submitted. The UI explicitly says it was not sent and lets the visitor retry
  later or deliberately uncheck marketing consent to send only the inquiry.
- Consent is part of retry identity. Changing the checkbox creates a new request
  ID; the server rejects reuse of an accepted ID with different consent.
- Submission acceptance is not proof of a recorded subscription or delivery.

## Rollout and delivery verification

The earlier Arabic test's marketing opt-in is verified by the operator's
subscription-history screenshot. The checklist below remains applicable to
rollout, the final button-based flow, and an eventual one-recipient delivery test;
it is not a claim that the earlier test subscription is still unverified.

1. Obtain the intended email's name/link, its subscription type name and ID, and
   an address the operator controls. Do not invent a recipient or use a customer.
2. Confirm both forms' consent settings and the email use that same type.
3. Submit the updated form with the checkbox selected using the controlled address.
4. Inspect that contact's **Communication subscriptions** in HubSpot. Confirm the
   correct type, opt-in status, consent wording/source, and timestamp. Check spam
   quarantine or double-opt-in requirements if absent/pending.
5. Confirm an unchecked submission does not add a subscription or unsubscribe an
   existing subscriber. Prefer a second controlled address for the negative case.
6. Only after consent verification, perform a new marketing send scoped to the
   approved test recipient. Confirm its delivery/status. Marketing-contact status,
   double opt-in, suppression, and other eligibility rules may still block delivery.
7. Do not release a general campaign based on a mocked test or an HTTP 200.

API reference:
https://developers.hubspot.com/docs/api-reference/legacy/marketing/forms/v3-legacy/submit-data-unauthenticated
