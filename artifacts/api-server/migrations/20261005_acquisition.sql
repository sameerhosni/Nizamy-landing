CREATE TABLE IF NOT EXISTS acquisition_records (
  id bigserial PRIMARY KEY,
  kind text NOT NULL,
  record_id text NOT NULL,
  attribution jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(kind,record_id)
);
