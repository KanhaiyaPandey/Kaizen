<div align="center">
  <p>
   <img width="1024" height="1024" alt="kizen logo" src="https://github.com/user-attachments/assets/111b3874-39fd-44f6-95b7-73bc304069cd" />
  </p>
  <h1>Kaizen - AI Open Source Contributor Assistant</h1>
  <p><strong>Understand codebases faster. Discover beginner-friendly issues. Contribute with confidence.</strong></p>
  <p>
    <a href="https://github.com/OWNER/REPO/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?branch=main&label=ci&style=flat-square" alt="CI status" />
    </a>
    <a href="https://github.com/OWNER/REPO/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/OWNER/REPO?style=flat-square" alt="License" />
    </a>
    <a href="https://github.com/OWNER/REPO/issues">
      <img src="https://img.shields.io/github/issues/OWNER/REPO?style=flat-square" alt="Open issues" />
    </a>
    <a href="https://github.com/OWNER/REPO/pulls">
      <img src="https://img.shields.io/github/issues-pr/OWNER/REPO?style=flat-square" alt="Open pull requests" />
    </a>
    <a href="https://github.com/OWNER/REPO/graphs/contributors">
      <img src="https://img.shields.io/github/contributors/OWNER/REPO?style=flat-square" alt="Contributors" />
    </a>
  </p>
</div>

> Replace `OWNER/REPO` in the badge URLs once the repository is published. Replace the logo path with your actual project asset when available.

## Landing

Kaizen is an AI-powered SaaS that helps developers ramp up on unfamiliar GitHub repositories. It analyzes project structure, explains how the codebase is organized, and surfaces beginner-friendly issues so new contributors can find a practical entry point faster.

For maintainers, Kaizen provides a foundation for repository analysis workflows, contributor onboarding, and asynchronous AI-powered processing. For contributors, it reduces the time spent decoding project structure before making a first meaningful change.

### Quick Links

- [Features](#features)
- [Monorepo Structure](#monorepo-structure)
- [Local Development Setup](#local-development-setup)
- [Database Migrations](#database-migrations)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

## Overview

Kaizen analyzes open-source repositories, explains unfamiliar codebases, and highlights beginner-friendly issues so developers can move from exploration to contribution with less friction. The repository is structured as a production-grade monorepo built for long-term maintainability, automated delivery, and external contributions.

## Features

- AI-generated repository summaries focused on contributor onboarding
- Codebase analysis pipeline for unfamiliar projects
- Beginner-friendly issue discovery workflow
- GitHub OAuth-based authentication
- Async analysis jobs powered by Redis and BullMQ
- Shared TypeScript packages for reusable contracts and infrastructure
- Contributor-friendly monorepo with CI, Docker, and migration workflow

## Tech Stack

### Frontend

- Next.js with App Router
- React
- Tailwind CSS

### Backend

- Node.js
- Express

### Data Layer

- PostgreSQL
- Drizzle ORM
- drizzle-kit migrations

### Queue and Background Jobs

- Redis
- BullMQ

### AI and Integrations

- OpenAI API
- GitHub OAuth

### Deployment

- Vercel for the frontend
- Railway or Render for the backend

## Monorepo Structure

This repository uses:

- `pnpm` workspaces for dependency management
- `Turborepo` for task orchestration and caching
- Shared packages for database, queue, config, and common types

High-level package layout:

- `apps/web`: Next.js frontend
- `apps/api`: Express API
- `packages/db`: Drizzle schema, client, and migrations
- `packages/queue`: BullMQ queue and Redis connection utilities
- `packages/shared`: Shared types and contracts
- `packages/config`: Shared TypeScript and lint config

## Directory Tree

```text
.
├── .env.example
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows
│       └── ci.yml
├── apps
│   ├── api
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app.ts
│   │   │   ├── config
│   │   │   │   └── env.ts
│   │   │   ├── index.ts
│   │   │   ├── routes
│   │   │   │   ├── analyses.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── health.ts
│   │   │   │   └── repositories.ts
│   │   │   ├── services
│   │   │   │   ├── analysis-service.ts
│   │   │   │   └── github-service.ts
│   │   │   ├── tests
│   │   │   │   └── health.test.ts
│   │   │   └── types
│   │   │       └── supertest.d.ts
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   └── web
│       ├── .env.example
│       ├── app
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── docker
│   ├── api.Dockerfile
│   └── web.Dockerfile
├── packages
│   ├── config
│   │   ├── eslint
│   │   │   └── base.mjs
│   │   └── tsconfig
│   │       ├── nextjs.json
│   │       ├── node.json
│   │       └── package.json
│   ├── db
│   │   ├── drizzle
│   │   │   ├── 0000_initial.sql
│   │   │   └── meta
│   │   │       └── _journal.json
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── client.ts
│   │   │   ├── index.ts
│   │   │   └── schema
│   │   │       ├── analyses.ts
│   │   │       ├── repositories.ts
│   │   │       └── users.ts
│   │   └── tsconfig.json
│   ├── queue
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── connection.ts
│   │   │   ├── index.ts
│   │   │   └── queues
│   │   │       └── analysis-queue.ts
│   │   └── tsconfig.json
│   └── shared
│       ├── package.json
│       ├── src
│       │   ├── index.ts
│       │   └── types.ts
│       └── tsconfig.json
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── SECURITY.md
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── turbo.json
```

## Environment Variables Setup

Copy the example file and provide real values for your local environment:

```bash
cp .env.example .env
```

Example variables:

```env
DATABASE_URL=
REDIS_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

You will typically also want frontend and API URLs configured in `.env` for local development.

## Local Development Setup

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker and Docker Compose

### Start the project

```bash
pnpm install
docker compose up -d
pnpm dev
```

Default local services:

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Database Migrations

Kaizen uses Drizzle ORM with TypeScript-based schema definitions and `drizzle-kit` for migrations.

Schema files live in:

- `packages/db/src/schema`

Core migration workflow:

```bash
pnpm db:generate
pnpm db:migrate
```

Recommended process:

1. Update the schema in `packages/db/src/schema`.
2. Generate a migration with `pnpm db:generate`.
3. Review the generated SQL under `packages/db/drizzle`.
4. Apply the migration with `pnpm db:migrate`.
5. Commit schema changes and generated migration files together.

## Scripts

### Root scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:migrate
```

Script summary:

- `pnpm dev`: Runs frontend and backend in development mode through Turborepo
- `pnpm build`: Builds all packages and apps
- `pnpm lint`: Runs TypeScript-based validation across the workspace
- `pnpm typecheck`: Runs strict type-checking across the workspace
- `pnpm test`: Runs the test suites across the workspace
- `pnpm db:generate`: Generates Drizzle migrations
- `pnpm db:migrate`: Applies database migrations

## Docker Setup

The repository includes Docker support for local infrastructure and containerized app builds.

Start local services:

```bash
docker compose up -d
```

Compose services included:

- PostgreSQL
- Redis
- API container
- Web container

Build artifacts are defined in:

- `docker/api.Dockerfile`
- `docker/web.Dockerfile`
- `docker-compose.yml`

## CI/CD

GitHub Actions is configured under `.github/workflows/ci.yml`.

The CI pipeline runs:

- `lint`
- `typecheck`
- `test`
- `build`

CI also provisions:

- PostgreSQL service container
- Redis service container

This keeps validation close to the runtime architecture used locally and in deployment.

## Deployment Recommendations

Recommended production split:

- Deploy `apps/web` to Vercel
- Deploy `apps/api` to Railway or Render
- Use managed PostgreSQL and Redis services

Operational recommendations:

- Store secrets in platform-managed environment configuration
- Run database migrations as part of the backend deployment workflow
- Configure GitHub OAuth callback URLs separately for local, preview, and production
- Keep OpenAI model configuration environment-driven

## Contributing Guidelines

Contributions are welcome.

Before opening a pull request:

- Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- Review [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Ensure `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass locally
- Document any environment, schema, or API changes

### Contributor Workflow

1. Fork the repository and create a branch from `main`.
2. Copy `.env.example` to `.env` and configure local secrets.
3. Start dependencies with `docker compose up -d`.
4. Run the workspace with `pnpm dev`.
5. Make focused changes with tests and docs where relevant.
6. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
7. Open a pull request using the provided PR template.

### Good First Contributions

- Improve repository analysis heuristics
- Expand GitHub integration and OAuth flows
- Add onboarding UX and dashboard improvements
- Improve test coverage around API and queue behavior
- Refine contributor docs and setup guides

### Maintainer Notes

- Keep migrations committed alongside schema changes
- Avoid introducing package-level dependency leaks across workspace boundaries
- Prefer shared types and utilities in `packages/*` over app-local duplication
- Document any new environment variables in `.env.example` and this README

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Acknowledgements

- OpenAI for the AI platform integration
- GitHub for repository and authentication APIs
- The maintainers and contributors building open-source onboarding tooling
- The open-source ecosystem around Next.js, Express, Drizzle, PostgreSQL, Redis, and BullMQ
