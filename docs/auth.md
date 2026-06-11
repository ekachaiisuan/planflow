# Authentication

## Planflow uses Better Auth for authentication and session management.

Better Auth is configured in `lib/auth.ts` (server) and `lib/auth-client.ts` (client). The API handler lives at
`app/api/auth/[...all]/route.ts`.

Supported: email/password, GitHub OAuth, 2FA (TOTP + backup codes), email verification, password reset.

Roles defined in `lib/permissions.ts`: `user` · `officer` · `manager` · `operator` · `admin`.

| Role | project | appConfig | member |
|---|---|---|---|
| `user` | read | — | — |
| `officer` | create, read, update | — | — |
| `manager` | create, read, update, approve | — | — |
| `operator` | create, read, update, delete, approve | manage | — |
| `admin` | create, read, update, delete, approve | manage | manage |

Authorization must always be enforced server-side (in tRPC procedures), never only in the UI.

---

## Email Features

Implemented using Resend.

Supported emails:

- Email Verification
- Password Reset
- Welcome Email

---
