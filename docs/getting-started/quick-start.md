# Quick Start

This gets a local instance running with Docker. For a server, a domain name or Coolify, follow it first and then read [Docker Compose](/deploy/docker-compose) and [Coolify](/deploy/coolify).

## 1. Get the code and create your `.env`

```bash
git clone https://github.com/PrintBench/printbench.git
cd printbench
cp .env.example .env
```

## 2. Set three values

Open `.env` and set:

| Variable | What to put |
| --- | --- |
| `POSTGRES_PASSWORD` | Anything long. It never leaves the Compose network. There is no default on purpose. Compose refuses to start until you set one. |
| `BETTER_AUTH_SECRET` | A random secret. Generate one with `openssl rand -base64 32`. |
| `LIBRARY_PATH` | The folder on your machine that holds your print files. |

::: danger Keep `BETTER_AUTH_SECRET` safe
It is not just a session key. It also derives the encryption key for stored printer API keys and S3 secrets, and signs the short-lived links used for slicer hand-off, uploads and ZIP downloads. Changing it signs everyone out **and** makes stored printer credentials unreadable. Back it up alongside your database.
:::

## 3. Start the stack

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

The first run builds the images, applies the database migrations and starts all four services. `docker-compose.local.yml` publishes nginx on your machine; without it nothing is reachable from outside the Compose network.

## 4. Open the app

Go to <http://localhost:8080>. A fresh instance starts at **/setup**, where you create the first admin account. Carry on with [First Run](/getting-started/first-run).

![The first-run screen for creating the admin account](/images/getting-started/setup.png)

::: tip Your library is read-only
`LIBRARY_PATH` is mounted **read-only** by default. PrintBench indexes it and never moves, renames or deletes anything in it. If you want it to write metadata sidecars next to your models. See [Metadata & Sidecars](/concepts/sidecars).
:::

## Changing the port

The local override publishes port `8080`. Set `PORT` in `.env` to use another one:

```bash
PORT=9000
```

If you later put the app behind a domain, set `APP_URL` as well. See [Environment Variables](/reference/environment).

## Running without Docker

If you want to run PrintBench from source (for development, or just to try it). See [Development Setup](/contributing/setup). You will still need Postgres, which `npm run db:up` starts in Docker for you.

## Something not working?

- **Compose refuses to start** and mentions `POSTGRES_PASSWORD` or `BETTER_AUTH_SECRET`: one of the required values in `.env` is empty.
- **The page doesn't load**: check you included `docker-compose.local.yml`, and that nothing else is using the port.
- **The library looks empty**: that is normal until the first scan. See [First Run](/getting-started/first-run#add-your-first-library).

More in [Troubleshooting](/deploy/troubleshooting).
