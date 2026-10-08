# Print History

Print history is the record of what you've printed: which model, on which printer, in what material, and how it went. It is per-model, and there is also a library-wide log.

Logging prints needs the **member** role. Everyone can read the history.

## Logging a print

On any model page, open **Print history** and add an entry. Every field is optional except what you want to remember.

![The Log a print form](/images/guide/print-log-form.png)

| Field | Notes |
| --- | --- |
| **Outcome** | Success, failed, partial, or *Still printing*. |
| **File printed** | Pick which file. For a `.gcode` file, this **fills the settings in** for you by reading its metadata. |
| **Printer** | e.g. *Bambu P1S*. |
| **Material** | e.g. *PLA*. |
| **Filament colour** | Optional colour swatch (hex). |
| **Layer height / Nozzle / Nozzle type** | Millimetres, and the nozzle kind. |
| **Started / Finished** | Leave *Finished* blank while it runs. |
| **Duration** | Worked out from the timestamps unless you type one. |
| **Filament used** | Grams. |
| **Rating** | 1–5 stars. |
| **Notes** | Anything worth knowing next time, *Brim helped with warping*. |

Two collapsible groups hold the detail:

- **Filament details**: brand, colour name and cost (what *this print* used, not the whole spool).
- **Slicer settings**: infill, walls, supports, bed adhesion, nozzle and bed temperatures, slicer and version, and the named profile.

Entries can be edited or deleted from the history list.

## The library-wide log

![The library-wide print history](/images/guide/prints.png)

![The Failures filter](/images/guide/prints-failures.png)

**Print history** in the sidebar (`/prints`) lists every print across the library as a timeline, with a summary line (count, success rate and so on). Filter it:

| Filter | Shows |
| --- | --- |
| **Everything** | All entries. |
| **Successes** | Successful prints. |
| **Failures** | Failed and partial prints. |
| **Still printing** | Prints in progress. |

Search also has a **Never printed** facet, to find models you own but haven't tried. See [Search & Filters](/guide/search).

## Success rates

A model's **success rate** is *unknown*, not 0%, until at least one print has settled. A model whose only print is still running has no verdict yet, and 0% would read as a failure.

## From the print queue

Marking a **linked** [print queue](/guide/print-queue) request as *printed* records an entry in the history automatically, so a model printed off the back of a request doesn't go on reporting "never printed". Reopening the request withdraws that entry again, unless somebody has since rated or weighed it, in which case it has been adopted as a real record and is left alone. A request with no model linked logs nothing.

## Using inventory spools

Add **Spools used** rows to link a print to your [filament library](/guide/filaments). PrintBench totals grams, estimates cost and deducts stock for finished prints, including failed ones. In-progress amounts do not deduct stock. Edits and deletion reconcile the deduction automatically. Logging without spools still works.
