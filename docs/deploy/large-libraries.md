# Large Libraries & Memory

A larger Node heap can temporarily let a workload finish, but it isn't a substitute for reducing retained data. Library size on disk alone doesn't predict peak memory: file count, decompressed mesh complexity and overlapping jobs all matter.

## What PrintBench already does for you

- **A software rasteriser that streams triangles**, so a 6 GB STL renders in bounded memory.
- **A 3MF parser that writes geometry straight into chunked typed arrays**; the XML tree retains only the object, component and build structure. It skips unrelated ZIP contents such as slicer G-code.
- **Hard budgets.** The combined expanded size of geometry, root relationships and images is capped at **256 MiB** before entries are extracted; compressed input is capped at **512 MiB**, checked up front for files with known sizes and continuously while reading (including stale size metadata). A file over budget is reported as an analysis/thumbnail failure; it stays indexed and downloadable.
- **Multipart S3 uploads** whose peak memory is the in-flight window, not the file size.
- **Transfers off the web tier**: nginx and presigned URLs for downloads, the worker for uploads and ZIPs.

## A reproduced 3MF failure

The previous 3MF parser retained XML objects for every vertex and triangle before copying values into typed arrays. A generated 3MF with 250,000 triangles and 750,000 vertices (about 2 MB compressed) exhausted a 128 MiB Node heap; with a 1,024 MiB heap it completed at roughly 452 MiB peak RSS (Node 26 on macOS). The current parser completes the same fixture under the 128 MiB limit at roughly 175 MiB peak RSS. RSS includes buffers and native allocations outside the JavaScript heap, so the heap limit isn't an RSS limit.

Reproduce from the repository root:

```sh
node --import tsx scripts/benchmark-mesh-memory.mts 250000 128
```

Fixture generation happens in a parent process; the reported memory belongs only to a fresh child process parsing the fixture. The test suite also runs this workload with the fixed heap limit. Results vary by Node version and platform.

::: info What this does and doesn't prove
These changes address a reproduced 3MF hotspot. They don't establish that every reported NAS scan crash had that cause: the directory walk still builds an in-memory tree, and other mesh formats have different allocation patterns.
:::

## Diagnosing a real workload

Set `WORKER_MEMORY_LOG=1` in `.env` and recreate the worker so Compose applies the setting. It defaults to off.

```bash
docker compose up -d --force-recreate worker
```

Run a **deep scan** and inspect the worker logs for `[worker-memory]` entries:

- Job start, end and error entries and 15-second samples include file and library IDs.
- Scan-phase entries distinguish **walking**, **grouping** and **reconciliation**.
- RSS, heap, external buffers and the process lifetime **peak RSS** are reported in MiB.

Caveats:

- Measurements are **process-wide**, not attributed to a single job; jobs can overlap.
- Timers can't sample during synchronous XML parsing, but the OS peak-RSS counter retains the high-water mark.
- A fatal out-of-memory exit can't emit an end or error entry; the preceding job starts identify candidates.

For a reproducible crash, record the active file ID, format, compressed and expanded sizes, scan phase and container memory limit before choosing a fix.

Switch the flag off and recreate the worker after collecting logs. The diagnostics log identifiers and counts, **not** filenames or file contents.

## Tuning

| Setting | Effect |
| --- | --- |
| `RENDER_CONCURRENCY` | Concurrency of the CPU-bound render/analyse pool. Defaults to CPU count minus one. Lower it on a small host to reduce peak memory. |
| Container memory limit | Give the worker comfortable headroom; a hard limit shows up as an abrupt exit. |
| Scan schedule | Fast scans skip unchanged directories; use deep scans sparingly on very large libraries. |
| Live watching | Costs one inotify watch per directory; leave it off on huge trees. See [Scanning & Schedules](/admin/scanning#live-watching). |
