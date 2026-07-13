# Nizamy

A bilingual (EN/AR, full RTL) high-converting landing page for Nizamy (نظامي, formerly Mr-Hr) — an AI-powered HR system for Saudi SMEs that returns up to 30% of subscription back to the customer. Includes a live return calculator and a Design Partner lead capture form backed by Postgres.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Email env: `SMTP_HOST`/`SMTP_PORT`/`SMTP_USERNAME`/`SMTP_PASSWORD` (Gmail App Password), `SMTP_FROM`, `SENDER_NAME` (optional), `ACTIVE_TEMPLATE` (01/02/03, picks the lead welcome email template), `TRIAL_LINK` (CTA URL in the email)
- Lead flow: form POST `/api/lead` → saved to Postgres → bilingual welcome email sent to the lead's own address (templates in `artifacts/api-server/src/lib/emailTemplates.ts`, sender in `src/lib/mailer.ts`)
- Email HTML is table-based with fully inline styles (Gmail-safe); logo embedded as CID attachment from `artifacts/api-server/assets/logo-mascot.png` (resolved relative to the built module, graceful text-only fallback if missing)
- Repeat submissions (same email address, case-insensitive) still insert a new lead row but receive a different "welcome back" hero-style email (`renderReturningLeadEmail`) instead of the standard welcome template

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
