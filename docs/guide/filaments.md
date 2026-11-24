# Filament library

**Browse → Filaments** is the shared inventory for your household or workshop. Viewers can browse it; members and admins can add and manage spools. It has two tabs: **My spools**, your inventory, and **Catalogue**, a built-in reference of commercial filament you can add spools from.

A **filament** describes a product: brand, name, material, colour, diameter and optional recommended nozzle/bed temperatures. A **spool** is an individual roll of that filament, with its own remaining grams, purchase cost, storage location and notes.

## Filament catalogue

The **Catalogue** tab lists filament from hundreds of brands, with their colours, spool sizes and where to buy them. The data comes from the community-maintained [Open Filament Database](https://github.com/OpenFilamentCollective/open-filament-database) and is **built into PrintBench**: it works with no internet connection, and nothing is looked up online while you browse.

Search by brand, product, material or colour. Searches tolerate small typos, and every word you type must match, so `polymaker petg` finds Polymaker's PETG range rather than everything Polymaker makes. Narrow the list by brand, material and diameter. Discontinued filament is hidden unless you tick **Include discontinued**. When a search matches only some colours of a product, its card shows just those colours.

Open a product to see, where the database records them:

- print, bed and chamber temperatures, enclosure advice, and drying temperature and time;
- density, diameter tolerance, minimum nozzle size, speeds and hardness;
- links to the technical and safety data sheets, and slicer profile names;
- every colour, with traits such as silk, matte or abrasive, and each colour's spool sizes, empty-spool weight, article number and barcode;
- **Where to buy**: stores selling each spool size, where they ship from, with affiliate links labelled **Affiliate**.

Fields the database doesn't have are left out rather than shown blank. Catalogue values are community-sourced, so check the manufacturer's data sheet before relying on one for an unusual material. Links to stores and data sheets open in a new tab and are the only part of the catalogue that needs the internet.

The catalogue is refreshed with each PrintBench release. Upgrading brings newer data; it never changes in between.

## Add and find spools

Choose **Add spool**. To start from the catalogue, type in **Find in catalogue** and pick a colour. PrintBench fills in the brand, name, material, colour, diameter and recommended temperatures, using the middle of the catalogue's range rounded to 5 °C. Choose a **spool size** too, and it also fills in the nominal and empty-spool weights. Everything stays editable before you save. If you already have a filament in that colour, the form offers to add another spool of it instead of a duplicate. From a catalogue product, **Add spool** next to a colour or size opens the same prefilled form.

You can still select an existing filament, or enter its details by hand in the same form. Nominal and starting weights default to 1,000 g; enter the actual remaining weight for a partially used roll. Empty spool weight is optional and helps when weighing later.

Search by product, brand, material, colour or spool label. Filter by material, location, low stock, empty or archived. Empty spools stay visible in the active inventory. Each spool defaults to a low-stock threshold of 100 g, which you can change.

Open a spool to edit its details, duplicate it for a new roll, or archive it. Duplication asks for the new roll's starting weight. Editing filament specifications updates all its spools, while historical print details remain as recorded. Archiving a filament also hides its spools from active inventory; restoring it respects each spool's own archive state.

### Spools added from the catalogue

A spool page shows **From the catalogue** with a link back to the product it came from. The values were copied when you added the spool and are yours to edit; later catalogue updates never change them. To pick up corrected values, choose **Refresh from catalogue**. It copies the brand, material, colour and temperatures again, and keeps your filament's name, notes and diameter.

Products and colours are occasionally removed from the database upstream. A spool made from one keeps working and shows **No longer in catalogue**; the product page lists removed colours separately.

## Update remaining weight

On a spool page, choose **Update remaining weight**:

- Enter the grams of filament remaining directly.
- Or weigh the whole spool and enter its empty weight. PrintBench subtracts the empty weight to calculate filament remaining.

Enter a reason for the correction. Stock history records the correction rather than replacing past usage. Negative results from the weighing helper are rejected.

## Log prints with spools

On a model's print form, add one or more **Spools used** rows. Enter the grams used for each spool. Repeated selections of the same spool are combined. Selecting one spool fills its brand, material and colour; recommended temperatures fill unanswered fields.

PrintBench totals the grams and estimates cost using each roll's purchase cost divided by its nominal filament weight. If any roll has an unknown price, the full automatic cost is unknown. Choose **Override total cost** to enter your own total. Slicer metadata never chooses a spool or splits aggregate grams among spools for you.

Stock is deducted for finished **successful, partial and failed** prints. In-progress amounts are estimates and do not deduct stock. Editing usage applies only the difference; deleting a print reverses its usage. Manual corrections remain in the history when later print edits adjust consumption.

If recorded usage exceeds tracked stock, the print still saves. The spool shows a negative balance and **Needs correction**; weigh it or enter an updated remaining weight.

Manual logging without inventory still works. Marking a queue request done creates its usual basic print log; edit that log to add spools afterward. Archived spools can remain on existing logs but cannot be added to new usage.

## Backups

Filament specifications, spools, stock history and print usage are included in the [metadata backup](/deploy/backups), as well as database dumps, along with which catalogue entry each filament and spool came from. They are not stored in model sidecars.

The catalogue itself isn't part of your data and isn't backed up: it ships with PrintBench, and after a restore the worker reloads the catalogue of the version you're running.

Printer slot tracking, consumption synchronisation, Spoolman, CSV import/export and shopping lists are not part of this release.
