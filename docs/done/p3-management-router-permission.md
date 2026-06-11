# Management Router Permission Update

## Goal

Update `trpc/server/routers/management.ts` so the management router follows the new Better Auth access-control setup for `appConfig: manage`.

## Completed Work

- Replaced the hardcoded `manager | admin` role check with `ac.hasPermission()`.
- Imported `ac` from `lib/permissions.ts`.
- Kept the department, position, and prefix router CRUD logic unchanged.
- Left transaction usage and schema structure untouched.

## Notes

- The management router now matches the permission model where `operator` and `admin` can access `appConfig: manage`.
