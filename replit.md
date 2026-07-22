# Nizamy HR

A bilingual (EN/AR, full RTL) high-converting landing page for Nizamy HR (نظامي اتش آر, formerly Mr-Hr) — an AI-powered HR system for Saudi SMEs that returns up to 30% of subscription back to the customer. Includes a live return calculator and a Design Partner lead capture form backed by Postgres.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Docker: root `Dockerfile` (multi-stage) builds web + API and serves both from one container on port 3000 (API under `/api`, SPA static via `STATIC_DIR`); run with `docker build -t nizamy . && docker run -p 3000:3000 -e DATABASE_URL=... -e SMTP_HOST=... -e SMTP_PORT=... -e SMTP_USERNAME=... -e SMTP_PASSWORD=... -e SMTP_FROM=... nizamy`
- Email env: `SMTP_HOST`/`SMTP_PORT`/`SMTP_USERNAME`/`SMTP_PASSWORD` (Gmail App Password), `SENDER_NAME` (optional), `ACTIVE_TEMPLATE` (01/02/03, picks the lead welcome email template), `TRIAL_LINK` (CTA URL in the email). From/Reply-To are hardcoded to `sales@nizamy.app` (SMTP_FROM no longer used); Gmail only honors the custom From if sales@nizamy.app is a configured "Send mail as" alias on the SMTP account
- Lead flow: form POST `/api/lead` → saved to Postgres → bilingual welcome email sent to the lead's own address (templates in `artifacts/api-server/src/lib/emailTemplates.ts`, sender in `src/lib/mailer.ts`)
- Email HTML is table-based with fully inline styles (Gmail-safe); the ENTIRE email uses one font family — IBM Plex Sans Arabic (the landing-page body font) for headings and body alike (user explicitly wants a single font, no Cairo/Tajawal mixing in emails) with system fallbacks; brand palette (blue #2563EB, navy #0F172A); logo embedded as CID attachment from `artifacts/api-server/assets/logo-mascot.png` (resolved relative to the built module, graceful text-only fallback if missing)
- Because Gmail strips web fonts, display headlines (welcome headline + blue banner; returning headline + "up to 30%" stat) are pre-rendered PNGs in true IBM Plex Sans Arabic Bold at 2x retina, stored in `artifacts/api-server/assets/email-text/` (8 files: {welcome-headline,banner,returning-headline,stat}-{ar,en}.png) and attached as CID images per language; if any file is missing the mailer logs a warning and falls back to HTML text headlines. Regenerate with `pnpm --filter @workspace/scripts run generate-email-text-images` (needs ImageMagick+Pango and `ibm-plex-sans-arabic-700.ttf` in `~/.fonts` + `fc-cache -f`); if dimensions change, update the hardcoded half-width `<img>` widths in `emailTemplates.ts`
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
