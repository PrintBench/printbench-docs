# Storage & NAS Mounts

PrintBench has three storage concerns, and they aren't equally precious.

| Path in the containers | Holds | If you lose it |
| --- | --- | --- |
| `/libraries` (your `LIBRARY_PATH`) | The model files you already have | The models, but you already back these up. |
| `/data` (the `previews` volume) | Thumbnails, derived assets, upload staging, upload libraries (`/data/libraries`) | Thumbnails regenerate on a scan. **Upload libraries are real data**; back them up. |
| `/var/lib/postgresql` (the `pgdata` volume) | The database | Everything you typed, unless you have sidecars or a backup. |

## Local folders

Set `LIBRARY_PATH` to a host folder. It's mounted read-only at `/libraries`. Several libraries can live under that one mount as different sub-folders.

To use more than one host folder, add extra bind mounts in an override file and make sure `LIBRARY_ROOTS` and, for downloads, nginx's mounts and `ACCEL_MOUNTS` all include them. `ACCEL_MOUNTS` **must match** `docker/nginx.conf`, or downloads 404 while the app believes they succeeded.

## Network storage (NAS)

A NAS share is just a path: mount it on the **host** and point `LIBRARY_PATH` at it. Nothing in the application knows the difference.

### SMB / CIFS

- Mount with **`nobrl`** if you see sporadic locking errors.
- Prefer **`vers=3.0`** or later.
- A scan reads directory timestamps, which some SMB configurations don't update reliably. If scheduled scans miss changes, run a **deep scan** (which re-stats every file) on a weekly schedule instead.

### If the share is unmounted

**If the share isn't mounted, the library root disappears and every model looks missing.** The scan refuses to act on this:

- It aborts if the root is unreadable.
- It aborts if the root is empty while the database knows of models.
- It aborts if more than **20%** of models would be marked missing.
- The nightly archive sweep skips any library where *every* model is missing.

You have to remount and rescan; nothing is deleted in the meantime. See [Safety Guards](/concepts/safety).

Make sure the share is mounted *before* Docker starts the containers (for example with a systemd dependency), so the bind mount doesn't capture an empty directory.

## Permissions

PrintBench reads the library as the user running the container. If files are only readable through a group, add that group's numeric GID to `group_add` for `web` and `worker`. For libraries PrintBench writes to (upload libraries, or an existing library with `LIBRARY_READ_ONLY=false`) the process also needs write access.

## Upload staging and S3

Uploads are staged on the data volume (`$DATA_DIR/uploads`) before they move to their destination. For an S3 library that still means a persistent data volume with room for your largest in-flight upload. Thumbnails stay on local disk under `DATA_DIR` too. See [S3 & Compatible Storage](/deploy/s3#what-changes-once-a-library-lives-in-a-bucket).

## Capacity planning

- **Database:** modest, metadata, search index and job queue. Gigabytes at most for large libraries.
- **Thumbnails:** a few hundred KB per model.
- **Uploads:** as large as your biggest file, per concurrent upload.
