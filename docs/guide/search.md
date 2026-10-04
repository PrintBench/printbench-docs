# Search & Filters

Search is a weighted Postgres full-text index with trigram matching for typos. There is no separate search service to run or keep in sync.

![Search results for "dragon" with the filter panel on the left](/images/guide/search.png)

Open **Search** from the sidebar, or press `⌘ K` / `Ctrl K` anywhere for the quick command menu.

## What gets searched

A query matches against a model's name, its filenames, tags, creator and notes. Filenames are split on punctuation first, so a model containing `presupported/dragon_body.stl` is found by searching `presupported`, `dragon` or `body`.

![A misspelled query, "draggon", still finding the dragon models](/images/guide/search-typo.png)

- **Accents are ignored**: `pokemon` finds *Pokémon*.
- **Stemming works**: `game` finds *games*.
- **Typos are tolerated**: `draggon`, `dragn` and `minature` all find what you meant.
- **Transposed letters are the exception**: `dargon` won't match *dragon*. See [Search Internals](/concepts/search) for why.

## Filters

Narrow results with the facet panel. Every facet shows a count so you can see what a filter will do before you click it.

![Search narrowed by the organiser tag using the facet panel](/images/guide/search-filters.png)

| Filter | What it does |
| --- | --- |
| **Type** | Models or packages. |
| **Library** | Restrict to one or more libraries. |
| **Creator** | One or more creators. |
| **Tags** | One or more tags. |
| **Licence** | One or more licences. |
| **Format** | STL, 3MF, OBJ, PLY and so on. |
| **Pre-supported** | Models with supported variants. |
| **Never printed** | Models with nothing in the print history. |
| **No preview** | Models with no thumbnail, handy for finding things that need attention. |
| **Minimum size** | Hide small files. |

## Sorting

| Sort | Meaning |
| --- | --- |
| **Best match** | Relevance to your query (the default when searching). |
| **Name** | Alphabetical. |
| **Newest** / **Oldest** | By when the model was added. |
| **Largest** | By total size. |

## Searches are URLs

All search state (the query, filters, sort and page) lives in the page address. That means:

- A filtered search can be **bookmarked** or **shared** with someone else on your instance.
- The **back button** steps through your refinements.
- Changing any filter resets you to page one, so you never land on page 7 of a result set that now has two pages.

## The command menu

`⌘ K` / `Ctrl K` opens a quick menu that searches models, creators and tags as you type, and also jumps to any page in the sidebar. It's the fastest way to reach a model you already know the name of.

![The command menu opened with Cmd+K](/images/guide/command-menu.png)

## Counts exclude missing models

Counts everywhere, facets, creator pages, tag pages, exclude models that are currently **missing from disk**. A creator page promising forty models when eight are on an unplugged drive would send you looking for something that isn't there.
