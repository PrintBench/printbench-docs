# Search Internals

These findings were validated against Postgres 18 with real fixture data before any search UI was built. Re-run the checks if the text-search configuration changes.

## The approach

Search is **Postgres full-text search with trigram typo tolerance**: a weighted `tsvector` with a GIN index, plus `pg_trgm`. No Elasticsearch, no sync problem, nothing else to run. Search state lives in the URL, so searches are bookmarkable and the back button works.

### Configuration

`pb_search` is the `english` configuration plus `unaccent`, so *pokemon* matches *Pokémon* and stemming works (*game* matches *games*).

### Weights

A model's search vector weights its fields:

| Weight | Field |
| --- | --- |
| **A** | Name |
| **B** | Creator and tags |
| **C** | Notes |
| lowest | Filenames |

Relevance ordering puts a name match above a tag match above a note match.

## Two traps, both hit and fixed

### 1. Filenames tokenise as a single token

Postgres's default parser classifies `presupported/dragon_body.stl` as one `file` token, so searching *presupported* returns nothing.

**Fix:** `regexp_replace(filename, '[^[:alnum:]]+', ' ', 'g')` before `to_tsvector`. Verified with `ts_debug`, which then yields `presupported | dragon | body | stl`.

::: warning Not `translate`
`translate(x, '/_-.', ' ')` does **not** work. When the target string is shorter than the source set, `translate` *deletes* the unmatched characters, collapsing `dragon_body.stl` to `dragonbodystl`.
:::

### 2. Trigram operator direction

For typo tolerance use **`query <% target`**, not `%>`. Postgres defines `a <% b` as `word_similarity(a, b) > threshold`, and `%>` is its commutator; the arguments are the other way round. Using `%>` silently matches almost nothing.

Use **`word_similarity`**, not `similarity`: `similarity()` compares whole strings, so a short query against a long model name scores far too low: `similarity('Red Dragon Miniature','dragon')` is only 0.12.

## Threshold

`SET pg_trgm.word_similarity_threshold = 0.5` per session. Measured against *Red Dragon Miniature*:

| Query | Typo kind | `word_similarity` | Matches at 0.5 |
| --- | --- | --- | --- |
| `dragon` | exact | 1.000 | yes |
| `draggon` | doubled letter | 0.667 | yes |
| `dragn` | dropped letter | 0.667 | yes |
| `minature` | dropped letter | 0.583 | yes |
| `dargon` | transposition | 0.286 | **no** |
| `banana` | unrelated | 0.000 | no |

## Known limit

**Transpositions defeat trigrams**, `dargon` shares only 3 trigrams with `dragon`. Lowering the threshold to 0.25 would catch it but admits noise.

If transposition tolerance is ever wanted, the plan is to add the `fuzzystrmatch` extension and apply `levenshtein(query, name) <= 2` as a rescue pass over a bounded candidate set for short queries, instead of lowering the global threshold.

## The command menu

The quick menu (`⌘ K`) uses a lightweight lookup for models, creators and tags, and ignores responses overtaken by a newer keystroke so a slow reply can't clobber a fresh one.
