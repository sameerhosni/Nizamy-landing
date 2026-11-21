# Intercom visitor reporting

Visitor activity has separate Website and Intercom views. Intercom is queried on
demand by the API server; no background import or database migration is required.
Website counts and timelines are not inflated with Intercom contacts.

## Server setup (Replit or self-hosted Kubernetes)

The Replit connector is optional and is not used at runtime.

1. An authorized Intercom workspace administrator creates an access token with
   **Read users and companies** and **Read conversations** permissions. Do not
   grant write access for reporting.
2. Store it as the **server-only secret `INTERCOM_ACCESS_TOKEN`** using the
   deployment's secret manager. On Kubernetes inject it into the API container
   with a Secret `secretKeyRef`, not in source, a ConfigMap, frontend variables,
   Docker build arguments or committed manifests.
3. Set `INTERCOM_API_REGION` to `us` (default), `eu`, or `au`, matching the Intercom
   workspace data region. Only these fixed provider hosts are allowed.
4. Restart the API service and sign into the staff portal. Open Visitor activity
   → Intercom. Verify contacts, next/previous pages, exact-email search, and a
   contact's conversation list. Repeat after rotating/revoking credentials.

The Messenger app ID is not an API access token. Installing Messenger does not
authorize reporting, activate Fin or backfill website tracking. This code does
not configure or publish any deployment. Without a token, the Website view keeps
working and Intercom shows an explicit configuration message.

## Data and identity boundaries

- REST API version is pinned to 2.14. Contact and conversation pages contain at
  most 30 records, following opaque `starting_after` cursors.
- Only contact ID/name/email/role/timestamps and conversation ID/state/timestamps
  leave the server. Provider response bodies can contain message content; that
  content is discarded, not logged, stored, or sent to the browser. Full
  conversation/detail/transcript endpoints are not requested.
- Conversation membership uses Intercom's `contact_ids`, never email or name.
- Website profile candidates use exact normalized email only. Both sources may
  contain self-reported addresses: matches are explicitly **unverified**, even
  when there is only one. No records are merged or written. Shared addresses
  remain uncertain. Names, phones, external IDs, and anonymous browser IDs are
  not assumed to represent the same person.
- These are live contact/conversation snapshots, not historical message events.
  Timestamps retain their meaning (created, updated, last seen).
- Staff sessions protect every endpoint. Responses are `no-store`; Intercom
  React Query entries expire immediately when unmounted. Provider auth errors do
  not log the staff user out; staff session expiry does.
- Requests have a 12-second deadline, including response body reads. Rate limits,
  missing credentials, revoked permissions, missing contacts, malformed data and
  network errors are surfaced, not disguised as empty results. No automatic
  retry loop or exhaustive workspace crawl is performed.

## Verification without credentials

Run `pnpm --filter @workspace/api-server exec vitest run src/lib/intercomReporting.test.ts src/routes/intercomVisitors.test.ts`
and `pnpm --filter @workspace/web exec vitest run src/components/IntercomVisitors.test.tsx`.
Tests use synthetic fixtures and do not read/write customer data.
Live workspace access was not authorized during implementation; the deployment
administrator must complete setup before real Intercom records can be verified.
