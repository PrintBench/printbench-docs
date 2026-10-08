# Conventions & Invariants

These are the things worth knowing before you change them.

## The one firm rule: `reference/`

`reference/manyfold` is a vendored copy of [ManyFold](https://manyfold.app), kept only as a **domain reference** for what a print library needs to model.

ManyFold is AGPL-3.0, and its `AGENTS.md` asks that AI agents not contribute to that project. Neither of those binds this codebase, but both mean one rule that is not negotiable:

> **No code is copied out of `reference/`.** Read it to understand the problem, then solve the problem yourself.

`reference/` is gitignored, dockerignored, excluded from the TypeScript build, never linted and never formatted. Nothing imports from it. If you find yourself wanting to relax any of that, open an issue first.

## Invariants

<!--@include: ../.vitepress/shared/invariants.md-->

- **New domain logic belongs in `packages/`**, not in a route handler.
- **Authorisation is one function.** Use `can()` / `assertCan()` on the server for every mutating action; hiding a button is not authorisation.
- **Secrets are encrypted at rest** with the secret box keyed from `BETTER_AUTH_SECRET`. Don't store credentials in plain text, and don't send them back to the browser.
- **Offer and converter share one list.** The set of files that get an _Open in…_ link and the set the 3MF converter can handle are the same list, so they can't drift.

## Commits and pull requests

<!--@include: ../.vitepress/shared/commits.md-->

Describe upgrade-affecting changes (migrations, renamed variables) in the release notes.

## Comments

The codebase's comments explain _why_, not what. Match that: a comment that restates the code is noise; one that records a trap you hit (the `translate()` gotcha, the trigram operator direction) is gold.

## Releases

Follow the [release checklist](/contributing/releasing) for preparation, verification and recovery. See also [Release Notes](/releases/index).
