# Print Queue

The **print queue** (`/queue`) is the list of things people have asked you to print. It is built for households and small teams where someone says *"can you print me a cable clip?"* and it needs to go somewhere other than your memory.

![The print queue with five requests, one already printing](/images/guide/queue.png)

Anyone signed in can **raise** a request, including a viewer. Working through the queue (starting and finishing prints) needs the **member** role.

## The sidebar count

**Print queue** in the sidebar carries a pill with the number of requests still to come off a printer: everything **Requested** plus everything **Printing**. *Done* and *Cancelled* are finished with and are not counted.

An empty queue shows no pill at all, rather than a `0` — the usual state should not look like something waiting for you. The count is read when the page is rendered, so it is right as soon as you land rather than appearing a moment later, and it is not shown to anyone whose role already hides the queue.

## Adding requests

Requests arrive in batches, so the add box takes a **whole message** and makes **one request per line**.

![Pasting a whole list: each line becomes a request and counts are parsed](/images/guide/queue-add.png)

```text
cable clip x4
2x phone stand
something to hold the kitchen roll
```

- **Counts.** A quantity can ride along at either end of a line: `cable clip x4` or `4x cable clip`.
- **Pasted punctuation is stripped.** Bullets and list markers in a pasted list don't end up in the title.
- **A title is all it needs.** People ask for things before a file exists, *"something to hold the kitchen roll"* is a perfectly valid entry.

You can also add a request from a model's own page with **Add to print queue**, optionally recording who asked and how many.

![Adding a request from a model page](/images/guide/queue-model.png)

## Priority

Each request has a **priority**, *Low*, *Normal* (the default) or *High*. High-priority requests are shown with an **Urgent** badge and sort first; low-priority ones carry a **Low** badge.

## Linking requests to models

Where a line names a model **exactly**, it is linked to it automatically. Anything less certain than an exact match is left alone for you to link by hand, either from the request's row or from the model's page. PrintBench would rather leave a request unlinked than link it to the wrong model.

## Working through the queue

| Status | Meaning |
| --- | --- |
| **Requested** | Waiting. |
| **Printing** | In progress. Can be put back in the queue. |
| **Done** | Printed. |
| **Cancelled** | Dropped. |

Members can **start printing**, **put back**, **mark printed**, **cancel**, **reopen** or **remove** a request.

Open requests also appear on the dashboard under **Waiting to print**.

## Interaction with print history

Marking a *linked* request **printed** records it in the [print history](/guide/print-history), so the model stops reporting "never printed". Reopening the request withdraws that entry, unless it has since been rated or weighed. A request with no model linked logs nothing, because print history is per-model.
