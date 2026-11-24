# Libraries

A **library** is a location PrintBench indexes: a folder on disk, a NAS mount or an S3 bucket. One installation can index any mix (a NAS mount, a local folder and three buckets at once) and the rest of the app doesn't know the difference.

Manage them under **Manage → Libraries** (admin only).

## The two kinds of library

The distinction matters, and the UI asks it in plain language.

| In the UI | Technical name | Behaviour |
| --- | --- | --- |
| **Files I already have** | `in_place` | Indexed where they sit. **Never moved, renamed or deleted.** `LIBRARY_PATH` is mounted read-only so a bug can't break that promise. |
| **Somewhere to upload to** | `managed` | A folder PrintBench owns and writes into. This is what makes **Upload** work. Created under `MANAGED_LIBRARY_ROOT` (default `<DATA_DIR>/libraries`) on the writable data volume. |

You need at least one *somewhere to upload to* library before anything can be uploaded through the browser, and only these libraries offer **Delete the files**. See [Removing Models](/guide/removing).

### Letting an existing library be written to

By default an existing library is mounted read-only. If you want PrintBench to write [`.printbench.json` sidecars](/concepts/sidecars) beside your models, set:

```bash
LIBRARY_READ_ONLY=false
```

nginx always keeps its own mount read-only. `LIBRARY_READ_ONLY` replaces the older `LIBRARY_MODE` variable (`rw` → `false`, `ro` → `true`). If access to the host folder relies on group permissions, add its numeric GID to `group_add` for both `web` and `worker` in a deployment override.

## Adding a library

![Step one: choose the kind of library](/images/admin/add-library-kind.png)

![Choosing a folder](/images/admin/add-library-folder.png)

**Libraries → Add library**, then:

1. **Choose the kind** (above).
2. **Choose where**: a folder or **S3-compatible storage**.
3. **Name it**, and for a folder pick the path with the folder picker. The name is also used as the folder name for an upload library. For S3, choose an **S3 connection** and an optional prefix instead (below).
4. **Choose a grouping mode**: how folders become models:

| Mode | What happens | Use it when |
| --- | --- | --- |
| **Each folder** | Every folder holding model files becomes a model. | Most collections. |
| **Top level** | A folder and everything beneath it is one model. | Sets have variants in sub-folders. |
| **Fixed depth** | Only folders at a chosen **Depth** become models. | The library is rigidly organised. |

5. **Preview.** A dry run checks the location, walks the files and reports how many models the rules would find, listing some. Nothing is written until you confirm. If it looks wrong, change the mode and preview again.

![The preview step](/images/admin/add-library-preview.png)

See [How Models Are Grouped](/concepts/grouping).

### Folder picker confinement

The picker only offers paths under `LIBRARY_ROOTS` (a platform-path-separated list). In Docker that is `/libraries` plus `/data/libraries`. Anything outside what's mounted into the container can't be chosen.

### S3 fields

The bucket and its key aren't entered here. They're set up once as an **S3 connection** under [Storage](/admin/storage), and any number of libraries can share one. A library on S3 only chooses:

| Field | Notes |
| --- | --- |
| **S3 connection** | The bucket and key to use. If there are none yet, the form links to **Storage** to add one. |
| **Prefix** | Optional. Only keys under it are indexed, so one bucket can hold several libraries. Leading and trailing slashes are ignored. |

Two libraries can't index the same bucket and prefix, even through different connections. **Add library** on a connection's row under Storage starts this form with that connection already chosen.

Full instructions, IAM policy and CORS rule: [S3 & Compatible Storage](/deploy/s3).

## The libraries page

Each row shows the library, its location (a path, or `s3://bucket/prefix/` and the connection it uses), scan state and counts. A badge next to the name says in one phrase where the files are and what the library is for:

| Badge | Meaning |
| --- | --- |
| **Existing folder** | Files you already had, on this server or a NAS mount. Read-only. |
| **Uploads on this server** | A folder PrintBench owns and uploads into. |
| **S3 at** *provider* | An existing bucket, for example *S3 at Backblaze B2*. Read-only. |
| **Uploads to S3 at** *provider* | A bucket PrintBench uploads into. |
| **S3, no connection** | An S3 library whose connection is missing. **Edit** it to choose one. |

The provider is the one shown for the library's connection on [Storage](/admin/storage#the-storage-page). The library's **Edit** page uses the same phrase.

The row has controls to:

![The Libraries page](/images/admin/libraries.png)

- **Scan** (fast) or **Deep scan**. See [Scanning & Schedules](/admin/scanning).
- Set a **schedule** and, for local libraries, **live watching**.
- **Edit** the library. See below.
- **Delete the library**: which removes the **index only**. Nothing on disk or in the bucket is touched, and the next scan rebuilds the index from the files and their sidecars.
- Review and **restore removed models**.

## Editing a library

**Edit** on a library's row changes what is safe to change after it exists:

| Setting | Notes |
| --- | --- |
| **Library name** | Shown everywhere the library appears. |
| **Write a metadata sidecar** | Turning it off stops new [sidecar](/concepts/sidecars) writes. Sidecars already written are left where they are. |
| **S3 connection** | S3 libraries only. Move the library onto another connection **to the same bucket**, for example to consolidate several libraries onto one shared key. The new connection is checked against the library's prefix before it is saved. |

The same page shows what is **fixed**, and why: the kind of library, its folder (or bucket and prefix) and its grouping mode. Every indexed model is recorded relative to that location and grouping, so changing them would make the whole library look missing at the next scan, and the scan's [safety guard](/concepts/safety) would refuse to run. To index somewhere else, add a new library.

The scan schedule is changed on the library's row, as before. To rotate or withdraw an S3 key, edit the connection under [Storage](/admin/storage) instead: every library on it follows.

## Removed models

Models someone chose **Remove from library** for are listed on this page and can be restored. A scan won't resurrect them on its own; the removal is recorded. See [Removing Models](/guide/removing).

## Libraries and permissions

| Action | Role |
| --- | --- |
| View libraries, browse models | Viewer |
| Trigger a normal scan | Member |
| Add, edit, delete, schedule, deep-scan, restore sidecars | Admin |
| Add, edit and remove [S3 connections](/admin/storage) | Admin |

See [Roles & Permissions](/reference/roles).
