# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:24-slim AS build

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /repo

COPY . .

RUN pnpm install --frozen-lockfile

# Build the web frontend (Vite requires PORT and BASE_PATH at config load time)
ENV NODE_ENV=production
RUN PORT=3000 BASE_PATH=/ pnpm --filter @workspace/web run build

# Build the API server (esbuild bundle -> dist/index.mjs)
RUN pnpm --filter @workspace/api-server run build

# ---------- Runtime stage ----------
FROM node:24-slim

ENV NODE_ENV=production \
    PORT=3000 \
    STATIC_DIR=/app/public

WORKDIR /app

# nodemailer is externalized from the server bundle, so install it here
RUN npm init -y > /dev/null && npm install --omit=dev nodemailer@9.0.3

COPY --from=build /repo/artifacts/api-server/dist ./dist
COPY --from=build /repo/artifacts/api-server/assets ./assets
COPY --from=build /repo/artifacts/web/dist/public ./public

RUN chown -R node:node /app
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
