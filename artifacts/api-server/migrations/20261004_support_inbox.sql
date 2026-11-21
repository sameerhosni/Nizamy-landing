CREATE TABLE IF NOT EXISTS support_inbox (
 id serial PRIMARY KEY,
 source text NOT NULL CHECK(source IN ('chat','ticket','email','manual')),
 source_id text UNIQUE, title text NOT NULL, question text NOT NULL,
 context text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewed','resolved')),
 case_id integer REFERENCES support_cases(id), created_at timestamptz NOT NULL DEFAULT now()
);