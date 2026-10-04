# Models

A **model** is the unit PrintBench works in: usually one folder of files for one printable thing, with its own name, preview, tags, creator, licence, notes and print history. How folders become models is explained in [How Models Are Grouped](/concepts/grouping).

![The Models page: a grid of cards with thumbnails, file counts, sizes and dimensions](/images/guide/models-grid.png)

## The model page

Open any model from the grid, search results or the command menu.

![The model page](/images/guide/model-page.png)

### Preview

The preview defaults to the **thumbnail**. When both exist, **Thumbnail** and **3D model** controls switch between the thumbnail and an interactive viewer. Switching keeps the loaded model and camera, and pauses rendering while the thumbnail is showing.

![The interactive 3D viewer on a model page](/images/guide/model-viewer.png)

The 3D viewer loads meshes up to a size limit (an admin setting; see [Instance Settings](/admin/settings)). Bigger models show their thumbnail instead, with the option to load anyway.

::: tip Where thumbnails come from
If a 3MF exported from a slicer contains an embedded plate render, PrintBench uses that in preference to rasterising. Otherwise it renders one itself. Model cards show the *printable* format (STL, 3MF…) even when the chosen artwork is an image such as a WEBP. See [Previews & Thumbnails](/concepts/previews).
:::

### Header actions

![The Collections menu on a model page](/images/guide/model-collections.png)

| Action | Who | What it does |
| --- | --- | --- |
| ❤️ **Like** | Everyone | Adds the model to your private [Liked](/guide/organising#liked) list. |
| **Add to print queue** | Everyone | Raises a [print request](/guide/print-queue) linked to this model. |
| **Collections** | Members | Add or remove the model from [collections](/guide/organising#collections). |
| **Share** | Members | Create or revoke a [share link](/guide/sharing). Only shown if sharing is enabled. |
| **Move** | Members | Move the model to another library. |
| **Remove / Delete** | Members | See [Removing Models](/guide/removing). |

Packages and models that are missing from disk offer fewer actions. A model that can't be found shows a **Missing from disk** badge. See [Safety Guards](/concepts/safety).

### The file tree

Files are shown as a collapsible directory tree, with 3MF files listed first. Each file offers whatever applies to it:

- **Download**: see [Downloads](/guide/downloads).
- **Open in…**: launch the file in a slicer. See [Slicers & Printers](/guide/slicers-and-printers).
- **Send**: push a sliced file to a printer.

### Editing details

Members can edit a model's details:

![The edit dialog with name, notes, creator, licence and tags](/images/guide/model-edit.png)

| Field | Notes |
| --- | --- |
| **Name** | Defaults to a name worked out from the folder. An explicitly edited name is kept. |
| **Notes** | Free text. |
| **Creator** | Created if it doesn't exist yet. |
| **Licence** | Pick a standard identifier so licences group together. |
| **Tags** | Add and remove; new tags are created as you type. |

In a library PrintBench can write to, these are also saved as a [`.printbench.json` sidecar](/concepts/sidecars) beside the model, so they survive losing the database.

### Source links

Models imported from a model site (or whose 3MF carries a recognised MakerWorld project) show a **Source links** section pointing back to the original page.

### Print history

Each model has its own [print history](/guide/print-history): who printed it, on what, and how it went, plus a success rate. A model whose only print is still running has no verdict yet, so its success rate is shown as unknown rather than 0%.

![A model's print history with a logged successful print](/images/guide/model-print-history.png)

## Metadata that fills itself in

New 3MF files can supply a title, designer, description, licence, source-file dates and cover image automatically. Edits you make always win over embedded metadata. The details are in [Importing from Model Sites](/guide/imports#what-3mf-files-can-supply).
