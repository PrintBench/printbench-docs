# Deployment

Postgres is the only infrastructure dependency. There is no Redis, no message broker and nothing to compile, which is the whole point of the project.

Two application processes run from one image, with nginx in front of them:

| Process | What it does |
| --- | --- |
| `web` | Next.js. Pages, auth, the thin API layer. Never does heavy I/O. |
| `worker` | Scanning, mesh analysis, thumbnails, uploads, ZIP streaming, scheduled jobs. |
| `nginx` | Serves large files with `sendfile` so multi-gigabyte downloads never pass through Node. |
| `db` | Postgres 18 (`postgres:18-alpine`). |

## Pick your path

| I want to… | Read |
| --- | --- |
| Run it with Docker Compose | [Docker Compose](/deploy/docker-compose) |
| Run it on Coolify | [Coolify](/deploy/coolify) |
| Put a domain and TLS in front | [Reverse Proxy & TLS](/deploy/reverse-proxy) |
| Use a NAS, SMB share or extra mounts | [Storage & NAS Mounts](/deploy/storage) |
| Keep my library in a bucket | [S3 & Compatible Storage](/deploy/s3) |
| Back up and restore | [Backups & Restore](/deploy/backups) |
| Upgrade safely | [Upgrading](/deploy/upgrading) |
| Index a very big library | [Large Libraries & Memory](/deploy/large-libraries) |
| Work out what's wrong | [Troubleshooting](/deploy/troubleshooting) |

## Before you deploy anywhere

1. **Generate a real `BETTER_AUTH_SECRET`** (`openssl rand -base64 32`) and keep it. It signs sessions and links and encrypts stored printer and S3 credentials.
2. **Set `APP_URL` and `BETTER_AUTH_URL`** to the address people will actually type, including the scheme.
3. **Terminate TLS in front of the stack**: don't expose it to the internet over plain HTTP.
4. **Use persistent volumes** for the database and the data directory.
5. **Keep the library mount read-only** unless you intend PrintBench to write into it.

The full variable list is in [Environment Variables](/reference/environment).

::: warning Not exposed without TLS
Instances exposed to the internet without a reverse proxy and TLS are a misconfiguration, not a vulnerability the project can fix for you. See [Security Model](/concepts/security).
:::
