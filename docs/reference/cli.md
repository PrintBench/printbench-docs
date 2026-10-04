# Command Line

PrintBench ships a few `npm run` commands for operators. Run them from the application directory with the normal runtime environment loaded (a `.env` file, or the container's environment). Node 24 is required for development; see [Development Setup](/contributing/setup).

## Operations

| Command | What it does |
| --- | --- |
| `npm run backup export <file>` | Writes a readable JSON metadata export. See [Backups & Restore](/deploy/backups). |
| `npm run backup import <file> -- --dry-run` | Reports what an import would change, without changing anything. |
| `npm run backup import <file>` | Restores metadata into a rebuilt database, matching by library path and model path. Only fills blanks. |
| `npm run auth:reset -- --email <address>` | Prints a private, one-hour, single-use password-reset link. See [Password Recovery](/admin/password-recovery). |

## Development

| Command | What it does |
| --- | --- |
| `npm run dev` | Web on :3000 and the worker, together. |
| `npm run dev:web` / `npm run dev:worker` | One process at a time. |
| `npm run db:up` / `npm run db:down` | Start or stop the development Postgres 18 on port 5433. |
| `npm run db:generate` | Generate a migration after editing the schema. Commit what it produces. |
| `npm run db:migrate` | Apply migrations. |
| `npm run build` | Build web and worker. |
| `npm run typecheck` | TypeScript across the workspace. |
| `npm run lint` | ESLint across the workspace. |
| `npm run format` / `npm run format:check` | Prettier. |
| `npm test` / `npm run test:watch` | Vitest. Needs the dev database up. |
| `npm run auth:schema` | Reconcile `packages/db/src/schema/auth.ts` against what better-auth expects, after upgrading it. |

## Verification scripts

These drive a **running dev server** end to end, creating throwaway accounts and cleaning up after themselves.

| Command | Covers |
| --- | --- |
| `npm run verify:phase1` | Auth surface and role guards, in both directions. |
| `npm run verify:phase2` | Scan pipeline and safety guards. |
| `npm run verify:phase2:ui` | Web → queue → worker → pages. |
| `npm run verify:phase3` | Mesh parsing, rendering and serving. |
| `npm run verify:phase4` | Downloads, HTTP Range and ZIP archives. |
| `npm run verify:phase5` | Search, facets and the command palette. |
| `npm run verify:phase6` | Uploads, editing and the restore drill. |
| `npm run verify:phase7` | Print history, slicer links and a stubbed printer. |
| `npm run verify:phase8` | Health, settings, schedules, sharing and prune. |
| `npm run verify:phase9` | The print queue, its role split and auto-linking. |
| `npm run verify:s3` | The whole S3 path against a real bucket (defaults to the dev MinIO). |
| `npx tsx scripts/verify-model-imports.mts` | A real resumable upload and its metadata, thumbnail, search and sidecar results. |
| `node --import tsx scripts/benchmark-mesh-memory.mts <triangles> <heapMiB>` | The 3MF memory benchmark. See [Large Libraries & Memory](/deploy/large-libraries). |

## In Docker

Run operator commands inside the web container so they get the container's environment, for example:

```bash
docker compose exec web npm run auth:reset -- --email you@example.com
```

For `pg_dump` and `psql`, use the `db` service. See [Backups & Restore](/deploy/backups).
