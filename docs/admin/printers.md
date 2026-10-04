# Printers

Connect your network printers under **Manage → Printers** (admin only) so members can **Send** sliced files straight to them. See [Slicers & Printers](/guide/slicers-and-printers) for the user side.

![The Printers page with a Moonraker and a PrusaLink printer](/images/admin/printers.png)

You don't need to add anything here to use **Open in…**. That works with any slicer and any printer.

## Supported printer software

| Type | Notes |
| --- | --- |
| **OctoPrint** | The API key is under *Settings → Application Keys*. |
| **Moonraker** (Klipper / Fluidd / Mainsail) | Usually needs no key on a trusted LAN. |
| **PrusaLink** (Prusa MK4, XL, Mini) | The key is on the printer under *Settings → Network*. |

## Adding a printer

![The Add printer form](/images/admin/printers-add.png)

1. **Add printer** and give it a **Name**.
2. Choose the **Type**.
3. Enter the **Address**, including the scheme, e.g. `http://octopi.local` or `http://192.168.1.42`.
4. Enter the **API key**, if the printer needs one.
5. Optionally choose a default for **start on arrival**.
6. **Test the connection** from the same page.

### The connection test tells you what's wrong

It reports the actual problem rather than a generic failure, for example:

- *Could not resolve …*: DNS. Inside Docker, remember the container can only reach what its network can; use an IP address if a `.local` name doesn't resolve.
- *The printer rejected the API key.*

## Where Send appears

**Send** is offered on sliced files, `gcode`, `bgcode`, `sl1`, `ctb`, `3mf`, once at least one printer exists, to members and admins.

## Credentials

API keys are encrypted at rest with AES-256-GCM, keyed from `BETTER_AUTH_SECRET`. If you ever rotate that secret, stored keys become unreadable and you'll need to re-enter them. See [Security Model](/concepts/security).

## Editing and removing

Use the edit and remove controls on a printer's row. Removing a printer doesn't affect any files or print history.

## Network reachability

The **web** process talks to the printer, so the printer must be reachable *from the web container*. A printer on your LAN is normally reachable from a Docker host on that LAN; one behind a different VLAN or on a different network may need routing or firewall changes.
