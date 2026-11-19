# Quick Start

The release images are private. For a new local install, you need Docker with
Compose, a GitHub account with read access to the `printbench` and
`printbench-nginx` packages, and a personal access token (classic) with the
`read:packages` scope. If your organisation requires single sign-on, authorise
the token for the organisation. See the [GitHub Container Registry authentication guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry).

Sign in to the registry and enter the token when Docker prompts for a password.

```bash
docker login ghcr.io --username YOUR_GITHUB_USERNAME
```

Download
[compose.yaml](https://github.com/PrintBench/printbench/releases/latest/download/compose.yaml)
into an empty folder. Open a terminal in that folder and run this command.

```bash
docker compose up -d
```

Docker pulls the release images. On first startup PrintBench generates its
credentials and applies the database migrations.

Open <http://localhost:8080> and create the first admin account. To add your first
model, choose **Somewhere to upload to** when adding a library, then use the
**Upload** page. See [First Run](/getting-started/first-run).

![The first-run screen for creating the admin account](/images/getting-started/setup.png)

## Index a folder you already have

Create a `.env` file next to `compose.yaml` with `LIBRARY_PATH` set to the host
folder. Run `docker compose up -d` again. In PrintBench, choose **Files I already
have**, select `/libraries`, and run the first scan. The folder is mounted
read-only.

## Change the port

If port 8080 is in use, set `PRINTBENCH_PORT=9000` in `.env`, run
`docker compose up -d` again, and open <http://localhost:9000>.

## Stop or upgrade

Use `docker compose down` to stop PrintBench and keep your data. When backing up
Docker volumes, keep the `credentials` volume with `pgdata` and `data`. See
[Upgrading](/deploy/upgrading) for instructions on updating the Compose file.

To host on a domain, follow [Coolify](/deploy/coolify) or
[Reverse Proxy & TLS](/deploy/reverse-proxy). To build from source, see
[Docker Compose](/deploy/docker-compose) or [Development Setup](/contributing/setup).
