# Roles & Permissions

Authorisation lives in one place: a `can(user, action)` function used by both the server (to enforce) and the UI (to decide what to show). Each action has a **minimum role**; roles are hierarchical, so admins can do everything members can, and members everything viewers can.

## The matrix

| Action | What it covers | Viewer | Member | Admin |
| --- | --- | :---: | :---: | :---: |
| `filament:view` | Browse the shared [filament library](/guide/filaments) | ✅ | ✅ | ✅ |
| `filament:manage` | Add, edit, archive and measure shared spools and filament specifications | | ✅ | ✅ |
| `model:view` | Browse and search models, creators, tags, collections | ✅ | ✅ | ✅ |
| `file:download` | Download files and ZIPs | ✅ | ✅ | ✅ |
| `like:toggle` | Like models (private) | ✅ | ✅ | ✅ |
| `list:manage` | Manage your *own* lists | ✅ | ✅ | ✅ |
| `request:create` | Raise [print queue](/guide/print-queue) requests | ✅ | ✅ | ✅ |
| `model:create` | Create models | | ✅ | ✅ |
| `model:edit` | Edit name, notes, creator, licence, tags; share; move | | ✅ | ✅ |
| `model:delete` | Remove from library; delete files | | ✅ | ✅ |
| `tag:edit` | Rename, recolour, delete and merge tags | | ✅ | ✅ |
| `collection:edit` | Create and edit collections | | ✅ | ✅ |
| `creator:edit` | Edit creators | | ✅ | ✅ |
| `file:upload` | Upload files, import from model sites, Account-settings connections | | ✅ | ✅ |
| `print:log` | Log and edit [print history](/guide/print-history) | | ✅ | ✅ |
| `request:manage` | Start, finish, cancel and reopen queue requests | | ✅ | ✅ |
| `scan:trigger` | Trigger a normal scan | | ✅ | ✅ |
| `problem:resolve` | Resolve or ignore [health](/admin/health) problems | | ✅ | ✅ |
| `printhost:send` | Send sliced files to a printer | | ✅ | ✅ |
| `library:manage` | Add, delete, schedule libraries; force or deep scans; restore sidecars; health page | | | ✅ |
| `printhost:manage` | Add and edit printers | | | ✅ |
| `user:manage` | Invite, create, suspend, delete, reset passwords | | | ✅ |
| `settings:manage` | [Instance settings](/admin/settings) | | | ✅ |

Admins can manage anyone's lists; everyone else only their own.

## Special cases

- **Anonymous visitors** can do nothing, except open a model that has been explicitly [shared](/guide/sharing), when sharing is enabled.
- **A suspended user** is denied everything, even an admin.
- **An unknown role** grants nothing.
- **Scans:** members may trigger a normal scan, but *force/deep* scans and *restoring sidecars* need `library:manage`.
- **Password changes** are open to every signed-in user, including viewers.
- **Hidden isn't protected.** UI elements you lack permission for are hidden, but every server action re-checks.

## Where things appear

| Sidebar item | Needs |
| --- | --- |
| Filaments | `filament:view` |
| Print queue | `request:create` |
| Upload | `file:upload` |
| Account settings | `file:upload` (sidebar); everyone via the account menu |
| Libraries, Library health | `library:manage` |
| Printers | `printhost:manage` |
| Users | `user:manage` |
| Settings | `settings:manage` |

## Choosing a role

See [Users & Roles](/admin/users#choosing-roles) for guidance.
