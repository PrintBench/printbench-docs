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
3. **Name it**, and for a folder pick the path with the folder picker. The name is also used as the folder name for an upload library.
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

| Field | Notes |
| --- | --- |
| **Bucket** | Name only, with no `s3://` and no URL. |
| **Prefix** | Optional. Only keys under it are indexed. |
| **Region** | Blank means `us-east-1`. |
| **Endpoint** | Blank for AWS. Set it for MinIO, B2, Wasabi, R2 and so on. |
| **Access key ID** / **Secret access key** | Blank to use the server's own credentials. The secret is encrypted before storage. |

Full instructions, IAM policy and CORS rule: [S3 & Compatible Storage](/deploy/s3).

## The libraries page

Each row shows the library, its path, scan state and counts, with controls to:

![The Libraries page](/images/admin/libraries.png)

- **Scan** (fast) or **Deep scan**. See [Scanning & Schedules](/admin/scanning).
- Set a **schedule** and, for local libraries, **live watching**.
- **Delete the library**: which removes the **index only**. Nothing on disk or in the bucket is touched, and the next scan rebuilds the index from the files and their sidecars.
- Review and **restore removed models**.

## Editing a library

There is currently no UI for editing an existing library's storage settings. To change a bucket key pair, delete the library and add it again with the same bucket and prefix; the index rebuilds from the objects and sidecars. See [S3 & Compatible Storage](/deploy/s3#rotating-or-fixing-credentials).

## Removed models

Models someone chose **Remove from library** for are listed on this page and can be restored. A scan won't resurrect them on its own; the removal is recorded. See [Removing Models](/guide/removing).

## Libraries and permissions

| Action | Role |
| --- | --- |
| View libraries, browse models | Viewer |
| Trigger a normal scan | Member |
| Add, delete, schedule, deep-scan, restore sidecars | Admin |

See [Roles & Permissions](/reference/roles).
