# Architecture

PrintBench is a small monorepo with two processes and a set of framework-free packages that both of them import.

```text
            ┌──────────────┐
 browser ──▶│    nginx     │── pages, auth, API ──▶  web  (Next.js)
            │ (sendfile)   │── uploads, ZIPs ─────▶  worker (Node)
            └──────┬───────┘
                   │  X-Accel-Redirect                  │          │
                   ▼                                    ▼          ▼
            library files / previews              ┌───────────────────┐
                                                  │     Postgres 18   │
                                                  │ data + job queue  │
                                                  └───────────────────┘
```

## The processes

| Process | Responsibilities |
| --- | --- |
| **`web`** (`apps/web`) | Next.js. UI, sign-in, thin API layer. **Never does heavy I/O.** Applies migrations at startup. |
| **`worker`** (`apps/worker`) | Plain Node. Scanning, mesh analysis, thumbnails, tus uploads, ZIP streaming, imports, scheduled jobs and optional file watching. |
| **`nginx`** | Hands large files to the OS with `sendfile`, and routes uploads and downloads to the worker. |
| **`db`** | Postgres 18. Holds your data, the search index **and** the job queue. |

## The packages

| Package | What lives there |
| --- | --- |
| `packages/db` | Drizzle schema and migrations. |
| `packages/core` | Domain logic: storage, grouping, scanning, search, policy, sidecars, imports, settings, health. Framework-free. |
| `packages/mesh` | STL, 3MF, OBJ and PLY parsers and the thumbnail rasteriser. |
| `packages/jobs` | A thin wrapper over pg-boss. |
| `packages/auth` | A wrapper over better-auth. |

Domain logic lives in framework-free packages that both processes import, so the web shell is replaceable without touching the app. **New domain logic belongs in `packages/`, not in a route handler**. If a rule about what a library *is* ends up in `apps/web`, the worker can't enforce it.

## Jobs without Redis

Background work runs on **pg-boss**, backed by Postgres. Scheduled jobs registered by the worker:

| Schedule | Job |
| --- | --- |
| Every 15 min | Maintenance sweep (re-queue pending derived data). |
| Every 5 min | Library schedule sweep (decides which libraries are due a scan). |
| Daily 03:20 | Library health pass. |
| Daily 03:45 | Archive sweep (the only scheduled job that deletes anything). |
| Every 60 s | Watch reconciler (starts and stops live watchers). |

pg-boss keeps one schedule per queue name, so per-library scan crons are **evaluated** by a sweep rather than registered individually. See [Scanning & Schedules](/admin/scanning).

## Storage adapters

Everything that touches library files goes through one **storage interface** with two implementations, local disk (including NAS mounts) and S3. Uploads, ZIP extraction, sidecars, scans, moves and deletion all use it, so a bucket behaves like a folder. See [S3 & Compatible Storage](/deploy/s3).

## File delivery

| Backend | How bytes reach the browser |
| --- | --- |
| Local / NAS | The web app authorises, then replies with `X-Accel-Redirect`; nginx serves the file itself. |
| S3 | The browser is redirected to a short-lived presigned URL. |
| Slicer links | Rewritten to 3MF on the fly, so never a redirect. |
| Whole-model ZIP | Streamed from the worker, stored not deflated. |
| Uploads | tus, handled by the worker. |

Under `FILE_DELIVERY=stream` (development only), Node streams the bytes directly.

## Why a job queue in Postgres

It removes an entire service from the install, keeps jobs transactional with the data, and is plenty fast for a library scanner. The cost, one schedule per queue name, is worked around with the sweep pattern.
