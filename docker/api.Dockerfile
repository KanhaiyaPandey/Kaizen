FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/queue/package.json packages/queue/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/config/tsconfig/package.json packages/config/tsconfig/package.json

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm --filter @acme/api build

EXPOSE 4000

CMD ["pnpm", "--filter", "@acme/api", "start"]
