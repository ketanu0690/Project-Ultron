FROM node:20-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json turbo.json tsconfig.json ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
RUN npm ci --workspaces --include-workspace-root
RUN npm run build --workspace @ultron/shared
RUN mkdir -p node_modules/@ultron/shared apps/api/node_modules/@ultron/shared \
  && cp packages/shared/package.json node_modules/@ultron/shared/ \
  && cp -r packages/shared/dist node_modules/@ultron/shared/dist \
  && cp -r node_modules/@ultron/shared apps/api/node_modules/@ultron/shared
RUN npm run build --workspace @ultron/api
RUN npx esbuild apps/api/prisma/seed.ts --bundle --platform=node --format=cjs --packages=external --outfile=apps/api/prisma/dist/seed.js

FROM node:20-alpine AS runner
RUN apk add --no-cache wget postgresql-client
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/docker-entrypoint.sh ./apps/api/docker-entrypoint.sh
WORKDIR /app/apps/api
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh
EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
