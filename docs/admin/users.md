# Users & Roles

User management is under **Manage → Users** (admin only).

## Roles

PrintBench has three roles, in ascending order:

| Role | Summary |
| --- | --- |
| **Viewer** | Browse, search, download, like, and raise print-queue requests. |
| **Member** | Everything a viewer can do, plus edit models, upload, import, log prints, run the queue, send to printers and trigger scans. |
| **Admin** | Everything, including libraries, printers, users and settings. |

The full list of what each role can do is in [Roles & Permissions](/reference/roles). Hiding a button is never the only protection; every mutating action is checked on the server too.

A suspended user is denied everything, even an admin.

## Adding people

![The Users page](/images/admin/users.png)

**Invite someone** or **add them directly**:

### Invitation link

![Creating an invitation link](/images/admin/users-invite.png)

1. Press **Invite someone**.
2. Optionally enter an **email**; this locks the invitation to that address and pre-fills it for them.
3. Choose a **role**.
4. Copy the generated **invitation link** and send it yourself. PrintBench doesn't send email.

The person opens `/invite/<token>` and chooses a password. Invitations expire after **14 days**, are single-use, and unused ones are listed under **Unused invitations** where you can cancel them.

### Create the account yourself

Press **Add** and fill in name, email, a password (at least 10 characters) and a role. Use this when you'd rather hand over credentials than a link.

## Managing an account

Use the manage control on a user's row:

| Action | Effect |
| --- | --- |
| **Edit name / email / role** | Change the account's details. |
| **Suspend** / **Restore access** | Blocks or restores sign-in. Usually what you want rather than deleting. |
| **Reset password** | Create a private reset link. See [Password Recovery](/admin/password-recovery). |
| **Delete account** | Removes it permanently. You're asked to type the email to confirm. |

None of the destructive actions appear for your own account, so you can't suspend or delete yourself by accident.

A suspended person keeps working until their session cookie expires or is revoked, so for an urgent lockout also change their password.

## The default role

New accounts start as whatever **New accounts start as** is set to, *Viewer* or *Member*, under [Instance Settings](/admin/settings). The first account (created at `/setup`) is always an admin.

## Choosing roles

- Give **viewers** to people who just want to look things up or ask for prints.
- Give **members** to the people who curate the library and run the printers.
- Keep **admins** few: they can change what the whole instance indexes and can connect printers.
