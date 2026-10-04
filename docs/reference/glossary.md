# Glossary

**Archive sweep**. The nightly (03:45) job that removes models missing for longer than the grace period. The only scheduled job that deletes anything.

**Backend**. Where a library's bytes live: `local` (disk or NAS mount) or `s3`.

**Collection**. A nestable, user-made group of models. A model can be in many.

**Common subfolder**. A folder such as `stl`, `presupported` or `images` that always belongs to the model above it. See [How Models Are Grouped](/concepts/grouping).

**Container**. A folder that holds models but isn't one itself, such as a creator folder or a pack.

**Deep scan**. A scan that re-stats every file, rather than trusting directory timestamps.

**Fast scan**. The default scan; skips directories whose timestamps haven't changed.

**Grace period**. How long a missing model is kept before it can be removed. Default 30 days.

**Grouping mode**. The rule for turning folders into models: *Each folder*, *Top level* or *Fixed depth*.

**In-place library**. Internal name for **Files I already have**: indexed where they sit, never modified.

**Library**. A location PrintBench indexes. Configured per library: backend, kind, grouping, schedule, watching.

**Managed library**. Internal name for **Somewhere to upload to**: a folder PrintBench owns and writes into.

**Missing**. A model whose files couldn't be found at the last scan. Kept, hidden from counts, and recoverable.

**Model**. The unit PrintBench manages: usually one folder of files for one printable thing.

**Package**. A folder that owns shared files while keeping the models below it separate. Declared with `.printbench-package.json`.

**pg-boss**. The Postgres-backed job queue PrintBench uses instead of Redis.

**Pre-supported**. A mesh whose filename or folder indicates built-in print supports.

**Print host**. A network printer (OctoPrint, Moonraker or PrusaLink) that sliced files can be sent to.

**Print request**. An entry in the print queue.

**Prune**. See *archive sweep*.

**Rasteriser**. PrintBench's own software renderer, used to make thumbnails without a GPU or native toolchain.

**Sidecar**. A small JSON file (`.printbench.json`) beside a model that carries its metadata and declares it a model. See [Metadata & Sidecars](/concepts/sidecars).

**Slicer link**. A short-lived signed URL that lets a desktop slicer fetch one file as 3MF.

**tus**. The resumable-upload protocol PrintBench uses.

**Viewer / Member / Admin**. The three [roles](/reference/roles).

**Worker**. The Node process that scans, renders, uploads and streams ZIPs, as opposed to `web`.
