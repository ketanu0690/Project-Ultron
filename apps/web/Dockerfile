FROM node:20-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json turbo.json tsconfig.json ./
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci --workspaces --include-workspace-root
RUN npm run build --workspace @ultron/shared
RUN mkdir -p node_modules/@ultron/shared apps/web/node_modules/@ultron/shared \
  && cp packages/shared/package.json node_modules/@ultron/shared/ \
  && cp -r packages/shared/dist node_modules/@ultron/shared/dist \
  && cp -r node_modules/@ultron/shared apps/web/node_modules/@ultron/shared
RUN npm run build --workspace @ultron/web

FROM node:20-alpine AS runner
RUN apk add --no-cache wget
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
