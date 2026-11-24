# Storage

**Manage → Storage** (admin only) is where S3 buckets and the keys that reach them are set up. Each one is an **S3 connection**: a bucket, where it is, and how to sign in to it. Libraries then pick a connection and a prefix within its bucket, so a bucket split into several libraries has its key entered once, and rotating or withdrawing that key is one change rather than one per library.

Local folders and NAS mounts don't need anything here. See [Libraries](/admin/libraries).

## Adding a connection

**Add an S3 connection**, then:

| Field | Notes |
| --- | --- |
| **Name** | Shown when choosing storage for a library. Must be unique. |
| **Bucket** | Name only, with no `s3://` and no URL. |
| **Region** | Blank means `us-east-1`. |
| **Endpoint** | Blank for AWS. Set it, with the scheme, for MinIO, Backblaze B2, Wasabi, Cloudflare R2 and so on: `https://minio.example.com`. |
| **Access key ID** | Blank to use the server's own credentials: an instance role, `AWS_*` environment variables or a mounted credentials file. |
| **Secret access key** | Encrypted before it is stored, and never shown again. |

Saving checks that the bucket answers with these settings. The check runs at the root of the bucket, because no library has chosen a prefix yet, so a key that IAM restricts to one prefix can fail it.

Once the connection is saved, **Add library** on its row starts a new library with that connection already chosen.

Bucket setup, the minimum IAM policies, the CORS rule for the 3D viewer and per-provider endpoints are in [S3 & Compatible Storage](/deploy/s3).

## The storage page

Each connection shows its bucket, endpoint and region, whether a key is stored or the server's own credentials are used, and every library on it with its prefix. A library's name links to its **Edit** page.

A connection whose stored secret can no longer be read is flagged in red. That happens when `BETTER_AUTH_SECRET` has changed since the secret was saved. Edit the connection and enter the secret again.

## Rotating a key

Edit the connection and enter the new **Access key ID** and **Secret access key** together. Every library on the connection uses the new key from its next request or job; nothing needs restarting.

Before anything is saved, the new settings are checked against **every library on the connection, at its own prefix**. If any one of them can't be read, nothing changes and the message names the library. A rotated key that only works for some of the bucket is caught here, rather than at that library's next scan.

When editing:

- **Leave the secret blank** to keep the stored one, for example when only renaming the connection or changing its region.
- **A new access key ID needs its secret.** Leaving the secret blank with a different key ID is refused, rather than pairing the new key with the old secret.
- **Clear the access key ID** to switch the connection to the server's own credentials. The stored secret is removed with it.
- **The bucket is fixed** while any library uses the connection. Changing it would point every one of them at different files. Add a new connection for another bucket instead. The endpoint can still change, for a gateway that has moved host but holds the same files.

## Withdrawing access

A connection that a library still uses **can't be removed**. Removing a credential should never be a quiet way to take libraries down with it. The message lists the libraries in the way.

To withdraw a key:

1. Move each of its libraries to another connection for the same bucket: **Edit** on the library's row, then choose the **S3 connection**. Or remove the library, which deletes only the index, never anything in the bucket.
2. Remove the connection. Nothing in the bucket is touched.

Then revoke the key with your storage provider as well.

## Upgrading from per-library settings

Before connections existed, each S3 library held its own bucket and key. Upgrading moves each library into a connection of its own, named after the library, with its encrypted secret carried across unchanged. Nothing needs re-entering.

Libraries that shared a bucket and key end up with one connection each, because encrypted secrets can't be compared to tell which are the same. To consolidate them, edit each library onto one of the connections, then remove the others.

A backup taken before the upgrade is moved across the same way when it is restored.

## Permissions

Managing connections needs the **admin** role, the same `library:manage` permission as libraries. Adding, changing and removing a connection is recorded in the audit log with which fields changed, never the key itself. See [Roles & Permissions](/reference/roles).
