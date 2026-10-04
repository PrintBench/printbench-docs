# Reporting Security Issues

## Reporting a vulnerability

::: danger Don't open a public issue
Please **do not** open a public issue for a security problem.
:::

Report it privately through GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability): go to the **Security** tab of the repository and choose **Report a vulnerability**. That opens a private thread visible only to the maintainers, and it is the fastest route to a fix.

This is a self-hosted project maintained in spare time, so please allow a few days for an initial reply. You will get one. If a report turns out to be valid, you'll be credited in the advisory unless you'd rather not be.

Please include what you'd want to receive yourself: the version or commit, how the instance is deployed, what an attacker gains, and the smallest set of steps that demonstrates it.

## What is in scope

PrintBench is self-hosted, so the trust boundary is the instance and the people with accounts on it. The areas most worth your attention:

| Area | Why it matters |
| --- | --- |
| **Authentication and roles** | Three roles, enforced in `packages/auth` and at every route. A path that skips the guard is a real finding. |
| **Path confinement** | `LIBRARY_ROOTS` bounds where an admin may point a library. Anything that reads or writes outside it (traversal in a scan, an upload, a download or a sidecar) is in scope. |
| **Archive extraction** | Uploaded `.zip` files are extracted server-side with a zip-slip guard on every entry. A way past that guard is in scope. |
| **Signed slicer links** | Short-lived HMACs naming a single file, fetched by a desktop slicer with none of our cookies. Forgery, extension of lifetime or widening beyond the one file is in scope. |
| **Share tokens** | A shared link grants exactly one model, not the library and not search. Anything that broadens it, or survives revocation, is in scope. |
| **Printer credentials** | Encrypted at rest with AES-256-GCM keyed from `BETTER_AUTH_SECRET`. Recovering them from a database dump alone is in scope. |
| **File delivery** | `X-Accel-Redirect` and presigned S3 URLs both hand off bytes outside Node. A way to get a handoff for a file you may not read is in scope. |

## What is out of scope

- **Anything requiring an account you were given.** An admin can point a library at a folder and delete files in a managed one. That is the feature, not a privilege escalation.
- **Instances exposed to the internet without a reverse proxy or TLS.** The deployment guide is explicit about this; running otherwise is a misconfiguration rather than a vulnerability.
- **A weak or reused `BETTER_AUTH_SECRET`.** It keys both sessions and printer credential encryption, which is exactly why `.env.example` tells you to generate it with `openssl rand -base64 32`.
- Missing hardening headers or rate limits with no demonstrated impact, findings from automated scanners with no working proof, and denial of service through sheer volume.

## Operator notes

Two things matter more than anything else you can configure:

1. **Set `BETTER_AUTH_SECRET` to a real random value and keep it.** Rotating it invalidates every session *and* makes stored printer credentials undecryptable, so you will have to re-enter them.
2. **Keep the library mount read-only** unless you specifically want PrintBench to own and write to it. The default compose file mounts read-only for a reason.

See also the [Security Model](/concepts/security).
