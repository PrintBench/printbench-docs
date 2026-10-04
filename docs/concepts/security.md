# Security Model

PrintBench is self-hosted, so the trust boundary is **the instance and the people with accounts on it**. This page summarises the controls; to report a vulnerability. See [Reporting Security Issues](/contributing/security).

## Authentication and roles

Three roles, viewer, member, admin, enforced by one policy function. The *same* `can()` check is used by server actions to **enforce** and by the UI to decide what to **render**, so the two can't drift. Hiding a button is never authorisation by itself; every mutating action checks server-side.

- A suspended (banned) user is denied everything, even an admin.
- An unknown or missing role grants nothing.
- Ownership matters for personal data: you can manage your own lists and likes, not someone else's (admins can).
- The first-run **/setup** page closes permanently once any account exists.

See [Roles & Permissions](/reference/roles).

## Passwords and recovery

Password changes require the current password and sign out other sessions. Recovery uses single-use, one-hour links (never an emailed password), and resetting signs out all sessions. See [Password Recovery](/admin/password-recovery).

## Signed links

| Link | Design |
| --- | --- |
| **Slicer hand-off** | A short-lived HMAC naming **one file**. A desktop slicer fetches it with none of your cookies, so the link carries the proof instead of the endpoint being opened up. |
| **Uploads and ZIP downloads** | Short-lived signed links, handled by the worker. |
| **Presigned S3 URLs** | 15 minutes, for downloads from a bucket. |

All are keyed from `BETTER_AUTH_SECRET`.

## Share tokens

A share link grants **exactly one model**, not the library and not search. The token is separate from the internal id, so revoking it truly revokes it. Sharing is **off instance-wide by default**, and switching it off closes every existing link.

## Encrypted credentials

Printer API keys, S3 secret keys, and MakerWorld/Thingiverse credentials have to be replayed, so they can't be hashed. They're encrypted at rest with **AES-256-GCM** under a key derived from `BETTER_AUTH_SECRET`. A database dump alone doesn't hand over your printers or your bucket. Source-import credentials are per user and never returned to the browser after saving.

## Path confinement

`LIBRARY_ROOTS` bounds where an admin may point a library. Anything that reads or writes outside it, traversal in a scan, upload, download or sidecar, would be a vulnerability.

## File delivery

`X-Accel-Redirect` locations in nginx are `internal`, reachable only through a redirect the app issues after authorising the request. Presigned S3 URLs are generated per authorised request.

## Network requests PrintBench makes

- **Source imports** go only to each provider's API and known download/image hosts, over HTTPS, to public addresses, with redirects rejected and credentials never forwarded to CDN hosts.
- **Printer connections** go to the addresses an admin configured.
- **S3** goes to the configured endpoint.

## Operator advice

1. **Set `BETTER_AUTH_SECRET` to a real random value and keep it.** Rotating it invalidates every session *and* makes stored credentials undecryptable.
2. **Keep the library mount read-only** unless you want PrintBench to own and write to it.
3. **Terminate TLS in front of the stack.** Internet exposure without a reverse proxy is a misconfiguration.
4. **Run behind your own access controls** if the instance is public. PrintBench is designed for households and small teams.
