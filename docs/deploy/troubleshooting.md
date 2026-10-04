# Troubleshooting

Start with the logs:

```bash
docker compose ps
docker compose logs --tail=200 web worker
```

`/api/health` returns the process status and is what the container healthcheck uses.

## Starting up

**Compose refuses to start.** `POSTGRES_PASSWORD` or `BETTER_AUTH_SECRET` is empty in `.env`. Both are required on purpose.

**Postgres refuses to start with a data-directory error.** Postgres 18 expects the volume at `/var/lib/postgresql`, not `/var/lib/postgresql/data`. Fix the mount; the container won't use the old convention.

**Coolify: `Invalid volume source: contains forbidden character '${'`.** You have an older 0.5.0 compose file. Use the long-form library mounts from the current file. See [Coolify](/deploy/coolify#library-mounts-and-the-coolify-volume-parser).

**I can't reach the app.** For local use make sure you included `docker-compose.local.yml`. Behind a proxy, check the proxy targets the **`nginx`** service on port 80, not `web`.

## Signing in

**Sign-in or actions fail with origin errors behind a proxy.** `APP_URL` and `BETTER_AUTH_URL` don't match the public address, or the proxy isn't passing the original `Host` header (including its port). See [Reverse Proxy & TLS](/deploy/reverse-proxy).

**Everyone was signed out and printers stopped working.** `BETTER_AUTH_SECRET` changed. Restore the old value, or re-enter printer keys and S3 secrets.

**I'm locked out.** See [Password Recovery](/admin/password-recovery).

**`/setup` redirects to sign-in.** An account already exists; setup closes permanently after the first user.

## Scanning

**Scanning does nothing.** Check the library has scanning enabled and a schedule (**Manage → Libraries**). Scheduled scans are *fast* scans, which trust directory timestamps; run a **deep scan** by hand if files were edited in place.

### A scan aborted

That's deliberate. Look at **Manage → Libraries** for the reason:

| Reason | Meaning |
| --- | --- |
| `storage_unavailable` | The root couldn't be read. |
| `empty_root` | The root is empty but the database knows of models. |
| `mass_disappearance` | More than 20% of models vanished at once, which is nearly always an unmounted drive, not a deletion. |

Remount and rescan.

### Everything is marked missing

The library root was unreadable at scan time. Remount and rescan. Nothing is deleted until the grace period expires, and the archive sweep refuses to touch a library where every model is missing.

### A pack split into too many models (or merged into one)

Change the library's grouping mode, or drop a `.printbench.json` in the folder you want to be a single model. See [How Models Are Grouped](/concepts/grouping).

## Previews

**Thumbnails never appear.** The worker renders them, so check its logs. A maintenance sweep re-queues anything left pending every 15 minutes, so a missing thumbnail should heal itself within that window.

**The 3D viewer says the model is too big.** It loads meshes up to a size limit and shows the thumbnail otherwise. Raise **Load meshes in the viewer up to** in [Instance Settings](/admin/settings), or choose to load anyway.

**S3: everything works except the 3D viewer.** The bucket's CORS rule is missing, or its `AllowedOrigins` doesn't exactly match `APP_URL`. See [S3 & Compatible Storage](/deploy/s3#step-3-cors-for-the-3d-viewer).

**A 3MF reports an analysis error but downloads fine.** It exceeded a size budget (512 MiB compressed or 256 MiB expanded). The file stays indexed and downloadable. See [Large Libraries & Memory](/deploy/large-libraries).

## Downloads and uploads {#downloads-404}

**Downloads 404 although the app lists the files.** nginx and the app disagree about where files live. In a custom deployment `ACCEL_MOUNTS` must match `docker/nginx.conf`.

**Uploads fail near the end of a large file.** For S3, the key is missing `s3:AbortMultipartUpload`, or the data volume ran out of space while staging. Otherwise check proxy request buffering and timeouts.

**Uploads aren't accepted.** No library of the *somewhere to upload to* kind exists. Add one under [Libraries](/admin/libraries).

## Worker crashes or restarts

Check for out-of-memory exits and enable `WORKER_MEMORY_LOG=1`. See [Large Libraries & Memory](/deploy/large-libraries).

## Printers and imports

**Send to printer fails.** Use **Test connection** on **Manage → Printers**; it reports what's wrong ("Could not resolve …", "The printer rejected the API key"). The *web* container must be able to reach the printer.

**A MakerWorld import fails.** The saved cookie may have expired, or the provider changed its response. These endpoints are unofficial. See [Importing from Model Sites](/guide/imports#limits-and-caveats).

## Still stuck?

Search the [issue tracker](https://github.com/PrintBench/printbench/issues) and open a new issue with your version, how you deploy, and the relevant log lines. **Don't** include secrets. For security problems use [private reporting](/contributing/security).
