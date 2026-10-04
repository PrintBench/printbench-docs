# Downloads

Anyone who can view a model can download its files. Downloads are built so that a multi-gigabyte pack never ties up the web app.

## Single files

Each file in a model's file tree has a download link. Large files are handed off rather than streamed through the app:

- **Local and NAS libraries**: the app hands the transfer to nginx with `X-Accel-Redirect`, and nginx serves it with `sendfile`.
- **S3 libraries**: the browser is redirected to a **presigned URL** that expires after 15 minutes, so the bytes travel straight from the bucket and never enter PrintBench at all.

Both support HTTP `Range` requests, so downloads can resume and the 3D viewer can fetch only what it needs.

## Whole-model ZIPs

Download a whole model as a ZIP archive from its page. The archive is streamed by the **worker** process, one member at a time, and it is *stored* rather than deflated: mesh files barely compress, so skipping compression keeps CPU and memory flat. An 8 GB archive never occupies the web tier.

::: info S3 and ZIPs
For an S3 library a ZIP reads each file through the worker rather than redirecting, so on a metered provider it counts as egress. See [S3 & Compatible Storage](/deploy/s3#where-bytes-still-flow-through-the-worker).
:::

## Missing files

If a model's files can't be found on disk, the page shows **Missing from disk** and downloads are unavailable. This usually means a drive isn't mounted. Remount it and run a scan. See [Safety Guards](/concepts/safety).

## When a download 404s

If downloads fail with a 404 even though the app lists the files, nginx and the app disagree about where files live. In a custom deployment check that `ACCEL_MOUNTS` matches `docker/nginx.conf`. See [Troubleshooting](/deploy/troubleshooting#downloads-404).
