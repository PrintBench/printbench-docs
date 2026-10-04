# Model Packages

A **package** is a directory that owns shared files while keeping the printable models below it separate. It is useful for creator bundles that contain common instructions, licences, archives or images alongside several model folders.

## Declaring a package

Place a `.printbench-package.json` file in the package's root:

```text
TitanPals Cosmic Duo/
├── .printbench-package.json
├── Assembly Instructions.pdf
├── Complete Package.zip
├── preview.webp
├── Astro/
│   ├── .printbench.json
│   └── astro.stl
└── Rocket/
    ├── .printbench.json
    └── rocket.stl
```

The package sidecar uses the same versioned JSON fields as a model sidecar:

```json
{
  "version": 1,
  "name": "TitanPals Cosmic Duo",
  "creator": "TitanPals",
  "notes": "Two related assembly kits",
  "tags": ["kit", "space"],
  "previewFile": "preview.webp"
}
```

## What the package page shows

![A package page listing its child models and the files it owns directly](/images/guide/package.png)

1. The package preview.
2. Links to the child models.
3. Files owned directly by the package, including files in conventional image folders.

Files inside child model directories stay attached to their own models and are **not** duplicated into the package.

## Package vs model sidecar

The two sidecars do opposite things on purpose:

| File | Declares | Effect on the folders below |
| --- | --- | --- |
| `.printbench.json` | One model | **Absorbs** its whole subtree into that single model. |
| `.printbench-package.json` | A package | **Preserves** every model boundary below it. |

Both files are metadata only. PrintBench continues to index the original directory structure in place and never moves or duplicates creator files.

## In search

Search has a **Type** facet, *Models* or *Packages*, so you can look at bundles alone or exclude them. See [Search & Filters](/guide/search).

See also: [Metadata & Sidecars](/concepts/sidecars) and the [Sidecar File Format](/reference/sidecar-format).
