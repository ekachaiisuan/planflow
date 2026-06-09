# Authentication

## Planflow uses Better Auth for authentication and session management.

Better Auth is configured in `lib/auth.ts` (server) and `lib/auth-client.ts` (client). The API handler lives at
`app/api/auth/[...all]/route.ts`.

Supported: email/password, GitHub OAuth, 2FA (TOTP + backup codes), email verification, password reset.

Roles defined in `lib/permissions.ts`: `user` · `officer` · `manager` · `admin`. Project resource permissions: `user` → read; `officer` → read/create/update; `manager`/`admin` → full CRUD + manage.

Authorization must always be enforced server-side (in tRPC procedures), never only in the UI.

---

## Email Features

Implemented using Resend.

Supported emails:

- Email Verification
- Password Reset
- Welcome Email

---
