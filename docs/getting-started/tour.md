# A Tour of PrintBench

The sidebar is the map of the app. What you see depends on your [role](/reference/roles), items you can't use are hidden rather than greyed out.

## The sidebar

![The PrintBench dashboard with the sidebar on the left](/images/getting-started/dashboard.png)

| Item | Who sees it | What it is |
| --- | --- | --- |
| **Dashboard** | Everyone | Waiting-to-print requests, recently added models and latest prints. |
| **Search** | Everyone | Full-text search with filters. See [Search & Filters](/guide/search). |
| **Models** | Everyone | Every model in the library, as a grid. |
| **Print queue** | Everyone | Things people have asked you to print. See [Print Queue](/guide/print-queue). |
| **Upload** | Members and admins | Drag in files, or import from a model site. See [Uploading](/guide/uploading). |

### Browse

| Item | What it is |
| --- | --- |
| **Creators** | Who made what, with everything of theirs you own. |
| **Collections** | Nestable groups of models. |
| **Tags** | Browse, rename, recolour, delete and merge tags. |
| **Liked** | Your private list of hearted models. |
| **Print history** | The library-wide log of every print. See [Print History](/guide/print-history). |

See [Tags, Creators & Collections](/guide/organising).

### Manage

| Item | Who sees it | What it is |
| --- | --- | --- |
| **Account settings** | Members and admins (everyone via the account menu) | Change your password; members and admins can also connect MakerWorld and Thingiverse. See [Your Account](/guide/account). |
| **Libraries** | Admins | Add libraries, scan, schedule and restore removed models. See [Libraries](/admin/libraries). |
| **Printers** | Admins | Connect OctoPrint, Moonraker or PrusaLink. See [Printers](/admin/printers). |
| **Library health** | Admins | Problems found in the library. See [Library Health](/admin/health). |
| **Users** | Admins | Invitations, roles, password resets. See [Users & Roles](/admin/users). |
| **Settings** | Admins | Instance-wide options. See [Instance Settings](/admin/settings). |

## The command menu

Press `⌘ K` (or `Ctrl K`) from anywhere to open the command menu. Type to search models, creators and tags, or to jump to any page in the sidebar.

![The command menu searching models, creators and tags](/images/guide/command-menu.png)

## The dashboard

The dashboard is a quick look at what's going on:

![The dashboard with waiting requests, recently added models and latest prints](/images/guide/dashboard-full.png)

- **Waiting to print**: open [print queue](/guide/print-queue) requests.
- **Recently added**: the newest models.
- **Latest prints**: the most recent [print history](/guide/print-history) entries.

If no library exists yet it says so and, for an admin, points you at adding one. If a library exists but nothing has been indexed, it prompts you to run a scan.

## A model page

Opening a model shows:

![A model page with preview, actions, details and file tree](/images/guide/model-page.png)

- A preview that switches between the **thumbnail** and an interactive **3D model**.
- File count and total size, and a **Missing from disk** badge if the files can't be found.
- Actions: like, add to the print queue, add to a collection, share, move to another library, and remove.
- The file tree, with download, **Open in…** (slicer) and **Send** (printer) on each file where they apply.
- Editable details: name, notes, creator, licence and tags.
- The model's [print history](/guide/print-history) and any source links.

See [Models](/guide/models).

## Roles at a glance

| Role | In one sentence |
| --- | --- |
| **Viewer** | Browse, search, download, like, and ask for things to be printed. |
| **Member** | Everything a viewer can do, plus edit, upload, log prints and run scans. |
| **Admin** | Everything, including libraries, printers, users and instance settings. |
