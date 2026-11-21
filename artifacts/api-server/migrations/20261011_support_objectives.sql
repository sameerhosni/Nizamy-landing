CREATE TABLE IF NOT EXISTS support_objectives (
  id serial PRIMARY KEY,
  title text NOT NULL CHECK(length(title) BETWEEN 1 AND 200),
  case_id integer REFERENCES support_cases(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS support_gap_evidence (
  id serial PRIMARY KEY,
  inbox_id integer NOT NULL REFERENCES support_inbox(id),
  objective_id integer NOT NULL REFERENCES support_objectives(id),
  state text NOT NULL CHECK(state IN ('suggested','confirmed','resolved','dismissed')),
  question text NOT NULL,
  evidence text NOT NULL,
  source_fingerprint text NOT NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(inbox_id,objective_id)
);
CREATE TABLE IF NOT EXISTS support_gap_history (
  id serial PRIMARY KEY,
  gap_id integer NOT NULL REFERENCES support_gap_evidence(id),
  state text NOT NULL,
  question text NOT NULL,
  evidence text NOT NULL,
  source_fingerprint text NOT NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now()
);
