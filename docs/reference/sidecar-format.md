# Sidecar File Format

Two JSON files carry metadata beside your models. Both are **metadata only**, neither moves nor duplicates your files.

| File | Where | Meaning |
| --- | --- | --- |
| `.printbench.json` | A model's folder | Declares **one model** and absorbs its subtree. |
| `.printbench-package.json` | A package's root | Declares a **package** and preserves every model boundary below. |

Both use the same schema.

## Example

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
  "links": [{ "url": "https://example.com/red-dragon", "title": "Source" }],
  "previewFile": "images/preview.png"
}
```

## Fields

| Field | Type | Required | Notes |
| --- | --- | :---: | --- |
| `version` | positive integer | ✅ | Currently `1`. A file with a **newer** version than the reader supports is ignored with an error rather than half-read. |
| `generator` | string | | Written as `printbench`. Informational. |
| `updatedAt` | ISO 8601 string | | Informational; excluded when checking whether a rewrite is needed. |
| `name` | string, 1–500 chars | | Must not be blank. |
| `notes` | string ≤ 20,000 chars, or `null` | | |
| `license` | string ≤ 120 chars, or `null` | | Use standard identifiers like `CC-BY-4.0` so licences group together. |
| `creator` | string, 1–225 chars, or `null` | | Must not be blank if present. |
| `tags` | array of strings (≤ 200 items, ≤ 120 chars each) | | Written sorted. |
| `links` | array of `{ "url", "title"? }` (≤ 50 items; url ≤ 2000, title ≤ 300 chars) | | Source links shown on the model page. |
| `previewFile` | path string ≤ 1000 chars, or `null` | | Path to an image or mesh **relative to the model folder**. Overrides the automatic choice. |

Unknown or invalid shapes (a non-array `tags`, an empty `name`, and so on) cause the file to be **rejected**, not partially applied.

## Writing one by hand

Minimal file to declare a folder a single model:

```json
{ "version": 1, "name": "My Pack" }
```

Save it as `.printbench.json` in the folder and rescan. Because dotfiles are normally ignored, PrintBench treats these two filenames as named exceptions.

## Behaviour notes

- Rewrites are **idempotent**: a file isn't rewritten when its meaningful content hasn't changed, so backups and sync tools don't churn.
- A sidecar is **never written** into a folder that has models inside it.
- Sidecars are only written for libraries that allow it. See [Metadata & Sidecars](/concepts/sidecars#when-sidecars-are-written).
- Restoring from sidecars is an admin-only scan option.

See also: [Model Packages](/guide/packages) and [How Models Are Grouped](/concepts/grouping#taking-control-with-a-sidecar).
