# Auth Operator Role Update

## Goal

Update `lib/auth.ts` and `lib/auth-client.ts` so Better Auth recognizes the existing `operator` role from `lib/permissions.ts`.

## Completed Work

- Added `operator` to the `adminPlugin` role map in `lib/auth.ts`.
- Added `operator` to the `adminClient` role map in `lib/auth-client.ts`.
- Kept the existing `defaultRole: 'user'` setting unchanged.
- Did not change schema or migrations.

## Notes

- `operator` already existed in `lib/permissions.ts`, so this was a wiring update only.
