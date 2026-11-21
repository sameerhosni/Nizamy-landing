-- Authorized staff replies to customer chats and tickets. Additive only.
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS access_token_hash text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS notify_email text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS notify_email_set_at timestamptz;
CREATE TABLE IF NOT EXISTS staff_replies (
  id serial PRIMARY KEY,
  idempotency_key uuid NOT NULL UNIQUE,
  body_hash text NOT NULL,
  body text NOT NULL,
  conversation_id integer REFERENCES conversations(id) ON DELETE SET NULL,
  message_id integer REFERENCES messages(id) ON DELETE SET NULL,
  ticket_id integer REFERENCES tickets(id) ON DELETE SET NULL,
  target text NOT NULL CHECK (target IN ('chat','ticket')),
  recipient_email text,
  email_status text NOT NULL CHECK (email_status IN ('not_requested','no_address','pending','sending','sent','failed')),
  email_attempts integer NOT NULL DEFAULT 0,
  email_error text,
  email_claimed_at timestamptz,
  email_sent_at timestamptz,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS staff_replies_conversation_idx ON staff_replies(conversation_id);
CREATE INDEX IF NOT EXISTS staff_replies_ticket_idx ON staff_replies(ticket_id);
