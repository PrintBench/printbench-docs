# Development Setup

## Requirements

- **Node 24** (see `.nvmrc`; `package.json` requires Node ≥ 22)
- **Docker**, for the development database

## Get running

```bash
npm install
cp .env.example .env
npm run db:up        # Postgres 18 on port 5433
npm run db:migrate
npm run dev          # web on :3000, worker alongside
```

`npm run dev` starts the web app and the worker together, with coloured prefixes. Open <http://localhost:3000>; on a fresh database you'll start at `/setup`.

The development `.env` works out of the box: `DATABASE_URL` points at the Postgres that `npm run db:up` starts, and `LIBRARY_ROOTS` defaults to the repository so the demo library is visible without configuration.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev:web` / `dev:worker` | Run one process. |
| `npm run db:down` | Stop the dev database. |
| `npm run db:generate` | Generate a migration after editing the schema. |
| `npm run build` | Build web and worker. |
| `npm run lint`, `npm run typecheck`, `npm test` | The checks CI runs. |
| `npm run format` | Prettier. |

More in [Command Line](/reference/cli).

## An S3 backend for development

The dev compose file includes a MinIO behind a profile:

```bash
docker compose -f docker-compose.dev.yml --profile s3 up -d
npm run verify:s3
```

## Running the real stack locally

To test the production containers rather than the dev servers:

```bash
cp .env.example .env   # set POSTGRES_PASSWORD and BETTER_AUTH_SECRET
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

## Worktrees

A git worktree doesn't inherit `.env` from the main checkout. Copy it across, or the database-backed tests will skip. See [Checks & Testing](/contributing/testing#env-matters-more-than-you-would-expect).

## The `reference/` directory

`reference/manyfold` is a vendored copy of ManyFold, kept only as a domain reference. It is gitignored, dockerignored, excluded from the TypeScript build and never linted or formatted. **No code is copied out of it**. See [Conventions & Invariants](/contributing/conventions#the-one-firm-rule-reference).
