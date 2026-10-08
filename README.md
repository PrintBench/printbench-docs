# PrintBench Docs

VitePress documentation site for [PrintBench](https://github.com/PrintBench/printbench),
the self-hosted library for your 3D print files.

The content covers installing and deploying PrintBench, using it day to day,
administering an instance, how it works under the hood, and contributing.

## Local development

Use Node 24, matching CI and the Docker build.

```sh
npm ci
npm run docs:dev      # live-reloading dev server
npm run docs:build    # production build into docs/.vitepress/dist
npm run docs:preview  # serve the production build
```

## Layout

```
docs/
  getting-started/   Install, first run, a tour of the app
  guide/             Using PrintBench: browsing, models, uploads, printing, sharing
  admin/             Libraries, users, settings, printers, library health
  deploy/            Docker Compose, Coolify, storage, S3, backups, upgrades, troubleshooting
  concepts/          How it works: architecture, sidecars, grouping, search, memory
  reference/         Environment variables, roles, file formats, CLI commands
  contributing/      Development setup, checks, conventions, security
  releases/          Release notes
  .vitepress/        Site config and theme
```

## Deploying with Coolify

Deploy this repository with these settings:

- Base directory: `/` (this repository root)
- Build/deploy type: Docker
- Dockerfile: `Dockerfile`
- Public service/port: port `8080` (the unprivileged nginx image listens there)

## Keeping the docs honest

The app repository is the canonical source for release notes, contributor setup,
test commands, shared invariants, PR conventions, security policy and the release
checklist. `docs:sync` generates their site copies, release index and navigation.
Generated files carry a banner; edit the app source instead. Handwritten pages
and the text surrounding Markdown includes stay editable here.

Keep a sibling app checkout, or pass its path explicitly:

```sh
npm run docs:sync -- --source ../printbench
npm run docs:check -- --source ../printbench
```

`docs:check` refuses stale generated content, tests the sync tool, and builds the
site. VitePress fails the build for broken internal page links, including links
in included Markdown. It does not validate external URLs or heading anchors.
`docs:build` alone builds the current content without comparing the app source.

CI checks pull requests, main pushes and manual runs against
`PrintBench/printbench` main. A weekly run also detects drift after app changes.
CI fetches every GitHub release (including all API pages) and requires app notes,
site notes, navigation and index entries for each published tag. Draft releases
are excluded; published prereleases are included. API failures fail the check.
To run the same coverage check locally:

```sh
gh api --paginate --slurp repos/PrintBench/printbench/releases > /tmp/printbench-releases.json
npm run docs:check:releases -- --source ../printbench --releases /tmp/printbench-releases.json
```

Land shared app changes first, then sync and land their docs update; a docs PR
can fail its drift check until the corresponding app changes are on main.
Review the app checkout before syncing: generated content reflects its working
files, including uncommitted edits. No command publishes either repository.

When a setting, route or environment variable changes, update the handwritten
pages too. [Environment variables](docs/reference/environment.md) and
[Roles & permissions](docs/reference/roles.md) need particular attention.
Follow the [release checklist](docs/contributing/releasing.md) before tagging.

## Checking a deployed site

The CI workflow verifies content; it does not deploy the site. Configure your
hosting service to build this repository's `main` after merges, or redeploy it
manually. In Coolify, check the Git repository, branch (`main`), auto-deploy
configuration and the deployed commit in the latest deployment log.

After deployment, open `/releases/` and confirm its list matches
[GitHub Releases](https://github.com/PrintBench/printbench/releases). The release
history should include every published tag, including archived early releases.
If the built site is current but a browser still shows
an older list, check the proxy/CDN cache and refresh it after a successful deploy.
