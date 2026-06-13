# Planning — Onboarding (auto-redirect + sidebar card)

> Implementer: **Gemini**. Read `docs/implementer-guide.md` first, then follow this
> plan. Output your `### Plan` block and wait for confirmation before coding.

## Goal

Force every verified user to complete their profile before using the app:

1. **Auto-redirect** — right after a user verifies and logs in, send them to
   `/profile` automatically (no click needed).
2. **Sidebar onboarding card** — a persistent Card in the sidebar that invites the
   user to complete their profile and links to `/profile`. It disappears **only**
   after the user saves their profile data (no manual dismiss).

**Why everyone needs a profile:** the `user_profile` row will be used as a relation
for the upcoming **workspace** module, so a completed profile is a hard
prerequisite for every user regardless of role.

## Decisions (locked — do not redesign)

- **No dismiss button.** The card hides only when `userProfile.get` returns a row
  (i.e. the user has saved their profile).
- **No role gating.** The card + redirect apply to every user without a completed
  profile, regardless of `role`.
- **Auto-redirect, not just an invite.** The card is the persistent reminder; the
  redirect is the active push on login.

## Background (already true — do NOT re-implement)

- New users get role `user` via `adminPlugin({ defaultRole: 'user' })` in
  `lib/auth.ts`. No role change needed.
- `user.emailVerified` (boolean, `db/schema/auth.ts`) is `true` after email
  verification and `true` automatically for GitHub sign-ups. This is the
  "verified" signal. Available on the session at `session.user.emailVerified`
  (both server `authIsRequired()` and client `authClient.useSession()`).
- `userProfile.get` (`trpc/server/routers/user-profile.ts`) returns the profile
  row or `null` when not completed. `null` ⇒ needs onboarding. **Reuse it — do not
  add a new procedure or touch the schema.**
- **All authenticated users funnel through `/dashboard`:** email login pushes to
  `/dashboard` (`components/forms/login-form.tsx`), GitHub uses
  `callbackURL: '/dashboard'` (`components/social-auth-button.tsx`), and
  `app/page.tsx` already `redirect('/dashboard')` for any existing session. So a
  single guard on `/dashboard` covers every post-login entry.
- `app/dashboard/page.tsx` already imports `getQueryClient` and `trpc` from
  `@/trpc/server` and awaits `authIsRequired()`.
- `AppSidebar` (`components/app-sidebar.tsx`) is a client component that already
  reads `authClient.useSession()` and renders nav pieces in `SidebarContent`. The
  sidebar is `collapsible="icon"`.

## Plan — step by step

### Part A — Auto-redirect guard on `/dashboard`

Modify **`app/dashboard/page.tsx`** only:

- After `const session = await authIsRequired();`, fetch the profile **through the
  existing tRPC server proxy** (no direct DB import):

  ```ts
  const queryClient = getQueryClient();
  const profile = await queryClient.fetchQuery(
    trpc.userProfile.get.queryOptions(),
  );
  if (session.user.emailVerified && profile == null) {
    redirect('/profile');
  }
  ```

- Reuse the same `queryClient` instance for the existing `count.getCount`
  prefetch below (don't create a second one). Import `redirect` from
  `next/navigation`.
- Do **not** add this guard to `/profile` (that is the redirect target — adding it
  would loop) or to any other page.

### Part B — Sidebar onboarding card

1. **Create `components/nav-onboarding.tsx`** (`'use client'`), self-contained,
   takes no props, returns `null` unless it should show. Show only when ALL:
   - `session` exists and is not loading (`authClient.useSession()`).
   - `session.user.emailVerified === true`.
   - `userProfile.get` returned `null`.
   - (Hide when the sidebar is icon-collapsed via
     `group-data-[collapsible=icon]:hidden` on the wrapper.)

   Query the profile with the project's tRPC client pattern
   (`agents/skills/patterns/trpc-patterns/SKILL.md`): `const trpc = useTRPC()`
   then `useQuery(trpc.userProfile.get.queryOptions())`. Use **`useQuery`**, not
   `useSuspenseQuery` (the sidebar has no Suspense boundary). Gate with
   `enabled: Boolean(session?.user?.emailVerified)`. While session/query are
   loading, render `null` (avoid flicker).

   Card content (shadcn `Card` from `components/ui/card.tsx`):
   - Title: `Complete your profile`
   - Description (muted, `text-sm`): `Add your name, position and department to
     finish setting up your account.`
   - A `next/link` `Link` to `/profile` wrapping a `Button` (follow the
     `Link`-in-sidebar usage in `components/nav-user.tsx`); label `Go to profile`.

2. **Modify `components/app-sidebar.tsx`**: import `NavOnboarding` and render
   `<NavOnboarding />` inside `<SidebarContent>` (above `NavProjects`). One import
   + one line — do not refactor anything else.

> Note: after Part A redirects a fresh user to `/profile`, the card stays visible
> across the app until they save, covering any navigation before completion. The
> existing `save` mutation already invalidates `trpc.userProfile.get`, so the card
> and any cached guard state update automatically once the profile is saved.

## Constraints (Gemini MUST follow)

- Do **not** add or change any database schema, migration, or tRPC procedure.
  Reuse `userProfile.get` as-is.
- Server-side profile read must go through `getQueryClient().fetchQuery(...)` with
  the `trpc` server proxy — do **not** import `db`/Drizzle into the page.
- Follow `agents/skills/patterns/trpc-patterns/SKILL.md` and the new-proxy-API
  rules in `agents/skills/playbooks/trpc-tanstack/SKILL.md` (use `useTRPC()` +
  `queryOptions()`; there is **no** `trpc.x.useQuery()` in this project).
- Client card uses `useQuery` (not `useSuspenseQuery`).
- Reuse existing UI primitives only (`card.tsx`, `button.tsx`, `sidebar.tsx`,
  `next/link`). No new libraries.
- Touch only these three files: `app/dashboard/page.tsx` (modify),
  `components/nav-onboarding.tsx` (new), `components/app-sidebar.tsx` (modify). If
  anything else seems required, stop and add it under "Open Questions".
- Validate with `pnpm lint` and `pnpm build` (no automated tests in this repo).
- When done, move this plan to `docs/done/p5-onboarding.md` and reset
  `docs/current-task.md`.

## Open Questions

- None outstanding. (Scope of the guard is intentionally limited to `/dashboard`
  as the single post-login funnel; if a stricter "block every authenticated route
  until profile complete" gate is wanted later, raise it as a follow-up tied to
  the workspace module.)
