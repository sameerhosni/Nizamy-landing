CREATE TABLE IF NOT EXISTS traffic_events (
 id bigserial PRIMARY KEY, event_id uuid UNIQUE NOT NULL,
 event text NOT NULL, source text NOT NULL, campaign text NOT NULL DEFAULT '',
 location text NOT NULL DEFAULT '', target text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS traffic_events_date ON traffic_events(created_at);
