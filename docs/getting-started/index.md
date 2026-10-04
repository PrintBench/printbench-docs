# Getting Started

PrintBench is built around a simple idea: a print library is a folder of files you already know how to back up, and the app's job is to make it *findable* without ever making it *different*. Add a library and PrintBench indexes it, groups files into models, renders previews and keeps everything you type (tags, creators, notes, print history) in Postgres.

This section gets you from nothing to a working instance:

- [Quick Start](/getting-started/quick-start): run the Docker Compose stack and open the app.
- [First Run](/getting-started/first-run): create the admin account, add a library, run the first scan and invite other people.
- [A Tour of PrintBench](/getting-started/tour): what each screen is for, and what each role can see.

## What you need

| You need | Why |
| --- | --- |
| Docker with Compose | The production stack runs as containers: Postgres, the web app, the worker and nginx. |
| A folder of print files | Or an S3 bucket, or an empty folder to upload into. See [Libraries](/admin/libraries). |
| A few GB of free disk | For the database and generated thumbnails. Your model files stay where they are. |

You do **not** need Redis, Elasticsearch, a GPU, headless Chrome or any 3D software installed on the host.

## How it fits together

Two application processes run from one image, with nginx in front and Postgres behind:

| Process | What it does |
| --- | --- |
| `web` | Pages, sign-in and a thin API layer. Never does heavy I/O. |
| `worker` | Scanning, mesh analysis, thumbnails, uploads, ZIP streaming and scheduled jobs. |
| `nginx` | Serves large files with `sendfile`, so multi-gigabyte downloads never pass through Node. |
| `db` | Postgres 18. Holds everything you typed, plus the job queue. |

See [Architecture](/concepts/architecture) for the full picture.

## Where to go next

- Running it for a household or a small team? Read [Users & Roles](/admin/users) before you invite anyone.
- Your files live on a NAS? Read [Storage & NAS Mounts](/deploy/storage): an unmounted share is the most common cause of alarming-looking scans.
- Your files live in a bucket? Read [S3 & Compatible Storage](/deploy/s3).
- Putting it on the internet? Read [Reverse Proxy & TLS](/deploy/reverse-proxy).
