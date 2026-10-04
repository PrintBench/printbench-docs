# Uploading

Members and admins can add files to a library from **Upload**. Uploads need a library PrintBench is allowed to write into: a **Somewhere to upload to** library (see [Libraries](/admin/libraries#the-two-kinds-of-library)).

::: warning No upload target?
If no library accepts uploads, the page says so. Libraries pointed at "files I already have" stay read-only so nothing is ever written into them. Ask an admin to add an upload library.
:::

## Upload local files

![The Upload page with the model-site import form and the local drop zone](/images/guide/upload.png)

1. Choose a target library.
2. **Drop files or folders** onto the drop zone, or press **Choose a folder**.
3. Watch the progress; the models appear once the worker has indexed them.

### What makes uploads robust

- **Resumable.** Uploads use the [tus](https://tus.io) protocol, in small chunks, so a dropped connection loses very little and picks up where it left off. There is an 8 GB cap per file.
- **Handled by the worker.** A multi-gigabyte transfer never occupies the web tier.
- **Folder structure is kept.** That structure is what groups files into models, so a model with its own `stl` and `images` folders stays together.
- **ZIPs are extracted.** A `.zip` is unpacked server-side into its own folder rather than stored whole, so a downloaded pack can be dropped in as one file. Every entry is checked against zip-slip: an entry that tries to escape the destination is refused.

### Uploads to S3 libraries

Uploads are staged on the local data volume first, then streamed into the bucket as a multipart upload (8 MB parts, four in flight). That keeps peak memory around the in-flight window rather than the file's size, but it means the data volume needs room for your largest in-progress upload. See [S3 & Compatible Storage](/deploy/s3).

## Embedded metadata

Details embedded in a new 3MF, title, designer, description, licence, cover, can fill in the model's metadata automatically. See [Importing from Model Sites](/guide/imports#what-3mf-files-can-supply).

## Import from a link

The same page also imports a model straight from MakerWorld, Printables or Thingiverse. See [Importing from Model Sites](/guide/imports).

## After uploading

- Add tags, a creator and a licence. See [Models](/guide/models#editing-details).
- If a pack split into more models than you expected, add a `.printbench.json` to its top folder. See [How Models Are Grouped](/concepts/grouping#taking-control-with-a-sidecar).
