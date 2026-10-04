# Codebase Tour

```text
apps/web        Next.js. UI, auth, thin API layer
apps/worker     Plain Node, scanning, thumbnails, uploads, ZIP streaming
packages/db     Drizzle schema and migrations
packages/core   Domain logic: storage, grouping, search, policy
packages/mesh   STL/3MF/OBJ/PLY parsers and the thumbnail rasteriser
packages/jobs   pg-boss wrapper
packages/auth   better-auth wrapper
docker/         Dockerfile, entrypoint, nginx config
scripts/        Backup, password reset and the verify scripts
docs/           Operator docs and release notes in the app repository
website/        The marketing site
```

Domain logic lives in the framework-free packages so that both processes can import it and the web shell stays replaceable. See [Architecture](/concepts/architecture).

## `packages/core`

| Folder | What it holds |
| --- | --- |
| `library` | Grouping, walker, media types, path rules, library roots. |
| `scan` | Scan service, schedules, prune/archive, per-library scan lock. |
| `search` | The search service and the vector refresh. |
| `policy` | `can()` and the role/action table. |
| `storage` | The storage interface, local and S3 adapters, file delivery, moves. |
| `sidecar` | Reading and writing `.printbench.json` and package sidecars. |
| `import` | MakerWorld, Printables and Thingiverse providers and network guards. |
| `services` | Models, browsing, lists, prints, print requests, share links, invites, printers. |
| `health` | Problem kinds and the detectors. |
| `settings` | The instance settings service. |
| `slicer` | G-code metadata reading. |
| `previews` | Preview status and storage. |
| `security` | Secret box, signed links. |

## `apps/web`

Route groups: `(app)` for the signed-in surface, `(auth)` for setup, login, invitations and password reset, `api` for route handlers, `share` for public share pages. Components are grouped by area (`shell`, `model`, `viewer`, `ui`, …).

## `apps/worker`

`src/index.ts` registers the scheduled jobs and the HTTP server (uploads, ZIPs). `src/jobs` holds the job handlers (scan, analyse, import, move, health, maintenance, schedule). `src/watch` is the live watcher and its reconciler. `src/http` is tus uploads, ZIP streaming and ZIP ingest.

## `packages/db`

Drizzle schema, one file per area (`models`, `libraries`, `prints`, `requests`, `imports`, …), plus the generated migrations and the migration runner that the web container invokes at startup.

## Where to put new code

**New domain logic belongs in `packages/`, not in a route handler.** If a rule about what a library *is* ends up in `apps/web`, the worker can't enforce it.
