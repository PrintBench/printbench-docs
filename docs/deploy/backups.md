# Backups & Restore

The easiest backup is the one PrintBench takes itself: [scheduled backups to S3](#scheduled-backups-to-s3), encrypted and kept for you. The numbered sections after it are the manual equivalents, and what each covers.

## Scheduled backups to S3

**Manage → Backup → Scheduled backups** writes a backup of PrintBench to one of your [S3 connections](/deploy/s3) on a schedule and keeps the newest few. You must be an admin to set it up.

### What's in it

Accounts, settings, libraries, model records, tags, collections, print history, printers, filaments, [photos](/guide/models#photos) and stored credentials (printer keys, S3 secrets and import sign-ins). Your model files are **never** included: they are already where they live, and for an [upload library](#_1-your-model-files) you back up `/data/libraries` yourself. Thumbnails are re-rendered after a restore.

### Setting it up

1. Add an S3 connection under **Manage → Storage** if you don't have one. The key needs to write and delete under the backup folder; see [Scheduled backups on S3](/deploy/s3#scheduled-backups).
2. Under **Manage → Backup**, pick the connection and a **folder** (prefix) in its bucket. It must be one no library uses, so a scan never sees your backups. The default is `printbench-backups`.
3. Choose **how often** (daily, weekly, twice a day, or a cron expression in the server's time zone) and how many to **keep**.
4. Choose a **passphrase**, at least 12 characters, and enter it twice.

Saving writes and deletes a small test file in the folder, so a key that can't write is caught now rather than at 02:30. **Back up now** takes one straight away, and the page lists recent runs, including any that failed and why. While scheduled backups use a connection, that connection can't be removed.

### The passphrase

Every scheduled backup is **encrypted as a whole**, email addresses and password hashes included. PrintBench never stores your passphrase, only a key that the passphrase unlocks:

- **PrintBench can write backups but can't read them.** Someone who gets hold of your bucket, or even the whole running server, can't open them.
- **Restoring needs only the backup file and the passphrase.** You don't need the old server or its `BETTER_AUTH_SECRET`.
- **The passphrase can't be recovered.** Lose it and the backups can't be opened. Keep it in your password manager, and use **Check your passphrase** now and then, while there's still time to change it.
- **Changing it starts a new key.** Backups from then on need the new passphrase. Older ones still need the old one, and the list marks them.

### Where backups go

Each PrintBench gets a folder of its own inside the backup folder: `<folder>/<instance id>/printbench-<time>.encrypted.pbbackup`. The instance id belongs to the server, not to the data:

- Restoring onto the same server carries on in the same folder.
- A new server restored from an old one's backup starts a folder of its own.
- Two servers pointed at the same bucket folder never share a subfolder, so neither can delete the other's backups.

Old backups are removed only after a new one has been written and seen in the bucket, only from this server's own folder, and only files PrintBench named. If the bucket starts failing, you keep the backups already in it.

### Restoring from a scheduled backup

**On the same server**, **Backups in the bucket** under the schedule lists this server's backups first, then any from other servers' folders in the same bucket folder (the server this one replaced, say). Choose **Restore…**, then **Fetch this backup**, enter the passphrase, check what it holds and confirm. Everything on this instance is replaced and everyone is signed out.

**On a new server**, open it for the first time, choose **Restore from a backup**, then **An S3 bucket**. Enter the bucket, its endpoint (blank for AWS) and region, a key that can read it, and the folder the old server backed up to (`printbench-backups` unless you changed it). **List backups** shows every backup in that folder, from every server, newest first. Choose one, enter its passphrase, check what it holds, and restore. The bucket details you type are used for that restore only and never saved: the restored database brings the old server's S3 connection back with it. Like the rest of first-run setup, this option closes as soon as any account exists. The schedule comes back with the rest of your settings, so the new server carries on backing up, into its own folder.

If you'd rather not type a key into the new server, copy the backup file out of the bucket with any S3 tool (your provider's web console, `aws s3 cp`, `rclone` and so on) and upload it under **A backup file** instead. It asks for the passphrase the same way.

A restore either completes or changes nothing. It goes into the same or a newer PrintBench, never an older one.

::: tip Nothing is left behind if you back out
While you review a backup, its decrypted copy is held on the server's data volume. **Cancel**, closing the panel and leaving the page all delete it at once. So does a failed restore, and anything a closed browser tab abandoned is deleted after an hour. This applies to backup files you upload as well.
:::

## 1. Your model files

Not PrintBench's problem, and deliberately so: the application never modifies the files in an existing library. Back them up however you already back up files.

The exception is an **upload library** (somewhere PrintBench writes to). Those files live on the data volume and exist nowhere else, so include `/data/libraries` in your backups.

## 2. The database

Everything you typed: tags, creators, licences, collections, print history, accounts.

```bash
docker compose exec db pg_dump -U printbench printbench > backup.sql
```

Restore into an empty database:

```bash
docker compose exec -T db psql -U printbench printbench < backup.sql
```

A dump also contains the built-in [filament catalogue](/guide/filaments#filament-catalogue). That's harmless: if it differs from the catalogue your PrintBench version ships, the worker replaces it at startup.

## 3. The metadata export

A readable JSON file that is independent of the Postgres version and survives a schema change:

```bash
npm run backup export backup.json
```

(`npx tsx scripts/backup.mts export backup.json` does the same.)

Restoring matches models by **(library path, model path)** rather than by id, so it works against a rebuilt database whose ids are all different, which is exactly the situation you're in when you need it:

```bash
npm run backup import backup.json -- --dry-run   # report only
npm run backup import backup.json
```

Scan your libraries **first** so the models exist, then import. The importer only **fills blanks** and never overwrites metadata you've entered since the export.

Version 2 exports also include filament specifications, spools, stock history and print usage snapshots, including which catalogue entry each filament and spool was added from. Imports still accept version 1 backups. New spools restore their saved stock changes directly, without deducting print consumption again. Existing spools retain their current balances and history. Usage links are restored for newly restored prints and spools; unavailable models retain stock history without a print link. Model sidecars do not contain filament inventory.

Thumbnails and model files aren't in the export. Thumbnails are regenerated by a scan, and the files are already on disk.

## 4. Uploaded photographs

[Photos](/guide/models#photos) attached to models live under `/data/photos` and exist nowhere else. Unlike thumbnails they cannot be regenerated, so the in-app backup carries them **always**, whether or not you asked it to include uploaded files — that option exists because a managed library can run to tens of gigabytes of meshes you still have elsewhere, which is not true of a photograph. A restore writes them back into the store.

If you are backing up by hand rather than through the app, include `/data/photos` alongside `/data/libraries`.

Portable backups exclude browser clipper connection tokens. After a restore,
generate new tokens and [reconnect your browsers](/guide/imports#use-the-browser-clipper).

They also leave out the built-in [filament catalogue](/guide/filaments#filament-catalogue), which
ships with PrintBench. After a restore the worker reloads the catalogue of the version you're
running, which takes a few seconds. Spools keep their links to it.

## The sidecar is the real safety net

With **Write metadata back to disk** on (the default) and a writable library, a [`.printbench.json`](/concepts/sidecars) is written beside each model holding its tags, creator, licence and notes. The database can then be rebuilt from disk alone: **drop it, migrate, rescan, and the metadata comes back**. A test performs exactly that drill.

It's worth doing once yourself, on purpose, before you need it.

::: warning Read-only libraries have no sidecars
In a library mounted read-only, PrintBench can't write sidecars, so the database is the only copy of your edits. Either set `LIBRARY_READ_ONLY=false`, or back up the database and the metadata export more carefully.
:::

## Don't forget the secret

For a quick-start install, back up the `credentials` volume along with `pgdata` and `data`. For a source-based deployment, keep a copy of **`BETTER_AUTH_SECRET`** with your backups. Restoring a database without the matching secret invalidates sessions and makes stored printer and S3 credentials unreadable.

[Scheduled backups](#scheduled-backups-to-s3) don't depend on the secret: they carry stored credentials under their own encryption, and need only the passphrase. Keep **that** safe instead.

## A simple routine

| What | How often |
| --- | --- |
| [Scheduled backups to S3](#scheduled-backups-to-s3) | Daily, set and forget |
| `pg_dump` of the database | Daily, if you don't use scheduled backups |
| Metadata export | Weekly, kept alongside the dump |
| Upload libraries | With your normal file backups |
| `credentials` volume or `.env` | With your database backup |
| Restore drill | Once, now |

## The restore drill

With scheduled backups:

1. In a throwaway environment, start a fresh stack, and **don't** set up an admin.
2. On the first-run screen, choose **Restore from a backup**, then **An S3 bucket**, list the backups and restore the newest with its passphrase.
3. Sign in with an account from the backup, and check tags, creators and print history look right.

Without them:

1. Take a `pg_dump` and a metadata export.
2. In a throwaway environment, start a fresh stack and set up an admin.
3. Re-add the library and scan.
4. Import the export (`--dry-run` first).
5. Check tags, creators and print history look right.
