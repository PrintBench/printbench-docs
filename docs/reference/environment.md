# Environment Variables

Copy `.env.example` to `.env` and edit it. Docker reads only the keys under **Secrets**, **Your library** and **Docker stack**; Compose interpolates them into the containers. The **Local development** keys are read by the app itself when run outside Docker, and the containers never see them.

## Secrets

| Variable | Required | Description |
| --- | :---: | --- |
| `POSTGRES_PASSWORD` | ✅ | Password for the bundled Postgres. No default. Compose refuses to start without it. |
| `BETTER_AUTH_SECRET` | ✅ | Signs sessions and links, and derives the key that encrypts stored printer, S3 and import credentials. Generate with `openssl rand -base64 32`. **Back it up; rotating it signs everyone out and makes stored credentials unreadable.** |

## Your library

| Variable | Default | Description |
| --- | --- | --- |
| `LIBRARY_PATH` | `./libraries` | Host folder holding your print files. Mounted at `/libraries`, read-only unless `LIBRARY_READ_ONLY=false`. nginx always mounts it read-only. |
| `LIBRARY_READ_ONLY` | `true` | Set to `false` to let `web` and `worker` write metadata sidecars into existing libraries. Replaces `LIBRARY_MODE` (`rw` → `false`, `ro` → `true`). |

## Docker stack

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8080` | Port published by `docker-compose.local.yml`. Coolify doesn't publish it; Traefik proxies to nginx's port 80. |
| `POSTGRES_USER` | `printbench` | Database user. |
| `POSTGRES_DB` | `printbench` | Database name. |
| `APP_URL` | follows `PORT` | Public URL the app is served from. Used for auth callbacks and signed links. Set it to your real origin (`https://prints.example.com`) when you put a domain in front. |
| `BETTER_AUTH_URL` | n/a | Same value as `APP_URL`. Either can be used by the password-reset command. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | n/a | Optional. Additional origins allowed to call the auth endpoints (comma-separated). |
| `FILE_DELIVERY` | `xaccel` in Docker, `stream` locally | `stream`: Node streams the bytes (development only). `xaccel`: hand off to nginx via `X-Accel-Redirect`. **S3 libraries ignore this** and always redirect to a presigned URL. Leave unset. |
| `WORKER_MEMORY_LOG` | `0` | Set to `1` for opt-in job and scan memory diagnostics. Logs IDs and process memory, not file contents. See [Large Libraries & Memory](/deploy/large-libraries). |
| `TZ` | host default | Not set by default. Controls the timezone in which scan schedules run. |

## Set by Compose

You rarely change these; Compose sets them on the containers.

| Variable | Value in Compose | Description |
| --- | --- | --- |
| `DATABASE_URL` | built from the Postgres settings | Connection string. |
| `DATA_DIR` | `/data` | Where thumbnails and derived assets are written, and where uploads are staged. |
| `LIBRARY_ROOTS` | `/libraries:/data/libraries` | Where an admin may point a library. Confines the folder picker. |
| `ACCEL_MOUNTS` | `/_protected/library/=/libraries,/_protected/managed/=/data/libraries` | Maps nginx's internal locations to roots. **Must match `docker/nginx.conf`.** |

## Local development

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Ignored by Docker. |
| `DATABASE_URL` | `postgres://printbench:printbench@localhost:5433/printbench` | Matches `npm run db:up`. The test suite reads this too, without it the database-backed third of the suite can't run, and a green result proves much less than it appears to. |
| `DATA_DIR` | `./data` | Where generated thumbnails and derived assets are written. |
| `RENDER_CONCURRENCY` | CPU count − 1 | Concurrency of the CPU-bound render/analyse pool. |
| `LIBRARY_ROOTS` | the repository | Where an admin may point a library, separated by the platform path separator (`:` on Linux/macOS, `;` on Windows). Unset in development means the repository, which makes the demo library visible without configuration. |
| `MANAGED_LIBRARY_ROOT` | `<DATA_DIR>/libraries` | Where *somewhere to upload to* libraries are created. Must be writable. |
| `WORKER_PORT` | `3001` | Port the worker's HTTP server listens on (uploads, ZIPs). |

## Verification scripts

Only used by the `verify:*` commands:

| Variable | Description |
| --- | --- |
| `VERIFY_BASE_URL` | Base URL of the running dev server the scripts drive. |
| `VERIFY_S3_ENDPOINT`, `VERIFY_S3_BUCKET`, `VERIFY_S3_ACCESS_KEY`, `VERIFY_S3_SECRET_KEY` | Point `npm run verify:s3` at a bucket other than the bundled MinIO. See [S3 & Compatible Storage](/deploy/s3#verifying-a-bucket-works). |

## What's configured in the UI instead

Site name, default role, grace period, sidecar writing, viewer size limit, metadata-problem tracking and sharing are **instance settings**, not environment variables. See [Instance Settings](/admin/settings). Library locations, schedules, S3 buckets and printers are configured per library or per printer in the UI.
