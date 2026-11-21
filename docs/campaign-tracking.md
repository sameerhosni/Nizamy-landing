# Campaign tracking

Staff can use Support → Traffic to inspect first-party event counts by source
and campaign, recent events, and server-confirmed acquisition records. This
does not depend on PostHog. Reports cover 1, 7, 30 days or All time; support-page activity
is excluded from collection. Visits are page visits, not unique people.
Historical clicks before this collector was deployed cannot be reconstructed.

## PostHog visit history

Run `node lib/db/import-posthog.mjs` with `POSTHOG_PERSONAL_API_KEY` and the
target `DATABASE_URL` to import retained website `$pageview` events. This is
a manual backfill, not an ongoing sync. Event IDs make repeat runs idempotent.
The importer checks the fetched count against PostHog and retains timestamps,
source, campaign, and hostname/path; it does not store visitor identifiers or
URL query strings. Mobile screen events and historical clicks are excluded.

Reports use PostHog visits through the latest imported timestamp and local
visits afterward, avoiding overlap without assuming cross-provider visitor IDs.
The imported project history includes all website hosts represented in PostHog.
Backfilling the workspace database does not backfill the separately hosted live
database. Run the migration and importer there when deploying this feature.

Use the existing PostHog project. Events include attributed_visit,
website_click, submission_succeeded, chat_started and chat_ticket_created.
Existing calculator, plan, popup and app-store events also receive source,
medium, campaign, ad and first_source properties.

In PostHog, create a funnel from attributed_visit to submission_succeeded
or chat_ticket_created, broken down by source and campaign. For clicks,
break website_click down by location, target and position. Element positions
are zero-based within each section. Existing semantic CTA events are preferable
for long-term comparisons across layout changes.

Append these query strings to the actual landing URL:

- Meta: ?utm_source=meta&utm_medium=paid_social&utm_campaign=launch&utm_content=video_01
- Google: ?utm_source=google&utm_medium=cpc&utm_campaign=hr_search&utm_content=ad_01
- Controlled ChatGPT links: ?utm_source=chatgpt&utm_medium=referral&utm_campaign=product_recommendation

Google auto-tagging should remain enabled. Tracking doesn't remove click IDs
from the URL. Uncontrolled ChatGPT referrals are recognized when the browser
provides their referrer. Otherwise they may appear as direct traffic.

First and latest identifiable touches are retained for 90 days in browser
storage (expiry renews with visits). Direct returns keep the previous source.
Cleared storage, different devices and blocked tracking limit attribution.
The new collection respects browser Do Not Track and Global Privacy Control.
Existing third-party analytics have their own consent configuration; this is
not a site-wide consent manager.

Attribution accompanies same-origin API requests. Successful submissions
are stored in acquisition_records, linked by response ID or request ID when
available. Ticket summaries and sales notifications include visitor-reported
source details. Sources are not trusted proof of ad delivery.

No form fields or chat text are added by this click instrumentation.
Avoid personal information in campaign tags.
No live dashboard or ad-account conversion configuration is created by this
code change. Configure the funnel in the existing PostHog dashboard after
deployment. This does not measure ad spend or confirm app installations.
