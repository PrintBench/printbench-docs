# Contributing

Bug reports and pull requests are welcome. These pages cover what is specific to the PrintBench repository. The general advice about being nice and writing clear commit messages applies here too, but you already know it.

| Page                                                  | What's in it                                         |
| ----------------------------------------------------- | ---------------------------------------------------- |
| [Development Setup](/contributing/setup)              | Getting a dev environment running.                   |
| [Checks & Testing](/contributing/testing)             | What CI runs, and why `.env` matters so much.        |
| [Codebase Tour](/contributing/codebase)               | Where things live.                                   |
| [Conventions & Invariants](/contributing/conventions) | The rules worth knowing before you change something. |
| [Reporting Security Issues](/contributing/security)   | The private route for vulnerabilities.               |

## Quick orientation

- Repository: [github.com/PrintBench/printbench](https://github.com/PrintBench/printbench)
- Bugs and feature requests: the [issue tracker](https://github.com/PrintBench/printbench/issues)
- **Security vulnerabilities do not go in the tracker**: see [Reporting Security Issues](/contributing/security).
- Licence: [MIT](https://github.com/PrintBench/printbench/blob/main/LICENSE), © 2026 Owl Media.

## The one thing to read first

Before sending a pull request, read [how the test modes work](/contributing/testing#unit-and-integration-tests). `npm run test:unit` works without Postgres; the full `npm test` suite and `npm run check` require a running, migrated development/test database and fail at startup if `DATABASE_URL` is missing.

## Pull requests

- Keep a pull request to **one subject**. A drive-by fix in an unrelated file is genuinely welcome, just not in the same PR.
- Explain **why** in the commit message. The codebase's comments are written that way, and it's the convention worth keeping.
- New behaviour comes with a **test**. The suite is fast, so this is cheap.
- Formatting is Prettier's problem, not yours or a reviewer's: `npm run format`.

## Community conduct

Follow the [Code of Conduct](https://github.com/PrintBench/printbench/blob/main/CODE_OF_CONDUCT.md) in issues, pull requests and other project spaces. Report unacceptable behaviour privately to [support@owl-media.co.uk](mailto:support@owl-media.co.uk). Reports are handled confidentially.

## Improving these docs

This documentation site lives in its own project (`printbench-docs`). It describes behaviour that can drift from the app, so when you change a setting, route or environment variable, update the matching docs page. See the repository README of the docs project.
