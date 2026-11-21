# Nizamy — AI Positioning

Independent source snapshot of the AI-positioning website. Existing repositories and live sites are unchanged.

Install with `pnpm install`; build with `pnpm build`. Frontend and API configuration is in the artifact manifests. Supply secrets through your hosting environment, never in Git. Database content, credentials, private source uploads, internal agent notes and existing deployment automation are not included.

A separate Replit project and deployment are required for a new public URL. Do not reuse the production database or activate email import jobs without reviewing the environment configuration. DNS cannot map a URL path: `/ai-position` needs a redirect or reverse proxy on the existing website.
