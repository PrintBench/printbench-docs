# First Run

A brand-new instance has no users and no libraries. This page takes you through the three things to do before it is useful.

## Create the admin account

On first load PrintBench redirects to **/setup** and asks you to create the admin account.

![The PrintBench first-run screen asking for a name, email and password](/images/getting-started/setup.png)

::: warning This page closes for good
The setup page works only while no account exists. The moment the first user is created it redirects to sign-in permanently, so nobody who finds a public instance can grant themselves admin. Every further user is added from **Manage → Users**. See [Users & Roles](/admin/users).
:::

Use a real password; there is no email delivery to rescue you if you lose it. If you do lock yourself out, an operator with server access can issue a recovery link. See [Password Recovery](/admin/password-recovery).

## Add your first library

A **library** is a place PrintBench indexes. Go to **Manage → Libraries → Add library**. The form asks two questions, in the order you actually make them.

![Choosing between Files I already have and Somewhere to upload to](/images/admin/add-library-kind.png)

**1. Which kind?**

- **Files I already have**: indexed where they sit. Never moved, renamed or deleted. This is what you want for an existing collection.
- **Somewhere to upload to**: a folder PrintBench owns and writes into. This is what makes the **Upload** page work. You need at least one of these before anything can be uploaded through the browser.

**2. Where?**

- A folder on disk (including a NAS share mounted on the host), or
- **S3-compatible storage**: see [S3 & Compatible Storage](/deploy/s3).

For a folder, the picker only shows locations under `LIBRARY_ROOTS`, so browsing can't wander outside what is mounted into the container. In the default Compose stack that is `/libraries` (your `LIBRARY_PATH`) and `/data/libraries` (uploads).

![Choosing where the files live: this server or S3-compatible storage](/images/admin/add-library-where.png)

![The folder picker, confined to the mounted library roots](/images/admin/add-library-folder.png)

### Choose how folders become models

PrintBench has to decide which directories are *models*. Pick a grouping mode:

| Mode | What it does | Good for |
| --- | --- | --- |
| **Each folder** | Every folder holding model files becomes a model. | Most collections. |
| **Top level** | A folder and everything beneath it is one model. | Sets with variants in sub-folders. |
| **Fixed depth** | Only folders at a set depth become models. | Rigidly organised libraries. |

Common subfolders such as `stl`, `presupported`, `images` and `3mf` always belong to the model above them. The full rules are in [How Models Are Grouped](/concepts/grouping).

### Preview before you commit

The next screen is a **dry run**. It checks the location is reachable, walks the files and reports how many models the grouping rules would find, listing some of them. Nothing has been written. If the numbers look wrong, change the grouping mode and preview again instead of creating the library and fixing it afterwards.

![The dry-run preview showing grouping modes and a sample of the models it would create](/images/admin/add-library-preview.png)

## Run the first scan

Back on **Libraries**, press **Scan** on your new library. The worker walks the files, groups them into models, analyses meshes and renders thumbnails. Models appear immediately; previews fill in as renders finish, and the page updates itself.

![The Libraries page listing each library with Scan, Deep scan and Remove controls](/images/admin/libraries.png)

::: tip Give it a schedule
Scans can run on a schedule, and local libraries can optionally be watched live. See [Scanning & Schedules](/admin/scanning).
:::

## Invite other people

If other people will use the instance, add them from **Manage → Users**, either with an invitation link or by creating the account yourself. Decide first what role they need. [Roles & Permissions](/reference/roles) lays out the difference between viewer, member and admin.

Set the default role for new accounts under **Manage → Settings**. See [Instance Settings](/admin/settings).

## A sensible next hour

1. Add your library and run the scan.
2. Open a few models and check the grouping looks right. If a pack has split into too many models. See [How Models Are Grouped](/concepts/grouping#taking-control-with-a-sidecar).
3. Open **Manage → Library health** and glance at what it found. See [Library Health](/admin/health).
4. Set up [backups](/deploy/backups).
5. If you print: add a [printer](/admin/printers) and try logging a [print](/guide/print-history).
