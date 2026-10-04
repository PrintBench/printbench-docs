# PrintBench Docs

VitePress documentation site for [PrintBench](https://github.com/PrintBench/printbench), 
the self-hosted library for your 3D print files.

The content covers installing and deploying PrintBench, using it day to day,
administering an instance, how it works under the hood, and contributing.

## Local development

```sh
npm ci
npm run docs:dev      # live-reloading dev server
npm run docs:build    # production build into docs/.vitepress/dist
npm run docs:preview  # serve the production build
```

## Layout

```
docs/
  getting-started/   Install, first run, a tour of the app
  guide/             Using PrintBench: browsing, models, uploads, printing, sharing
  admin/             Libraries, users, settings, printers, library health
  deploy/            Docker Compose, Coolify, storage, S3, backups, upgrades, troubleshooting
  concepts/          How it works: architecture, sidecars, grouping, search, memory
  reference/         Environment variables, roles, file formats, CLI commands
  contributing/      Development setup, checks, conventions, security
  releases/          Release notes
  .vitepress/        Site config and theme
```

## Deploying with Coolify

Deploy from the monorepo with these settings:

- Base directory: the folder holding this site (`/printbench-docs` or `/apps/docs`)
- Build/deploy type: Docker
- Dockerfile: `Dockerfile`
- Public service/port: port `8080` (the unprivileged nginx image listens there)

## Keeping the docs honest

Most pages describe behaviour that is easy to drift from the app. When a
setting, route or environment variable changes in `printbench`, update the
matching page here, [Environment variables](docs/reference/environment.md) and
[Roles & permissions](docs/reference/roles.md) are the two that go stale first.
