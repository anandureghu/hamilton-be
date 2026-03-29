# --- Stage 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm run build


# --- Stage 2: Production ---
FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /usr/src/app/dist ./dist

COPY knexfile.ts ./
COPY db ./db

RUN mkdir -p logs && chown -R node:node logs

RUN chown -R node:node db knexfile.ts

USER node

EXPOSE 3000

CMD ["sh", "-c", "pnpm run start:migrate && node dist/main.js"]
