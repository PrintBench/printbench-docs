# Slicers & Printers

PrintBench doesn't slice and doesn't drive printers directly. It does the two things that are worth automating: it hands a file to your **slicer**, and it can **send** an already-sliced file to a network printer.

## Open in… your slicer

![The Open in… menu listing supported slicers](/images/guide/open-in-slicer.png)

**Open in…** appears on any file a slicer can read, and launches it with the file loaded. It works for printers with no network API at all, because the slicer takes it from there.

Supported slicers: **Bambu Studio**, **Creality Print**, **OrcaSlicer**, **PrusaSlicer**, **Cura** and **Lychee**. Each registers a URL scheme with your operating system, so the link opens the desktop app.

### Everything is delivered as 3MF

Bambu Studio's URL handler refuses any extension but `.3mf`, and checks *before* downloading. A link to an STL fails without a request ever reaching the server. So meshes are **repackaged as 3MF** on the way out, which every other slicer reads too.

- An existing **3MF is passed through untouched**, so a project keeps its plates and painted supports.
- **Geometry is preserved.** Colour on an **OBJ** or **PLY** is not, and the UI tells you so.
- **STEP files get no link.** Slicers open them happily, but PrintBench can't produce a 3MF from STEP without a CAD kernel. The offer and the converter share one list of formats precisely so they can't drift.

### Why links are signed

A desktop slicer fetches the link as a separate application, with none of your browser's cookies. So each link carries a **short-lived HMAC naming that one file**, rather than the endpoint being opened up. It can't be widened to other files or extended.

## Send to a printer

**Send** appears on **sliced** files, `gcode`, `bgcode`, `sl1`, `ctb` and `3mf`, once an admin has added a printer. Choose the printer; PrintBench uploads the file, with an optional **start on arrival**.

Supported printer software:

| Software | Printers |
| --- | --- |
| **OctoPrint** | Anything OctoPrint drives. |
| **Moonraker** | Klipper with Fluidd or Mainsail. |
| **PrusaLink** | Prusa MK4, XL, Mini. |

Admins add and test printers under **Manage → Printers**. See [Printers](/admin/printers). Sending needs the **member** role.

### Bambu printers

For Bambu printers, use **Open in…** and let Bambu Studio send the job. Pushing to a Bambu printer directly means FTPS plus MQTT with LAN mode enabled, which Bambu Studio already knows how to do. PrintBench deliberately doesn't reimplement it.

## Printer credentials

API keys have to be replayed to the printer, so they can't be hashed. Instead they are encrypted at rest with **AES-256-GCM**, keyed from `BETTER_AUTH_SECRET`. A database dump alone doesn't hand over your printers, but rotating that secret makes stored keys unreadable, and you'll need to re-enter them.
