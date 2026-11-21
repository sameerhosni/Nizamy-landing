-- Additive only: no changes to source chats or approved guidance.
ALTER TABLE support_inbox
  ADD COLUMN relevance text NOT NULL DEFAULT 'pending' CHECK (relevance IN ('pending','related','excluded')),
  ADD COLUMN relevance_version integer NOT NULL DEFAULT 0,
  ADD COLUMN scope_assessment jsonb,
  ADD COLUMN relevance_reviewed_at timestamptz;

CREATE TABLE support_relevance_audit (
  id serial PRIMARY KEY,
  inbox_id integer NOT NULL REFERENCES support_inbox(id),
  decision text NOT NULL CHECK (decision IN ('pending','related','excluded')),
  reason text NOT NULL,
  reviewed_by text NOT NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now()
);