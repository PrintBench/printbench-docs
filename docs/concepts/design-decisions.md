# Design Decisions

The reasoning behind the choices that shape how PrintBench behaves. Each one exists because the alternative went wrong somewhere.

## Infrastructure

- **No Redis.** Jobs run on pg-boss, backed by Postgres.
- **No Elasticsearch.** Search is a weighted Postgres `tsvector` with a GIN index plus trigram matching for typos. Search state lives in the URL, so a filtered search is shareable and the back button works. See [Search Internals](/concepts/search).
- **No native render toolchain.** A z-buffer software rasteriser streams triangles, so a 6 GB STL renders in bounded memory, something neither headless Chromium nor headless-gl can do. It's deterministic, so renders are golden-image tested, and identical on Windows and Linux. See [Previews & Thumbnails](/concepts/previews).
- **Mesh parsing is pure TypeScript**: STL (binary and ASCII), 3MF, OBJ and PLY, with no compiled dependencies. A slicer-exported 3MF's embedded plate render is used in preference to rasterising.
- **Large downloads bypass Node** via `X-Accel-Redirect` to nginx, or a presigned URL on S3. Whole-model ZIPs are streamed from the worker, stored rather than deflated, so an 8 GB archive never occupies the web tier.
- **The 3MF parser is isomorphic.** The same code produces the server-side thumbnail and the in-browser view. three's own `3MFLoader` can't run in a Web Worker, because it depends on `DOMParser`.

## Data

- **Metadata is written back to disk** as a `.printbench.json` sidecar per model, so the database can be rebuilt by rescanning. That restore drill is covered by tests, not just intent. The file is also a declaration: drop one into a folder by hand and that folder becomes a single model. The app never writes one into a folder that has models inside it, so editing a tag can't merge them behind your back. See [Metadata & Sidecars](/concepts/sidecars).
- **A success rate is null, not zero, until something settles.** A model whose only print is still running has no verdict yet, and showing 0% reads as a failure.
- **Counts exclude missing models.** A creator page promising forty models when eight are on an unplugged drive sends you looking for something that isn't there.

## Uploads and imports

- **Uploads are resumable** (tus), handled by the worker so a multi-gigabyte transfer never occupies the web tier. Folder structure from a drag-and-drop is preserved, because that structure is what groups files into models. A `.zip` is extracted server-side rather than stored whole, with a zip-slip guard on every entry.
- **New 3MF files supply embedded metadata.** Titles, designers, descriptions, licences, source-file dates and covers are read by the worker, with existing edits and sidecars taking precedence. Recognised MakerWorld project IDs also resolve public tags and details automatically, with no cookie required.
- **MakerWorld links import files and details.** Save your own account cookie in Account settings, then paste a model URL on Upload. See [Importing from Model Sites](/guide/imports) for the session requirements, limits and the unofficial-API caveat.

## Storage

- **S3 is a full backend, not just a source.** A library can live on local disk, a NAS mount or an S3-compatible bucket, and read *and* write the same either way: uploads, zip extraction, sidecars and deletion all go through one storage interface. Uploads to a bucket are multipart, so peak memory is the in-flight window rather than the size of the file; verified at 128 MB against MinIO with `npm run verify:s3`.
- **Scanning refuses to destroy metadata.** If a scan would mark more than 20% of models missing (an unmounted NAS, say) it aborts and asks an admin. The nightly prune additionally refuses to touch a library where *every* model is missing, whatever the grace period says, because that is an unplugged drive rather than a deletion. See [Safety Guards](/concepts/safety).

## Scheduling

- **Scan schedules are evaluated, not registered.** pg-boss keeps one schedule per queue name, so per-library crons are decided by a sweep comparing the last fire time against the last scan. A schedule change takes effect at once, and a scan missed while the worker was down is picked up rather than skipped.
- **Live watching is optional and off by default**, per library, on top of the schedule. Recursive watching costs one inotify watch per directory and can exceed the OS limit on a very large library, so it's opt-in. The worker reconciles its active watchers against the database on the same kind of sweep, so turning it on or off takes effect within a minute with nothing to restart.

## Slicers and printers

- **Slicer hand-off converts to 3MF.** Bambu Studio's URL handler refuses any extension but `.3mf`, and checks *before* downloading, so a link to an STL fails without a request ever reaching the server. Meshes are repackaged as 3MF on the way out, which every other slicer reads too. An existing 3MF is passed through untouched, so a project keeps its plates and painted supports. Geometry is preserved; colour on an OBJ or PLY is not, and the UI says so.
- **The link only appears where it can work.** Because delivery is always 3MF, the question is what *we* can convert (STL, OBJ, PLY, 3MF) rather than what each slicer reads. STEP is the difference: slicers open it happily, we can't produce a 3MF from it without a CAD kernel, so no link is offered. The offer and the converter share one list precisely so they can't drift.
- **Slicers are handed the file, not driven.** Every modern slicer registers a URL scheme, so *Open in…* covers Bambu Studio, Creality Print, Orca, PrusaSlicer, Cura and Lychee at once, and works for printers with no network API. This is also the honest answer for Bambu specifically: pushing to their printers means FTPS plus MQTT with LAN mode enabled, where Bambu Studio already knows how.
- **Slicer links are signed.** A desktop slicer fetches the URL as a separate application with none of our cookies, so the link carries a short-lived HMAC naming that one file, rather than the endpoint being opened up.
- **Printer credentials are encrypted at rest** (AES-256-GCM, keyed from `BETTER_AUTH_SECRET`), because an API key has to be replayed to the printer and so can't be hashed. A database dump alone doesn't hand over the printers.

## Browsing

- **Packages preserve boundaries; model sidecars absorb them.** The two sidecars do opposite things on purpose. See [Model Packages](/guide/packages).
- **Tag merge exists** because tags arrive from filenames, sidecars and typing, so a library reliably grows *dragon*, *Dragon* and *dragons* meaning the same thing.
- **Collections nest** because a Kickstarter pledge is genuinely a collection of collections, and deleting one never touches what's inside it.

## The web tier

- **It never does heavy I/O.** A change that streams a big file through a Next.js route is a change in the wrong direction. See [Conventions & Invariants](/contributing/conventions).
