# Importing from Model Sites

PrintBench can pull a model, files plus details, straight from **MakerWorld**, **Printables** or **Thingiverse**. It can also read details embedded in 3MF files you already have.

## Import by link

![The import form on the Upload page, showing connection status for each provider](/images/guide/upload.png)

1. Go to **Upload**.
2. Choose a **writable library** (an upload library).
3. Paste a model-page URL into the import form.

PrintBench detects the provider from the URL and follows the background import. The form shows progress and links to the indexed model when it completes.

| Provider | URL looks like | Needs |
| --- | --- | --- |
| **MakerWorld** | `https://makerworld.com/…/models/…` | Your own account cookie, saved in Account settings. |
| **Printables** | `https://www.printables.com/model/…` | Nothing for public, free models. |
| **Thingiverse** | `https://www.thingiverse.com/thing:…` | Your own App Token, saved in Account settings. |

An import brings in the title, creator, description, tags, licence, cover image, a source link and the supported STL / 3MF / OBJ / PLY files. Downloaded files go into a dedicated model folder and are indexed through the normal scanner. Where the library allows sidecar writes, details and source links are also written to a [sidecar](/concepts/sidecars).

Repeating the same link in the same library follows the existing import; failed imports can be retried. **Files in an existing model are never overwritten** by an import.

## Connecting your accounts

Credentials are entered in **Account settings**, never on the Upload form. The connection status is shown on Upload, with a link to the right settings page. Credentials are per user, encrypted at rest, and never returned to the browser after saving.

### MakerWorld

1. Open **Account settings → MakerWorld**.
2. Save your own MakerWorld `token` cookie (or a `Cookie` header containing `token=…`).
3. On **Upload**, paste a model URL. A `#profileId-…` fragment selects that published print profile; without one, the first published profile is imported.

Public metadata is available without a session; **resolving download links requires one**. PrintBench does not bypass browser challenges or extract cookies automatically.

### Thingiverse

1. Create an app via [Thingiverse's developer pages](https://www.thingiverse.com/developers) and obtain an **App Token**.
2. Open **Account settings → Thingiverse** and save the token. The field is masked, and after saving only its saved status is shown.
3. Paste a `thing:` URL on **Upload**.

PrintBench uses only the App Token, not the Client ID or Secret, and performs no OAuth login. **Remove API token** disconnects your own account.

### Printables

Public free models need no cookie or token. Paid or private content isn't supported.

## Limits and caveats

- **Unofficial APIs.** MakerWorld imports use Bambu Cloud endpoints, and Printables uses its public website GraphQL endpoint. Neither is a documented stable contract and either may need maintenance if the provider changes. Thingiverse uses its documented authenticated API.
- **File limits.** Model downloads are capped at 512 MiB per file, with at most 20 supported files per import. Optional remote artwork is capped at 16 MiB and 16 megapixels; embedded artwork at 4 MiB. Raster previews keep source resolution up to 2048 px without enlarging smaller images.
- **Network safety.** Requests go only to each provider's API and known download/image hosts, over HTTPS to public addresses, with redirects rejected. Credentials are never forwarded to CDN hosts.
- **Controlled errors.** Session expiry, refused access, rate limits, unsupported responses and storage or scan failures are reported as clear errors. Removing a credential, or changing permissions, takes effect before a queued import starts.
- **No guessing.** A local file can't be matched to a website from its filename alone. PrintBench doesn't search by filename; website metadata needs a model-page link.

## What 3MF files can supply

Newly indexed 3MF files can supply a **title, designer, description, licence, source-file dates and cover image**. The worker reads standard 3MF metadata and Bambu Studio's designer fields from the main model part, using OPC thumbnail relationships with common slicer paths as a fallback.

- **Edits win.** Metadata fills empty fields once. Existing database records, your edits (including deliberately cleared fields) and sidecar metadata take precedence. A scanner-generated name may be replaced by the embedded title; an explicitly edited name is kept.
- **Folders with several 3MFs.** The first live 3MF by relative path supplies the metadata; later files don't replace it.
- **Dates are the source file's**, not the date of upload to PrintBench or proof of publication anywhere.
- **Not backfilled.** Existing records aren't automatically updated. Re-upload into a new model to apply embedded metadata.
- **Source files are never modified.** Missing, malformed, oversized, ZIP64 or unsupported metadata falls back to normal geometry analysis and rendering.

### MakerWorld enrichment

If a newly indexed 3MF carries a MakerWorld `DesignModelId`, the worker makes bounded **public** requests to resolve the project, confirm the public design matches the internal identifier, and add its tags, description, creator, licence and source link. No cookie and no remote model download is needed. The sharpest embedded cover is still preferred. If the source is unavailable, private, changed or rate limited, the local metadata is still imported. Projects without a recognised identifier stay entirely local.
