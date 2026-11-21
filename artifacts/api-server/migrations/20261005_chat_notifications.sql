CREATE TABLE IF NOT EXISTS chat_notifications (
  public_id text PRIMARY KEY,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);