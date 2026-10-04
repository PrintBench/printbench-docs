# Conventions & Invariants

These are the things worth knowing before you change them.

## The one firm rule: `reference/`

`reference/manyfold` is a vendored copy of [ManyFold](https://manyfold.app), kept only as a **domain reference** for what a print library needs to model.

ManyFold is AGPL-3.0, and its `AGENTS.md` asks that AI agents not contribute to that project. Neither of those binds this codebase, but both mean one rule that is not negotiable:

> **No code is copied out of `reference/`.** Read it to understand the problem, then solve the problem yourself.

`reference/` is gitignored, dockerignored, excluded from the TypeScript build, never linted and never formatted. Nothing imports from it. If you find yourself wanting to relax any of that, open an issue first.

## Invariants

- **The web tier never does heavy I/O.** Large downloads bypass Node entirely and multi-gigabyte work happens in the worker. A change that streams a big file through a Next.js route is a change in the wrong direction.
- **Renders are golden-image tested.** The rasteriser is deterministic on purpose, so identical input gives identical bytes on Windows and Linux. If a golden test fails, the render genuinely changed. Don't refresh the fixture without understanding why.
- **Migrations are generated, not hand-written.** Use `npm run db:generate` after editing the schema, and commit what it produces. Migrations are forward-only.
- **`packages/db/src/schema/auth.ts` is reconciled against better-auth itself**, not its CLI, which lags. After upgrading better-auth run `npm run auth:schema`.
- **Scans refuse to destroy metadata.** The 20%-missing abort and the all-missing prune guard exist because an unmounted NAS looks exactly like a mass deletion. Please don't "simplify" them away. See [Safety Guards](/concepts/safety).
- **New domain logic belongs in `packages/`**, not in a route handler.
- **Authorisation is one function.** Use `can()` / `assertCan()` on the server for every mutating action; hiding a button is not authorisation.
- **Secrets are encrypted at rest** with the secret box keyed from `BETTER_AUTH_SECRET`. Don't store credentials in plain text, and don't send them back to the browser.
- **Offer and converter share one list.** The set of files that get an *Open in…* link and the set the 3MF converter can handle are the same list, so they can't drift.

## Commits and pull requests

- Keep a pull request to **one subject**.
- Explain **why** in the commit message.
- New behaviour comes with a **test**.
- Formatting is Prettier's problem: `npm run format`.
- Describe upgrade-affecting changes (migrations, renamed variables) so they can go in the release notes.

## Comments

The codebase's comments explain *why*, not what. Match that: a comment that restates the code is noise; one that records a trap you hit (the `translate()` gotcha, the trigram operator direction) is gold.

## Releases

Bump `version` in `package.json` on `main`, then tag that commit `vX.Y.Z` and push the tag. The release workflow checks the tag matches `package.json`, builds the image, publishes it to `ghcr.io`, attests provenance and opens a GitHub Release. Nothing is published by merging to `main`. Write release notes for `docs/releases/` in the app repository. See [Release Notes](/releases/index).
