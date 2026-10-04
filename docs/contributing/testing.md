# Checks & Testing

CI runs exactly these, in this order. Run them before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
```

## `.env` matters more than you would expect

::: danger A green run can prove very little
**A third of the test suite is database-backed, and those tests skip silently when `DATABASE_URL` is unset.** `vitest.config.ts` loads `.env` if it's there, so without one you'll see a comfortable green run that proved much less than you think.
:::

```text
Test Files  24 passed | 14 skipped (39)      ← no .env, no database
Test Files  39 passed (39)                   ← what a real run looks like
```

If your skip count isn't zero, your database isn't up. This bites hardest in a git worktree, which doesn't inherit the `.env` from the main checkout.

## The verify scripts

These drive a **running dev server** end to end, creating throwaway accounts and cleaning up after themselves. They aren't part of CI beyond phase 1, but they're the fastest way to know a change actually works:

```bash
npm run dev             # in another terminal, for everything past phase 1
npm run verify:phase1   # auth and role guards
npm run verify:phase2   # scan pipeline and safety guards
npm run verify:phase3   # mesh parsing, rendering and serving
npm run verify:phase4   # downloads, HTTP Range and ZIP archives
npm run verify:phase5   # search, facets and the command palette
npm run verify:phase6   # uploads, editing and the restore drill
npm run verify:phase7   # print history, slicer links and a stubbed printer
npm run verify:phase8   # health, settings, schedules, sharing and prune
npm run verify:phase9   # the print queue, its role split and auto-linking
```

`verify:phase2:ui` additionally exercises web → queue → worker → pages. The full list, with S3 and import scripts, is in [Command Line](/reference/cli#verification-scripts).

::: warning A verify script can pass while the browser is broken
A verify script starts its **own** job queue. It can therefore pass while the same flow is broken in the browser, because the web process has a queue of its own. If you're changing anything queue-shaped, check the UI too.
:::

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
