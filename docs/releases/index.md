# Release Notes

Releases are tagged `vX.Y.Z` and published as container images on `ghcr.io`, with a GitHub Release for each. Migrations are **forward-only**, read the *Upgrade notes* and take a database backup before upgrading. See [Upgrading](/deploy/upgrading).

| Version | Summary |
| --- | --- |
| [v0.5.1](/releases/v0.5.1) | Fixes the Coolify deployment failure from the library mount configuration. `LIBRARY_READ_ONLY` replaces `LIBRARY_MODE`. |
| [v0.5.0](/releases/v0.5.0) | Model source imports (MakerWorld, Printables, Thingiverse), account password recovery, processing labels. |
| [v0.3.0](/releases/v0.3.0) | Large-library reliability, collapsible file trees, writable in-place libraries, worker memory diagnostics. |
| [v0.2.0](/releases/v0.2.0) | Model packages, creator-selected previews, Creality Print handoff, reverse-proxy fixes. |

::: info Other tags
Tags `v0.4.0` and `v0.5.2` also exist in the repository. Their notes aren't in the app's `docs/releases/` folder yet, so they aren't reproduced here. See the [GitHub Releases](https://github.com/PrintBench/printbench/releases) page.
:::
