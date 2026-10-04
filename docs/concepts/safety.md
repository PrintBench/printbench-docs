# Safety Guards

A library on a NAS that's been unmounted looks *exactly* like someone deleting everything. PrintBench is built so that mistake costs you nothing.

## Read-only by default

An existing library is mounted **read-only**, so the promise that PrintBench never modifies your files is enforced by the operating system, not just by careful code. Only a library you explicitly make writable (an upload library, or `LIBRARY_READ_ONLY=false`) can be written to, and nginx's mount is always read-only.

## Scans refuse to destroy metadata

A scan aborts and asks an admin rather than act when:

| Condition | Abort reason |
| --- | --- |
| The library root can't be read | `storage_unavailable` |
| The root is empty while the database knows of models | `empty_root` |
| More than **20%** of known models would be marked missing | `mass_disappearance` |

You remount and rescan; **nothing is deleted in the meantime.** Please don't "simplify" these guards away; they exist because an unmounted share is the most common way a self-hosted library gets into trouble.

## Missing is not deleted

A model whose files vanish is marked **missing**, not removed. It's kept for a grace period (**30 days** by default, 1–365 configurable) and shows a *Missing from disk* badge. Counts everywhere exclude missing models so you aren't sent looking for something that isn't there. If the files return, the model returns.

## The archive sweep

Once a night (03:45) the archive sweep removes models that have been missing past the grace period. It is **the only scheduled job that deletes anything**, and it runs *after* the health pass on purpose. It additionally **refuses to touch a library where every model is missing**, whatever the grace period says. That's an unplugged drive, not a deletion.

## Two buttons for two kinds of "delete"

- **Remove from library** forgets the model, leaves files alone, and is undoable.
- **Delete the files** exists only for libraries PrintBench owns and requires typing the model's name.

See [Removing Models](/guide/removing).

## Import and upload safety

- Imports **never overwrite files** in an existing model.
- ZIP extraction checks **every entry for zip-slip**: an entry that tries to escape its destination is refused.
- Folder-picker paths are confined to `LIBRARY_ROOTS`.
- Uploads are resumable and size-capped; archives and images are budget-limited when parsed.

## Sidecar safety

A sidecar is never written into a folder that contains models, and sidecars from a newer version are ignored rather than half-read. See [Metadata & Sidecars](/concepts/sidecars#safety-rules).

## Verification

The scan guards and the restore drill are covered by tests, not just intent; see the `verify:phase2` and `verify:phase6` scripts in [Checks & Testing](/contributing/testing).
