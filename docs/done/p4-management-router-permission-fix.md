# Management Router Permission Fix

## Goal

Fix the management router permission middleware so `department`, `position`, and `prefix` endpoints use the documented Better Auth server API instead of the broken `ac.hasPermission()` / role-object flow.

## Completed Work

- Replaced the middleware check in `trpc/server/routers/management.ts` with `auth.api.userHasPermission()`.
- Passed `ctx.user.role` directly as a `Role` union, defaulting to `user` when the session role is null.
- Kept the CRUD logic for department, position, and prefix unchanged.
- Left the rest of the router structure intact.

## Notes

- The fix now matches the documented Better Auth admin plugin server API for permission checks.
