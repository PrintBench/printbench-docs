# Sharing

A model can be shared by link, so someone without an account can look at it. Sharing is deliberately narrow.

## How it behaves

- **One model only.** A shared link grants exactly that model, not the library and not search.
- **Revocable for real.** The token in the link is separate from the model's internal id, so revoking it genuinely invalidates the link.
- **Off by default.** Sharing is disabled instance-wide until an admin turns on **Allow share links** under [Instance Settings](/admin/settings). With it off, the instance is entirely private.
- **One switch closes everything.** Turning sharing off closes every existing link at once.

## Sharing a model

On a model's page, members see a **Share** button (when sharing is enabled). Press it to create a link, copy it, or revoke it.

![The share popover with a copyable link and a Revoke button](/images/guide/share.png)

Visitors open `/share/<token>` and see the model page, preview, details and downloads, without signing in.

## Who can share

Members and admins. Viewers can't create or revoke links.

## Not the same as slicer links

[Open in…](/guide/slicers-and-printers) links are a different mechanism: short-lived, signed, and meant for a desktop slicer. Share links are long-lived until you revoke them.
