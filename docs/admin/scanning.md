# Scanning & Schedules

A **scan** walks a library, groups files into models, reconciles that against the database, and queues mesh analysis and thumbnail renders for anything new or changed. It runs in the worker, never in the web app.

## Fast and deep scans

| Mode | What it does | Who |
| --- | --- | --- |
| **Fast** | Trusts directory timestamps and skips unchanged directories. Used by schedules and the **Scan** button. | Members and admins |
| **Deep** | Re-stats every file. Use it when files were edited in place, or on a weekly schedule if your share doesn't update directory times reliably. | Admins |

Restoring models from [sidecars](/concepts/sidecars) is also an admin-only scan option.

A scan is also triggered automatically after an upload to an S3 library.

## Schedules

Each library has its own schedule, under the schedule control on its row.

![The schedule control with scanning and live watching options](/images/admin/schedule.png)

| Preset | Runs |
| --- | --- |
| **Manual only** | When you press the button. |
| **Hourly** | On the hour. |
| **Every 6 hours** | Four times a day. |
| **Daily** | 03:00. |
| **Weekly** | Sunday at 03:00. |
| **Custom schedule…** | Any cron expression. |

- **Server local time.** Schedules use the server's timezone, not UTC. "03:00" means three in the morning where the machine is. Set `TZ` on the containers to control it.
- **Minimum interval 15 minutes.** A cron that fires more often is refused; a fast scan already skips unchanged directories, and scanning every minute would keep a NAS awake for nothing.
- **Changes apply at once.** Schedules are evaluated by a sweep every five minutes that compares the last fire time to the last scan, rather than being registered one by one. A scan missed because the worker was down is picked up, not skipped.
- You can switch **scanning off** for a library entirely. The row then shows **Scanning off**.

## Live watching

Optionally, a **local** library can also be watched live, so changes appear without waiting for a schedule.

- **Off by default**, per library, on top of the schedule.
- Recursive watching costs one inotify watch per directory and can exceed the OS limit on a very large library, which is why it's opt-in.
- The worker reconciles its active watchers against the database every minute, so switching it on or off takes effect within a minute with nothing to restart.
- **Not available for S3.** There's no filesystem to watch; S3 libraries rely on their schedule and post-upload scans.

## Nightly jobs

| Time | Job |
| --- | --- |
| Every 15 min | Maintenance sweep, re-queues anything left pending, so a missing thumbnail heals itself. |
| Every 5 min | Library schedule sweep. |
| 03:20 | Health pass, finding problems that appear without a scan. See [Library Health](/admin/health). |
| 03:45 | Archive sweep, the only scheduled job that deletes anything. It removes models that have been missing longer than the grace period, and refuses to touch a library where *every* model is missing. |

## When a scan aborts

A scan **refuses to destroy metadata**. It aborts and asks an admin when:

| Reason | Meaning |
| --- | --- |
| `storage_unavailable` | The library root couldn't be read. |
| `empty_root` | The root is empty while the database knows of models. |
| `mass_disappearance` | More than **20%** of models would be marked missing. |

This is deliberate: an unmounted NAS looks exactly like a mass deletion. Remount the share and rescan; nothing is deleted in the meantime. The reason is shown on **Libraries**. See [Safety Guards](/concepts/safety) and [Troubleshooting](/deploy/troubleshooting#a-scan-aborted).

## Scans and S3

S3 libraries detect change with **ETags** rather than timestamps, because `LastModified` changes whenever an object is rewritten even if the bytes are identical. Mesh analysis and thumbnailing still read objects through the worker, once per file per scan.
