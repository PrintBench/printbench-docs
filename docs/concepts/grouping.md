# How Models Are Grouped

Deciding which directories are *models* is the highest-risk logic in PrintBench. Get it wrong one way and a 400-model library becomes 5,000 junk rows; wrong the other way and a whole Kickstarter drop collapses into a single entry.

The shape it has to cope with, drawn from how people actually store prints:

```text
Dragons/                     ← container (a pack), not a model
  Red Dragon/                ← model
    stl/                     ← common subfolder, belongs to Red Dragon
    presupported/            ← ditto
    images/                  ← ditto
  Blue Dragon/               ← model
loose-benchy.stl             ← a model in its own right
```

## The rules, in order

For each directory, PrintBench applies the first rule that fits:

1. **A package sidecar** (`.printbench-package.json`): the directory becomes a *package* owning its own shared files, and every real child directory is still grouped normally. See [Model Packages](/guide/packages).
2. **A model sidecar** (`.printbench.json`): an explicit declaration that always wins. The **whole subtree** becomes that one model.
3. **Fixed-depth mode**: only directories at exactly the configured depth become models; shallower ones are containers.
4. **A leaf**: has model files and no model subfolders → a model.
5. **A container**: no files of its own but models beneath → recurse, don't emit.
6. **Ambiguous**: files of its own *and* model subfolders:
   - In **Top level** mode, the whole thing is one model.
   - In **Each folder** (deepest) mode, each child is its own model, and the directory's own files become a model too. The nesting is recorded, a *Model inside another model* [problem](/admin/health) is raised, and the UI can offer a merge.
7. **Nothing here**: recurse, in case of empty intermediate folders.

Loose model files sitting directly in a container or at the library root become **one model each**, simpler than inventing a folder for them.

## Common subfolders belong to the model

These folder names are always part of the model above them, to any depth (`stl/presupported/` and both levels belong to the same model):

`3mf`, `chitubox`, `fdm`, `files`, `gcode`, `image`, `images`, `img`, `lychee`, `lys`, `parts`, `photos`, `pics`, `presupported`, `pre-supported`, `print`, `prints`, `resin`, `sla`, `source`, `sources`, `stl`, `stls`, `supported`, `unsupported`

If someone genuinely has a model *called* "stl" this misfires, which is why a *nested model* problem is raised and the grouping mode can be changed.

## Ignored files and folders

Never indexed: `Thumbs.db`, `desktop.ini`, `.DS_Store`, `.directory`, `ehthumbs.db`; folders `__MACOSX`, `@eaDir` (Synology), `#recycle`, `$RECYCLE.BIN`, `System Volume Information`, `.git`, `node_modules`; and temporary files (`.tmp`, `.temp`, `.part`, `.crdownload`, `.partial`, `~$…`, `.trash…`). The two PrintBench sidecar files are the one exception to "dotfiles are ignored".

## The three modes

| Mode | Behaviour | Pick it when |
| --- | --- | --- |
| **Each folder** (`deepest`) | Every folder holding model files is a model. | Most collections. |
| **Top level** (`top_level`) | A folder and everything beneath it is one model. | Sets have variants in subfolders. |
| **Fixed depth** (`flat`) | Only folders at a set depth are models. | Rigid organisation. |

Use the **dry run** when adding a library to see what a mode produces *before* committing. See [Libraries](/admin/libraries#adding-a-library).

## Taking control with a sidecar

The grouping heuristic can't know your intent. A `.printbench.json` dropped into a folder **declares it to be a single model**, whatever the heuristic would otherwise decide. That's how you stop a pack with subfolders from splitting into one model per subfolder.

```bash
echo '{"version":1,"name":"My Pack"}' > "/path/to/My Pack/.printbench.json"
```

The next scan picks it up. See the [Sidecar File Format](/reference/sidecar-format).

The app writes sidecars itself in writable libraries, but it **never writes one into a folder that has models inside it**, so editing a tag can't merge them behind your back.

## Formats it recognises as models

STL, 3MF, OBJ and PLY can be previewed. Other model formats. STEP, STP, IGES, AMF, glTF/GLB, COLLADA, FBX, OFF, VRML, X3D, OpenSCAD, Fusion 360, FreeCAD, Blender, DXF, count as model files for grouping but get no rendered preview. Sliced files (G-code, bgcode, Chitubox, Photon, SL1, GOO, Lychee) are stored with the model. See [Supported File Formats](/reference/file-formats).

## Choosing the preview file

A model's preview is picked in this order: an image named like a cover (`preview`, `cover`, `thumb`, `thumbnail`, `render`, `main`) or like the model; then an image in an `images`/`img`/`pics`/`photos` folder; then any image; then the largest previewable mesh. Creator-supplied images win because they're almost always better than a rendered one. A sidecar's `previewFile` overrides this. See [Previews & Thumbnails](/concepts/previews).

## Pre-supported detection

A mesh is flagged **pre-supported** when its filename or any ancestor folder matches names like `presupported`, `pre-supported`, `presup`, `supported`, `sup` or `w/supports`. That powers the **Pre-supported** [search filter](/guide/search#filters).
