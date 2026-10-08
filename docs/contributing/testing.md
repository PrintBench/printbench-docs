# Checks & Testing

<!--@include: ../.vitepress/shared/testing.md-->

## What the tests cover

- **Policy**: every role against every action, including banned users, unknown roles and ownership.
- **Grouping**: exhaustively, because it's the highest-risk logic. It's pure and synchronous so it can be tested without a filesystem.
- **Renders**: golden-image tests. The rasteriser is deterministic on purpose.
- **Scan safety**: the 20% abort, the empty-root abort and the all-missing prune guard.
- **The restore drill**: drop the database, migrate, rescan, and metadata returns from sidecars.
- **Parsers**: bounded archive and image parsing, plus a memory test with a fixed heap limit (see [Large Libraries & Memory](/deploy/large-libraries)).
- **Imports**: provider and network failures, credential and action boundaries, download staging, retries and duplicate delivery.
- **Password recovery**: serialised credential updates, session revocation and expiry.

## Golden image failures

If a golden render test fails, the render genuinely changed. **Don't refresh the fixture without understanding why.**
