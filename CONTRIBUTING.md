# Contributing

## Development Workflow

1. Fork the repository and create a feature branch from `main`.
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env` and fill in secrets.
4. Start local services with `docker compose up -d`.
5. Run the workspace in development mode with `pnpm dev`.

## Standards

- Keep changes scoped and documented.
- Add or update tests for changed behavior.
- Ensure `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass locally.
- Use conventional commits when possible.

## Pull Requests

- Link the related issue.
- Describe the user-facing impact.
- Include screenshots for UI changes.
- Note any schema, API, or environment changes.

## Architecture Notes

- `apps/web` contains the Next.js frontend.
- `apps/api` contains the Express API.
- `packages/db` owns Drizzle schema and migrations.
- `packages/queue` owns BullMQ queues and workers.

## First Contributions

Look for issues labeled `good first issue`, `help wanted`, or `documentation`.
