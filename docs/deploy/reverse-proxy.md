# Reverse Proxy & TLS

The bundled `nginx` container is **not** a TLS terminator. Its job is to authorise nothing, buffer nothing and serve multi-gigabyte files efficiently. Put a TLS-terminating proxy in front of it. Traefik (as in Coolify), Caddy, nginx or any load balancer.

## What the proxy must do

- Forward to the `nginx` service on container port **80**.
- Pass the original **`Host`** header, including any non-standard port. Next.js Server Actions compare `Host` with `Origin` and reject requests when the port is lost. (v0.2.0 fixed PrintBench's own nginx so it preserves explicit ports; your outer proxy needs to as well.)
- Pass **`X-Forwarded-Proto`** so links are built with `https://`.
- **Not buffer request bodies.** Uploads can be 8 GB per file; buffering to disk defeats the resumable path.
- Allow long timeouts, downloads and uploads can run for an hour.

## Settings that must match your public address

| Variable | Value |
| --- | --- |
| `APP_URL` | The public origin, e.g. `https://prints.example.com`. Used for auth callbacks and signed links. |
| `BETTER_AUTH_URL` | The same value. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional. Extra origins that may call the auth endpoints, separated by commas. |

If `APP_URL` is wrong, share links, slicer hand-off and password-reset links point at the wrong host, and sign-in can fail with origin errors.

## A Caddy example

```text
prints.example.com {
    reverse_proxy nginx:80
}
```

Caddy passes `Host` and `X-Forwarded-Proto` by default, and handles certificates for you. If the proxy runs outside the Compose network, publish nginx with `docker-compose.local.yml` and proxy to that host port instead.

## What nginx in the stack does

For reference, the bundled nginx:

| Path | Handled by |
| --- | --- |
| `/api/upload` | Proxied to the **worker** (resumable uploads), with request buffering off and a one-hour read timeout. |
| `/api/download/` | Proxied to the worker (streaming ZIPs), unbuffered. |
| `/_protected/library/` | `internal`, reachable only through an `X-Accel-Redirect` from the app. Serves `/libraries`. |
| `/_protected/managed/` | `internal`, serves upload libraries from `/data/libraries`. |
| `/_previews/` | `internal`, serves thumbnails from `/data/previews`, cached for 30 days. |
| everything else | Proxied to **web**, unbuffered. |

Because the protected locations are `internal`, authorisation can't be bypassed by requesting them directly. `client_max_body_size` is `0` (unlimited): model files are large and are never buffered to disk first.

## Don't expose the app directly

The `web` and `worker` containers are not meant to be reached from outside. Only nginx (or your proxy in front of it) should be.
