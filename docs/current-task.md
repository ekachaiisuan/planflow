# Current Task

ืnone task

## Summary of the previous plan

- Updated `trpc/server/routers/management.ts` to use `auth.api.userHasPermission()` for `appConfig: ['manage']`.
- Passed the role from `ctx.user.role` as a `Role` union instead of relying on `roleMap`.
- Kept the department, position, and prefix router structure unchanged.
- Documented the finished work in `docs/done/p4-management-router-permission-fix.md`.
