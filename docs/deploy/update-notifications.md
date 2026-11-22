# Update Notifications

A self-hosted instance has nobody watching a release feed on its behalf, so it can sit months behind a security fix with nothing on screen hinting at it. PrintBench compares the version it is running against the latest published release and says so in two places.

It only ever **tells you**. Nothing downloads itself, and nothing restarts: upgrading stays a deliberate act. See [Upgrading](/deploy/upgrading) for how to do it.

## Where you see it

**Manage → Settings → Updates** shows the version this instance runs, whether anything newer exists, and when the released version was last read.

| Element | What it does |
| --- | --- |
| **This instance runs PrintBench _x.y.z_** | The version baked into the running build. Shown even when checks are off, because "which version am I on?" is the question you need answered before reporting a bug. |
| **This is the latest release** / **PrintBench _x.y.z_ is available** | The comparison, with a link to that release's notes. |
| **Last read** | When the release feed was last read successfully, in your own time zone. |
| **Check now** | Reads the feed immediately instead of waiting for the cache to expire. |
| **Check for new versions** | The switch. On by default. Remember to **Save settings** after changing it. |

When a newer release exists you also get a notice in the corner of the screen, alongside the usual scanning and processing activity:

> ⬆ PrintBench 0.9.0 is available

Clicking it opens **Settings**. Dismissing it with the **×** keeps it dismissed until the *next* release, not just until the next page load.

Only **admins** see the notice, because only an admin can act on it. Viewers and members are never shown it and never cause the feed to be read.

## What it sends

Nothing about your instance.

The check is a single unauthenticated `GET` to:

```
https://api.github.com/repos/PrintBench/printbench/releases/latest
```

No library contents, no model names, no account details, no instance URL, and not even the installed version — the request's `User-Agent` is the bare string `PrintBench`. The comparison happens locally, on the answer.

The feed is read **at most every six hours**, and the answer is shared across every browser tab and every page view in between, so an instance with ten tabs open makes the same number of requests as one with a single tab. A failed check is retried after fifteen minutes rather than on every page view.

## What it won't do

- **It won't nag about a version it cannot place.** If the running version is not a release version — a fork, a local build, a modified tag — PrintBench stays quiet rather than pointing you at a release that may be *behind* what you are running.
- **It won't offer prereleases.** Drafts and prereleases (`v1.0.0-rc.1`) are skipped. Running a prerelease is a deliberate choice, and the notice would otherwise ask you to "upgrade" to the stable release you deliberately left.
- **It won't claim you are up to date when it cannot reach GitHub.** A failed check says so and keeps showing the last version it *did* read, so an instance that has lost its network does not quietly start looking current.

## Turning it off

Clear **Check for new versions** in **Manage → Settings → Updates** and save.

With it off, the instance makes no outbound request for this at all: no request on a page view, none in the background, and the **Check now** button refuses rather than making one. The settings page still shows the version you are running. Nothing else in PrintBench depends on the setting, so an air-gapped or strictly egress-filtered instance loses only the notice.

Egress filtering achieves the same thing without the setting, but you will then see "the last check could not reach the release feed" where a clean "off" would say nothing. Prefer the switch.

## Troubleshooting

| What you see | What it means |
| --- | --- |
| *The last check could not reach the release feed* | The instance could not reach `api.github.com`: no egress, DNS, a proxy, or GitHub rate-limiting the IP. The version below it, if any, is the last one successfully read. |
| *The released version has not been read yet* | Checks are on but nothing has been read since the process started. Press **Check now**. |
| *Version checks are turned off* | The switch is off. Nothing is being compared. |
| Notice keeps coming back | It is keyed to the release, so it returns when a *newer* release appears. It also returns in a different browser: the dismissal is stored per browser, not per instance. |
| No notice, but a newer release exists | You are not signed in as an admin, checks are off, or the running version is not one PrintBench can compare (see [What it won't do](#what-it-won-t-do)). |

## See also

- [Upgrading](/deploy/upgrading) — doing the upgrade once you know there is one.
- [Release Notes](/releases/index) — what changed in each version, and its upgrade notes.
- [Instance Settings](/admin/settings) — every other instance-wide option.
- [Security Model](/concepts/security#network-requests-printbench-makes) — the full list of what PrintBench connects to.
