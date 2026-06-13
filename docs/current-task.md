# Current Task

**P5 — Onboarding (auto-redirect + sidebar card).** Full plan in `docs/planning.md`.

Verified users with no profile are auto-redirected to `/profile` via a guard on
`/dashboard` (the single post-login funnel), and a persistent sidebar Card invites
them to complete their profile until they save it (no dismiss, no role gating —
every user must have a profile for the upcoming workspace relation). Touches only
`app/dashboard/page.tsx`, `components/nav-onboarding.tsx` (new), and
`components/app-sidebar.tsx`.

## Summary of the previous plan

- Built the user-profile form + `userProfileRouter` (`get` / option lists /
  `save` upsert), wired into `/profile` with prefetch + HydrationBoundary.
- Removed the `delete` capability from both the form and the router (users may
  only create/edit their own profile).
- Deleted dead `app/management/_components/create-dep-form.tsx`.
- Updated `agents/skills/patterns/trpc-patterns/SKILL.md` to base on
  `user-profile.ts`; added `agents/skills/playbooks/trpc-tanstack/SKILL.md`.
