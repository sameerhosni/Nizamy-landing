CREATE TABLE IF NOT EXISTS posthog_visits (
 event_id text PRIMARY KEY,
 source text NOT NULL,
 campaign text NOT NULL,
 location text NOT NULL,
 created_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS posthog_visits_date ON posthog_visits(created_at);
