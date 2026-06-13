# Current Task

## Summary of the previous plan

- Built the user-profile form + `userProfileRouter` (`get` / option lists / `save` upsert), wired into `/profile` with prefetch + HydrationBoundary.
- Removed the `delete` capability from both the form and the router (users may only create/edit their own profile).
- Deleted dead `app/management/_components/create-dep-form.tsx`.
- Updated `agents/skills/patterns/trpc-patterns/SKILL.md` to base on `user-profile.ts`; added `agents/skills/playbooks/trpc-tanstack/SKILL.md`.

---

## Completed task: **P5 — Onboarding (auto-redirect + sidebar card).**

We have successfully implemented the onboarding guard and sidebar prompt card to require users to fill in their profile details before they can use the application:

1. **Auto-redirect guard:** Added server-side profile verification to `app/dashboard/page.tsx`. If an email-verified user logs in but has no profile row (`userProfile.get` returns `null`), they are automatically redirected to `/profile`.
2. **Sidebar onboarding card:** Created a new client component `components/nav-onboarding.tsx` that displays a premium-designed reminder card inside the sidebar when the user needs onboarding. The card hides automatically when:
   - The user has saved their profile.
   - The user is not email-verified.
   - The sidebar is collapsed into icon mode.
3. **Sidebar integration:** Registered and rendered the onboarding card inside `<SidebarContent>` above the projects navigation list in `components/app-sidebar.tsx`.
