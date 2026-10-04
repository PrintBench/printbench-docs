# Supported File Formats

PrintBench indexes many file types, but only a few get every feature.

## Previews, viewing and slicer links

| Format | Indexed | Thumbnail | 3D viewer | Open in… slicer |
| --- | :---: | :---: | :---: | :---: |
| **STL** (binary, ASCII) | ✅ | ✅ | ✅ | ✅ (converted to 3MF) |
| **3MF** | ✅ | ✅ (embedded plate render preferred) | ✅ | ✅ (passed through untouched) |
| **OBJ** | ✅ | ✅ | ✅ | ✅ (converted; colour not preserved) |
| **PLY** | ✅ | ✅ | ✅ | ✅ (converted; colour not preserved) |
| **STEP / STP** | ✅ | n/a | n/a | No (no CAD kernel to convert) |

## Other model formats

Indexed and downloadable, with no rendered preview or slicer link: **IGES/IGS**, **AMF**, **glTF**, **GLB**, **COLLADA (DAE)**, **FBX**, **OFF**, **VRML (WRL)**, **X3D**, **MTL**, **OpenSCAD (SCAD)**, **Fusion 360 (F3D)**, **FreeCAD (FCSTD)**, **Blender (BLEND)**, **DXF**.

## Sliced and printer files

| Extension | Kind | Notes |
| --- | --- | --- |
| `gcode` | G-code | **Send** to a printer. Metadata (printer, material, temperatures…) can fill in a [print log entry](/guide/print-history). |
| `bgcode` | Binary G-code (Prusa) | **Send** to a printer. |
| `sl1` | Prusa SL1 | **Send** to a printer. |
| `ctb` | Chitubox | **Send** to a printer. |
| `cbddlp` | Chitubox | Stored with the model. |
| `3mf` | Sliced project | Can be sent when it is a sliced 3MF. |
| `photon`, `goo`, `lys`, `lyt` | Resin / Lychee | Stored with the model. |

## Images

`png`, `jpg`/`jpeg`, `webp`, `gif`, `avif`, `bmp`, `tif`/`tiff`, `svg`, used as model covers. See [Previews & Thumbnails](/concepts/previews).

## Archives, documents and video

| Category | Extensions |
| --- | --- |
| Archives | `zip`, `rar`, `gz`, `tar`, stored; **`.zip` uploads are extracted** (see [Uploading](/guide/uploading)). |
| Documents | `pdf`, `txt`, `md`, `nfo`, `url`, `html` |
| Video | `mp4`, `webm`, `mov` |

## Metadata and housekeeping files

- `.printbench.json` and `.printbench-package.json` are metadata, never indexed as model files. See the [Sidecar File Format](/reference/sidecar-format).
- Temporary and system files (`.DS_Store`, `Thumbs.db`, `*.tmp`, `*.part`, …) are ignored. See [How Models Are Grouped](/concepts/grouping#ignored-files-and-folders).

## Size limits

| What | Limit |
| --- | --- |
| Uploaded file | 8 GB each |
| 3MF compressed input | 512 MiB |
| 3MF expanded geometry, relationships and images | 256 MiB combined |
| Imported model file | 512 MiB each, 20 files per import |
| Viewer mesh load | 150 MB by default (admin setting) |

Files over a parsing budget stay indexed and downloadable; only analysis and thumbnails are skipped. See [Large Libraries & Memory](/deploy/large-libraries).
