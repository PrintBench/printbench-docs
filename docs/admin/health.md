# Library Health

**Manage → Library health** (`/admin/health`) reports problems found in your libraries. It's an admin page in the sidebar; resolving problems is permitted at member level.

Every detector **clears its own problems**: fix the thing and it disappears at the next pass, which runs after every scan and again overnight (03:20). Anything you don't care about can be **ignored in bulk** without pretending it was fixed.

## The nine kinds of problem

Problems have a severity, danger, warning or info, shown by colour on the tiles at the top of the page. Click a tile to filter the list to that kind; filters for library and ignored items sit alongside.

![The Library health page](/images/admin/health.png)

| Kind | Severity | What it means | What to do |
| --- | --- | --- | --- |
| **Missing from disk** | Danger | The files weren't found during the last scan. | If a drive is unmounted, remount it and scan again. Nothing has been deleted. |
| **No files** | Warning | A folder was indexed but holds nothing recognisable. | Remove it, or add files. |
| **Could not be read** | Warning | The mesh couldn't be parsed, so there are no dimensions and no thumbnail. It may be truncated. | Re-download or re-export the file. |
| **Model inside another model** | Warning | One model folder sits inside another. | Usually change the grouping mode, or merge the two with a [sidecar](/concepts/grouping#taking-control-with-a-sidecar). |
| **Duplicate file** | Info | The same bytes appear in more than one model, often the same download saved twice. | Decide which copy to keep. |
| **No creator** | Info | Recording who made it makes creator pages and the filter useful. | Set the creator. |
| **No licence** | Info | Worth recording before sharing or selling a print. | Set the licence. |
| **No preview** | Info | Nothing renders for this model, so it's a blank card. | Check the mesh, or add an image. |
| **No tags** | Info | Untagged models are found by name only. | Add tags. |

The last four are **cosmetic**, tidiness rather than breakage. You can stop tracking them with **Track metadata problems** in [Instance Settings](/admin/settings); the important checks keep running either way.

## Working through the list

- Fix problems at the source (edit the model, add the file, remount the drive) and re-scan; they clear themselves.
- **Ignore** problems you've decided not to care about, individually or in bulk. Ignored items can be shown again with the ignored filter.
- A healthy library shows **The library looks healthy**.

## Why the severity matters

Severity is deliberately sparing: grading everything as urgent means nothing is. Only **missing** is shown as danger, because it can mean an unmounted drive.
