FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/config/tsconfig/package.json packages/config/tsconfig/package.json

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm --filter @acme/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@acme/web", "start"]
