CREATE TABLE IF NOT EXISTS "incentive_signups" (
  "id" serial PRIMARY KEY NOT NULL,
  "intent" text NOT NULL,
  "email" text,
  "mobile" text,
  "points_awarded" integer DEFAULT 5000 NOT NULL,
  "language" text DEFAULT 'ar' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "incentive_signups_email_unique" UNIQUE("email"),
  CONSTRAINT "incentive_signups_mobile_unique" UNIQUE("mobile")
);