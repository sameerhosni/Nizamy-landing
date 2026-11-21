CREATE TABLE IF NOT EXISTS support_login (
 email text PRIMARY KEY, code_hash text NOT NULL,
 expires_at timestamptz NOT NULL, requested_at timestamptz NOT NULL,
 attempts integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS support_sessions (
 token_hash text PRIMARY KEY, email text NOT NULL, expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS support_cases (
 id serial PRIMARY KEY, title text NOT NULL, keywords text NOT NULL DEFAULT '',
 diagnostic_questions text NOT NULL DEFAULT '', resolution text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','disabled')),
 source text NOT NULL DEFAULT 'manual', source_id text UNIQUE,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS support_feedback (
 id serial PRIMARY KEY, case_id integer NOT NULL REFERENCES support_cases(id),
 comment text NOT NULL, helpful boolean NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO support_cases(title,keywords,diagnostic_questions,source_id)
VALUES (
 'Points not increasing | النقاط لا تزيد',
 'points balance rewards رصيد نقاط مكافآت',
 'Ask which balance is meant and whether the problem still persists. Request the account login email and screenshots of the home screen and points page for the same account. Do not repeat questions already answered. No confirmed resolution has been established.',
 'seed:points-diagnostic'
) ON CONFLICT(source_id) DO NOTHING;