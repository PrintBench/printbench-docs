# Upgrading

## The short version

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

Migrations run automatically at startup, **before** the app accepts traffic. They are **forward-only**, take a database backup before a major or minor version bump, and read the release notes' _Upgrade notes_.

## Before you upgrade

1. **Back up the database**: see [Backups & Restore](/deploy/backups).
2. **Read the release notes** for every version you're skipping. Each lists migrations and any renamed variables. They're collected under [Release Notes](/releases/index).
3. **Keep** your `LIBRARY_PATH`, database volume and data volume.
4. **Keep your `.env`**: in particular `BETTER_AUTH_SECRET`.

## What happens at startup

Migrations run once, from the **`web`** container's entrypoint, which applies pending migrations and then starts the server. The `worker` waits for the schema to be ready rather than racing to apply it. If a migration fails the web container stops rather than serving a half-migrated database. Check `docker compose logs web`.

## Rolling back

Migrations are forward-only, so there is no automatic downgrade. To roll back to an older version, restore the database backup you took beforehand, and deploy the older release.

## Notes on specific releases

| Version                   | Watch for                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| [0.5.1](/releases/v0.5.1) | `LIBRARY_READ_ONLY` replaces `LIBRARY_MODE`. Coolify compose fix.                         |
| [0.5.0](/releases/v0.5.0) | Migrations `0012`–`0014` (embedded metadata state, source imports, provider credentials). |
| [0.3.0](/releases/v0.3.0) | New 3MF size limits; opt-in writable libraries; memory diagnostics.                       |
| [0.2.0](/releases/v0.2.0) | Migration `0011` adds `models.is_package`.                                                |

## Releases and images

Releases are cut by pushing a `vX.Y.Z` tag that matches `package.json`. The release workflow validates the tag and authored notes and runs CI against that commit before publishing the image to `ghcr.io`, attesting its provenance and opening a GitHub Release. Stable releases update rolling image tags; prereleases publish only their explicit version tag and are never marked latest. Nothing is published by merging to `main`.

## After upgrading

- Open **Manage → Libraries** and run a scan if the release notes mention new analysis.
- Check **Library health** for anything new.
- Previously indexed records aren't automatically backfilled for new features such as embedded 3MF metadata. See [Importing from Model Sites](/guide/imports#what-3mf-files-can-supply).
