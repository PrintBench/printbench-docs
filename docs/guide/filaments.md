# Filament library

**Browse → Filaments** is the shared inventory for your household or workshop. Viewers can browse it; members and admins can add and manage spools.

A **filament** describes a product: brand, name, material, colour, diameter and optional recommended nozzle/bed temperatures. A **spool** is an individual roll of that filament, with its own remaining grams, purchase cost, storage location and notes.

## Add and find spools

Choose **Add spool**. Select an existing filament or create its details in the same form. Nominal and starting weights default to 1,000 g; enter the actual remaining weight for a partially used roll. Empty spool weight is optional and helps when weighing later.

Search by product, brand, material, colour or spool label. Filter by material, location, low stock, empty or archived. Empty spools stay visible in the active inventory. Each spool defaults to a low-stock threshold of 100 g, which you can change.

Open a spool to edit its details, duplicate it for a new roll, or archive it. Duplication asks for the new roll's starting weight. Editing filament specifications updates all its spools, while historical print details remain as recorded. Archiving a filament also hides its spools from active inventory; restoring it respects each spool's own archive state.

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

Filament specifications, spools, stock history and print usage are included in the [metadata backup](/deploy/backups), as well as database dumps. They are not stored in model sidecars.

Printer slot tracking, consumption synchronisation, Spoolman, CSV import/export and shopping lists are not part of this release.
