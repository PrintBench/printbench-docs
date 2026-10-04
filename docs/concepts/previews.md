# Previews & Thumbnails

PrintBench renders previews itself, in pure TypeScript, with no native toolchain. That is a deliberate choice with some interesting consequences.

## A software rasteriser

A **z-buffer software rasteriser** streams triangles, so even a **6 GB STL** renders in bounded memory, something neither headless Chromium nor headless-gl can do. It is also **deterministic**:

- Renders are **golden-image tested**.
- Output is byte-identical on Windows and Linux.
- There is nothing to install on the host: no GPU, no GL drivers, no browser.

If a golden test fails, the render genuinely changed; the fixture shouldn't be refreshed without understanding why.

## Parsers

Mesh parsing is pure TypeScript. STL (binary and ASCII), 3MF, OBJ and PLY, with no compiled dependencies. Parsing is bounded: see [Large Libraries & Memory](/deploy/large-libraries) for the 3MF budgets.

### The 3MF parser is isomorphic

The same code produces the server-side thumbnail **and** the in-browser 3D view. three.js's own `3MFLoader` can't run in a Web Worker because it depends on `DOMParser`, so PrintBench uses its own parser in both places.

## What gets shown

A model's preview is chosen in this order:

1. A creator-supplied or cover image (names like `preview`, `cover`, `thumb`, `render`, `main`, or matching the model name).
2. An image in an `images`/`img`/`pics`/`photos` folder.
3. Any image.
4. The largest previewable mesh.

For a **slicer-exported 3MF**, its embedded plate render is used in preference to rasterising. When several covers are available, higher-resolution artwork is preferred over small thumbnails and plate renders.

A sidecar's `previewFile` overrides the choice. See [How Models Are Grouped](/concepts/grouping#choosing-the-preview-file).

## States

Each derived artefact (thumbnail, geometry analysis) is `pending`, `ok`, `failed` or `skipped`. The UI shows processing labels, and **updates previews automatically as renders finish**; no refresh needed. A maintenance sweep every 15 minutes re-queues anything left pending, so a missing thumbnail heals itself.

A mesh that can't be parsed (truncated, corrupt, over budget) shows up as a *Could not be read* [health problem](/admin/health); the file stays indexed and downloadable.

## Model cards vs artwork

Cards describe the **printable file format** (STL, 3MF…) independently of the artwork shown, so a model whose cover is a WEBP still reads as, say, *3MF*.

## The interactive viewer

The model page can switch from the thumbnail to a live 3D view. It fetches the mesh with `fetch()` and parses it in a Web Worker. It loads meshes up to the **viewer size limit** (default 150 MB; see [Instance Settings](/admin/settings)); larger ones show the thumbnail with the option to load anyway. Switching retains the loaded model and camera, and pauses rendering while the thumbnail is shown.

For S3 libraries the viewer needs a CORS rule on the bucket; downloads and thumbnails don't. See [S3 & Compatible Storage](/deploy/s3#step-3-cors-for-the-3d-viewer).

## Concurrency

Rendering and analysis run in a CPU-bound pool. `RENDER_CONCURRENCY` sets its size (default: CPU count minus one).
