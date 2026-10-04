# Removing Models

Two different things share the word "delete", so PrintBench gives them two separate buttons.

## Remove from library

![The Remove from library dialog explaining that files stay in place](/images/guide/remove-dialog.png)

**Remove from library** forgets the model and **leaves every file where it is**.

- A scan will **not** bring it back; the removal is recorded.
- It can be undone from **Manage → Libraries**, where removed models are listed.
- It is the **only** option for a library pointed at folders you already had.

## Delete the files

**Delete the files** actually erases them. It:

- Appears **only** for a library PrintBench owns and writes to (an upload library).
- Asks you to **type the model's name** to confirm, because it's the one irreversible action in the application.

## Restoring

Restoring a removed model rebuilds it from the files and its [sidecar](/concepts/sidecars) at the next scan. Notes and tags come back **only if they were written to a sidecar**, so keep [writing metadata back to disk](/admin/settings) switched on if you want removal to be fully reversible.

## When files simply vanish

A model whose files disappear from disk isn't removed; it's marked **missing** and kept for a grace period (30 days by default; see [Instance Settings](/admin/settings)). If a drive is just unmounted, remount it and scan again and nothing is lost. See [Safety Guards](/concepts/safety).

## Who can remove

Removing and deleting need the **member** role.
