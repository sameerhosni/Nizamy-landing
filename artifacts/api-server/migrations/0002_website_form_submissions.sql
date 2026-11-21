CREATE TABLE IF NOT EXISTS "website_form_submissions" (
  "request_id" text PRIMARY KEY NOT NULL,
  "payload_hash" text NOT NULL,
  "normalized_email" text NOT NULL,
  "normalized_phone" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "notification_email_sent" boolean,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "website_form_submissions_email_unique"
  ON "website_form_submissions" ("normalized_email");

CREATE UNIQUE INDEX IF NOT EXISTS "website_form_submissions_phone_unique"
  ON "website_form_submissions" ("normalized_phone")
  WHERE "normalized_phone" IS NOT NULL;