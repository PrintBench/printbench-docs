# Instance Settings

![The instance Settings page](/images/admin/settings.png)

**Manage → Settings** holds the instance-wide options. Anything that belongs to a single library is on that library instead (see [Libraries](/admin/libraries)).

## This instance

| Setting | Default | What it does |
| --- | --- | --- |
| **Name** | `PrintBench` | Shown in the sidebar and the browser tab. |
| **New accounts start as** | Viewer | The role given to accounts created without an explicit role. *Viewers* can browse and download; *Members* can also edit, upload and log prints. |

## Safety

| Setting | Default | What it does |
| --- | --- | --- |
| **Keep missing models for** | 30 days | A model whose files vanish is kept this long before it can be removed. This is what makes an unmounted drive recoverable, shorten it with care. Allowed range: 1–365 days. |
| **Write metadata back to disk** | On | Keeps a `.printbench.json` beside each model in *writable* libraries, so tags, creator and licence survive losing the database. Never touches your model files. |

See [Safety Guards](/concepts/safety) and [Metadata & Sidecars](/concepts/sidecars).

## Browsing

| Setting | Default | What it does |
| --- | --- | --- |
| **Load meshes in the viewer up to** | 150 MB | Larger models show their thumbnail instead, with the option to load anyway. Raise it if you have the memory. |
| **Track metadata problems** | On | Reports models with no licence, creator, tags or preview on the [health page](/admin/health). Turn it off if you don't curate that far. The important checks keep running either way. |
| **Allow share links** | Off | Lets a signed-out visitor open a model that has been explicitly [shared](/guide/sharing). Off means the instance is entirely private, and turning it off closes every existing link. |

## What isn't here

Environment-level settings (database, secrets, ports, storage roots) are set in `.env` and the Compose files, not in the UI. See [Environment Variables](/reference/environment).
