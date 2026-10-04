# Docker Compose

The production stack is `docker-compose.yml`. It must reach a working login with no manual steps. That is the bar the project holds itself to.

## Services

| Service | Image | Notes |
| --- | --- | --- |
| `db` | `postgres:18-alpine` | Data in the `pgdata` volume, mounted at `/var/lib/postgresql`. Has a healthcheck; `web` and `worker` wait for it. |
| `web` | Built from `docker/Dockerfile`, command `web` | Healthcheck calls `/api/health`. |
| `worker` | Same image, command `worker` | Scanning, thumbnails, uploads, ZIPs and schedules. |
| `nginx` | Built from `docker/nginx.Dockerfile` | Exposes port 80 inside the network only. |

Two volumes: `pgdata` (the database) and `previews` (mounted at `/data`, thumbnails, derived assets, upload staging and upload libraries).

## Setup

```bash
cp .env.example .env
```

Set these before starting anything:

| Variable | What it is |
| --- | --- |
| `POSTGRES_PASSWORD` | Anything long. It never leaves the Compose network. Required; there is no default. |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32`. **See the warning below.** Required. |
| `APP_URL` | The address people will actually type, including scheme. |
| `BETTER_AUTH_URL` | The same value. |
| `LIBRARY_PATH` | Host folder holding your print files. Mounted read-only. |

::: danger `BETTER_AUTH_SECRET` is not just a session key
It also derives the encryption key for stored printer API keys and S3 secrets, and signs the short-lived links used for slicer hand-off, uploads and ZIP downloads. Changing it signs everyone out **and** makes stored printer credentials unreadable; they will need re-entering. Back it up with your database.
:::

### Read-only by default

Existing collections are read-only by default. Set `LIBRARY_READ_ONLY=false` to allow the `web` and `worker` services to write metadata sidecars; nginx **always** mounts the collection read-only. This replaces `LIBRARY_MODE`: migrate `rw` to `LIBRARY_READ_ONLY=false`, or `ro` to `LIBRARY_READ_ONLY=true`.

### Variables you rarely touch

Compose also sets these on the containers. You only need to change them if you change the mounts:

| Variable | What it is |
| --- | --- |
| `LIBRARY_ROOTS` | Where an admin may point a library. Confines the folder picker so browsing can't wander outside what's mounted. |
| `ACCEL_MOUNTS` | Maps nginx's internal locations to filesystem roots. **Must match `docker/nginx.conf`**; a mismatch shows up as downloads 404ing while the app thinks they succeeded. |

## Start it

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

`docker-compose.local.yml` publishes nginx on `${PORT:-8080}`. It is separate because Coolify's reverse proxy reaches `nginx` over Docker networking and must not have a fixed host port bound.

The first run applies migrations and starts at **/setup**, which creates the first admin account. That page stops working the moment a user exists. See [First Run](/getting-started/first-run).

## Two kinds of library, two mounts

- **Existing files** come from `LIBRARY_PATH`, mounted at `/libraries`.
- **Upload libraries** live under `MANAGED_LIBRARY_ROOT` (default `/data/libraries`) on the writable data volume, because the collection mount is deliberately read-only.

See [Libraries](/admin/libraries#the-two-kinds-of-library).

## Group permissions on the host

If your library's host folder is only readable through a group, add that group's numeric GID to `group_add` for **both** `web` and `worker` in a deployment override file. The GID must match the group that grants access to `LIBRARY_PATH` on the host.

## Timezone

Scan schedules run in the server's local timezone. Set `TZ` on the containers in an override file if the host's isn't what you want. See [Scanning & Schedules](/admin/scanning#schedules).

## Healthchecks and logs

`/api/health` reports process status and is what the `web` container's healthcheck uses. Inspect services with:

```bash
docker compose ps
docker compose logs -f worker
```

For memory diagnostics on large libraries. See [Large Libraries & Memory](/deploy/large-libraries).

## Releases

Tagged releases are built into a container image, published to `ghcr.io` with a provenance attestation and announced as a GitHub Release. See [Upgrading](/deploy/upgrading).
