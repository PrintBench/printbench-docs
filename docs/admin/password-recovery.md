# Password Recovery

PrintBench has no email delivery, so recovery is done by handing someone a private link. There are two ways to create one.

## Changing your own password

Anyone signed in can change their password under **Account settings → Password**. The current password is required, and other sessions are signed out afterwards. See [Your Account](/guide/account).

## An admin resets a forgotten password

1. Open **Manage → Users**.
2. Use the **key** button beside the account.
3. Copy the private reset link and give it to the account's owner, privately.
4. The owner opens the link and chooses a password.

Reset links:

- **Expire after one hour.**
- **Work once.**
- **Replace any earlier link** for that account.
- Sign out **all sessions** when the password is reset.
- Are invalidated if the password is changed another way first.

No email delivery is needed. The public **Forgot password?** page can't issue links; it only explains this.

## Last admin locked out

If the only admin can't sign in, a trusted server operator can issue a link from the application directory, with the normal runtime environment loaded:

```sh
npm run auth:reset -- --email your@email.example
```

- `APP_URL` (or `BETTER_AUTH_URL`) must match the address people visit, or the link will point at the wrong place.
- The command prints a private reset link, **never a password**.
- It requires server and database access.

::: warning Keep reset links private
Don't paste a reset link into a chat or a log, and give it only to the account owner. Anyone who opens it first can set the password.
:::

In Docker, run the command in the web container with the same environment as the app.
