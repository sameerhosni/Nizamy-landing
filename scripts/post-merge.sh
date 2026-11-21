#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Development-only task merge setup. Use the tracked, additive SQL migrations:
# Drizzle does not model the support tables and must not drop them.
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run migrate
