# Authentication

## Planflow uses Better Auth for authentication and session management.

---

## Configuration

## Server

- lib/auth.ts

### Responsibilities:

- Better Auth configuration
- Drizzle adapter integration
- Email verification
- Password reset
- Auth plugins

## Client

- lib/auth-client.ts

### Responsibilities:

- Client authentication helpers
- Two-factor support
- Session handling

---

## Authentication Actions

Location:
server/auth-actions.ts

Examples:

- signInAction()
- signUpAction()
- sendVerificationEmailAction()
- requestPasswordResetAction()
- resetPasswordAction()

---

## Email Features

Implemented using Resend.

Supported emails:

- Email Verification
- Password Reset
- Welcome Email

---
