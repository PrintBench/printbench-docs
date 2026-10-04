# How It Works

You don't need any of this to use PrintBench, but it explains *why* it behaves the way it does, and it's what to read when something surprises you.

| Page | What it explains |
| --- | --- |
| [Architecture](/concepts/architecture) | The processes, the packages and what runs where. |
| [How Models Are Grouped](/concepts/grouping) | How a tree of folders becomes a list of models. |
| [Metadata & Sidecars](/concepts/sidecars) | Why your edits live on disk as well as in the database. |
| [Search Internals](/concepts/search) | Weighted full-text, trigram typo tolerance and the traps avoided. |
| [Previews & Thumbnails](/concepts/previews) | The pure-TypeScript rasteriser and the isomorphic 3MF parser. |
| [Safety Guards](/concepts/safety) | Why PrintBench refuses to act on what looks like a mass deletion. |
| [Security Model](/concepts/security) | Roles, signed links, share tokens and encrypted credentials. |
| [Design Decisions](/concepts/design-decisions) | The reasoning behind the big choices, in one list. |

## The principles

1. **Your files are yours.** An existing library is mounted read-only and PrintBench never moves, renames or deletes anything in it.
2. **Postgres is the only dependency.** Jobs, search and everything you typed live in one database.
3. **Nothing to compile.** Parsing and rendering are pure TypeScript.
4. **The database is rebuildable.** Metadata is written back beside your models so a rescan can restore it.
5. **Refuse rather than destroy.** When the world looks wrong (an unmounted drive, say), stop and ask.
6. **The web tier does no heavy I/O.** Big transfers bypass Node.
