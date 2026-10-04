# HTTP Endpoints

PrintBench is a web app first; these routes are internal plumbing and **not a stable public API**. They're listed so you can configure proxies and firewalls sensibly, and understand what each does.

## Web app

| Route | Purpose |
| --- | --- |
| `/api/health` | Process status. Used by the container healthcheck. |
| `/api/auth/*` | Sign-in, sign-out, sessions (better-auth). |
| `/api/search` | Quick lookup for the command menu. |
| `/api/models/previews` | Preview status polling, so thumbnails update as renders finish. |
| `/api/creators/<id>/items` | Paging a creator's models. |
| `/api/files/<id>/thumb` | A file's thumbnail. |
| `/api/files/<id>/raw` and `/raw/<name>` | A file's bytes, authorised, then handed to nginx (`X-Accel-Redirect`) or redirected to a presigned S3 URL. |
| `/api/files/<id>/slicer/…` | Signed, short-lived endpoint a desktop slicer fetches; converts to 3MF where needed. |
| `/api/share/<token>/files/<id>` | A file of a shared model. |
| `/share/<token>` | The public page for a shared model. |

## Worker (via nginx)

| Route | Purpose |
| --- | --- |
| `/api/upload` and `/api/upload/*` | Resumable (tus) uploads. Request buffering off, one-hour timeout. |
| `/api/download/*` | Streaming whole-model ZIPs. Unbuffered, one-hour timeout. |

## Pages worth knowing

| Route | Purpose |
| --- | --- |
| `/setup` | First-run admin creation. Closes permanently once any account exists. |
| `/login`, `/forgot-password`, `/reset-password` | Sign-in and recovery. |
| `/invite/<token>` | Accepting an invitation. |
| `/search`, `/models`, `/queue`, `/upload`, `/prints` | Main app pages. |
| `/creators`, `/collections`, `/tags`, `/lists` | Browsing. |
| `/settings` | Account settings. |
| `/admin/libraries`, `/admin/printers`, `/admin/health`, `/admin/users`, `/admin/settings` | Administration. |

## nginx internals

`/_protected/library/`, `/_protected/managed/` and `/_previews/` are `internal` locations: they can only be reached by an `X-Accel-Redirect` from the app, never directly. See [Reverse Proxy & TLS](/deploy/reverse-proxy#what-nginx-in-the-stack-does).

## Search URL parameters

Search state is entirely in the URL. Parameters on `/search`:

| Parameter | Meaning |
| --- | --- |
| `q` | The query (max 200 characters). |
| `library`, `creator`, `tag`, `license`, `format` | Repeatable filters. |
| `presupported`, `neverPrinted`, `missingPreview` | Flags: `1` or `true`. |
| `minSize` | Minimum total size. |
| `type` | `model` or `package`. |
| `sort` | `relevance`, `name`, `recent`, `oldest` or `largest`. |
| `page` | Page number. Any other change resets it to 1. |
