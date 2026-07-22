---
name: Self-hosted Docker/Kubernetes deployment
description: User also runs this app from the GitHub repo on their own Kubernetes cluster — constraints that Replit-only assumptions break
---

- The user deploys the repo via Docker on their own Kubernetes cluster (`prod-nizamy` namespace), in addition to Replit publishing.
- **Rule:** no Replit-only assumptions in server code. `AI_INTEGRATIONS_*` env vars exist only on Replit; the OpenAI client must keep its fallback to `OPENAI_API_KEY`/`OPENAI_BASE_URL` and the model must stay configurable via `OPENAI_MODEL` (default `gpt-5.6-luna` is Replit-proxy-only).
- **Rule:** never create OpenAI clients or throw on missing env at module import time — it crashes the whole container (CrashLoopBackOff). All clients in `lib/integrations-openai-ai-server` route through the shared lazy Proxy client.
- `.dockerignore` excludes `attached_assets/` — web code must never import from `@assets/`; copy needed images into `artifacts/web/src/assets/` instead.
