# Administration

These pages are for admins: the people who decide what PrintBench indexes, who can use it and what it's connected to. Everything here lives under **Manage** in the sidebar and needs the **admin** role (scanning is also open to members).

| Page | What it covers |
| --- | --- |
| [Libraries](/admin/libraries) | Adding libraries, the two kinds, grouping modes, removed models. |
| [Scanning & Schedules](/admin/scanning) | Fast and deep scans, schedules, live watching and the safety aborts. |
| [Users & Roles](/admin/users) | Invitations, creating accounts, roles, suspending and deleting. |
| [Password Recovery](/admin/password-recovery) | Reset links without email, and the command-line fallback. |
| [Instance Settings](/admin/settings) | Site name, default role, grace period, sidecars, viewer limit, sharing. |
| [Printers](/admin/printers) | Connecting OctoPrint, Moonraker and PrusaLink. |
| [Library Health](/admin/health) | The nine kinds of problem and how to clear them. |

## A short operating checklist

- **Set `BETTER_AUTH_SECRET` once, keep it, back it up.** See [Environment Variables](/reference/environment).
- **Keep the library mount read-only** unless you want PrintBench to write sidecars or own the folder.
- **Give every library a schedule**, or accept manual scans. See [Scanning & Schedules](/admin/scanning).
- **Look at Library health after the first scan** and now and then afterwards.
- **Back up**: [Backups & Restore](/deploy/backups). Rehearse the restore once.
- **Default new accounts to Viewer** unless everyone you invite should be able to edit.

## Deploying and operating

Installing, upgrading, storage and troubleshooting are in [Deployment](/deploy/index). How things work internally is in [How It Works](/concepts/index).
