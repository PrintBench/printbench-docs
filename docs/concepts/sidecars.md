# Metadata & Sidecars

Everything you type, tags, creator, licence, notes, lives in Postgres. But PrintBench also writes it back to disk, beside the model, as a small JSON **sidecar** file. That is what makes the database rebuildable.

## `.printbench.json`

One per model, in the model's folder:

```json
{
  "version": 1,
  "generator": "printbench",
  "updatedAt": "2026-01-15T09:30:00.000Z",
  "name": "Red Dragon",
  "notes": "A big one",
  "license": "CC-BY-4.0",
  "creator": "Loot Studios",
  "tags": ["dragon", "miniature"],
  "previewFile": "images/preview.png"
}
```

Tags are written in a stable sorted order and the file isn't rewritten if nothing actually changed, so it doesn't churn your backups or sync tools. See the [Sidecar File Format](/reference/sidecar-format) for every field.

## What it's for

| Purpose | How |
| --- | --- |
| **Rebuild the database** | Drop it, migrate, rescan, metadata comes back from disk. A test performs this restore drill. |
| **Declare a model** | Drop one in a folder by hand and that folder becomes a single model, whatever the grouping heuristic decides. |
| **Survive removal** | Restoring a removed model rebuilds it from its files and sidecar, so notes and tags come back *only if they were written to one*. |
| **Carry imported details** | Imports from model sites write source links and metadata into sidecars. |

## When sidecars are written

Only when **both** are true:

- **Write metadata back to disk** is on in [Instance Settings](/admin/settings) (the default), and
- the library is **writable** (an upload library, or an existing library with `LIBRARY_READ_ONLY=false`).

In a read-only library no sidecar is written, and the database is the only copy of your edits. Back it up accordingly.

## Precedence

Embedded 3MF metadata and imported details only **fill blanks**: existing database records, your edits (including deliberately cleared fields) and sidecar metadata all take precedence over them. A name worked out from the folder is the weakest source and is replaced by an embedded title, but never by anything over an explicitly edited name.

## Safety rules

- The app **never writes a sidecar into a folder that has models inside it**, so editing a tag can't merge them behind your back.
- A sidecar written by a *newer* PrintBench version than the one reading it is **ignored with an error** rather than risk silently dropping fields.
- Invalid sidecars (wrong types, empty names) are rejected rather than half-applied.
- Sidecars and metadata files are **never indexed as model files**.

## `.printbench-package.json`

The package sidecar uses the same fields but means something different: it declares a **package** and *preserves* every model boundary below it. See [Model Packages](/guide/packages).

## Sidecars and the metadata export

The [metadata export](/deploy/backups#_3-the-metadata-export) is a separate, version-independent JSON file produced by `npm run backup export`. Sidecars protect you from losing the database; the export protects you from losing both the database *and* read-only libraries' edits. Use whichever fits your setup, ideally both.
