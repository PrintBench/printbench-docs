# Contributing

Bug reports and pull requests are welcome. These pages cover what is specific to the PrintBench repository. The general advice about being nice and writing clear commit messages applies here too, but you already know it.

| Page | What's in it |
| --- | --- |
| [Development Setup](/contributing/setup) | Getting a dev environment running. |
| [Checks & Testing](/contributing/testing) | What CI runs, and why `.env` matters so much. |
| [Codebase Tour](/contributing/codebase) | Where things live. |
| [Conventions & Invariants](/contributing/conventions) | The rules worth knowing before you change something. |
| [Reporting Security Issues](/contributing/security) | The private route for vulnerabilities. |

## Quick orientation

- Repository: [github.com/PrintBench/printbench](https://github.com/PrintBench/printbench)
- Bugs and feature requests: the [issue tracker](https://github.com/PrintBench/printbench/issues)
- **Security vulnerabilities do not go in the tracker**: see [Reporting Security Issues](/contributing/security).
- Licence: [MIT](https://github.com/PrintBench/printbench/blob/main/LICENSE), © 2026 Owl Media.

## The one thing to read first

If you read only one thing before sending a pull request, make it [the `.env` rule](/contributing/testing#env-matters-more-than-you-would-expect): without a `.env`, the database-backed third of the test suite skips silently, and a green run proves much less than it appears to.

## Pull requests

- Keep a pull request to **one subject**. A drive-by fix in an unrelated file is genuinely welcome, just not in the same PR.
- Explain **why** in the commit message. The codebase's comments are written that way, and it's the convention worth keeping.
- New behaviour comes with a **test**. The suite is fast, so this is cheap.
- Formatting is Prettier's problem, not yours or a reviewer's: `npm run format`.

## Improving these docs

This documentation site lives in its own project (`printbench-docs`). It describes behaviour that can drift from the app, so when you change a setting, route or environment variable, update the matching docs page. See the repository README of the docs project.
