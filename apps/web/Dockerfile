FROM node:22-alpine AS base

FROM base AS pruner

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune web --docker

FROM base AS creator

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN npm install

COPY --from=pruner /app/out/full/ .
RUN npm run build

FROM base AS distributor

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=creator --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=creator --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=creator --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD [ "node", "apps/web/server.js" ]