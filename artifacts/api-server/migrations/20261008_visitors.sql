CREATE TABLE IF NOT EXISTS visitor_profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS visitor_identities (
  kind text NOT NULL CHECK (kind IN ('browser','email','phone')),
  value text NOT NULL,
  profile_id uuid NOT NULL REFERENCES visitor_profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (kind,value)
);
CREATE INDEX IF NOT EXISTS visitor_identities_profile ON visitor_identities(profile_id);
ALTER TABLE traffic_events ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES visitor_profiles(id);
ALTER TABLE traffic_events ADD COLUMN IF NOT EXISTS session_id text NOT NULL DEFAULT '';
ALTER TABLE traffic_events ADD COLUMN IF NOT EXISTS device text NOT NULL DEFAULT '';
ALTER TABLE traffic_events ADD COLUMN IF NOT EXISTS browser text NOT NULL DEFAULT '';
ALTER TABLE traffic_events ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS traffic_events_profile_date ON traffic_events(profile_id,created_at DESC);
CREATE INDEX IF NOT EXISTS visitor_profiles_last_seen ON visitor_profiles(last_seen DESC);
