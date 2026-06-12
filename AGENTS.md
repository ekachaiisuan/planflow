<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Repository Guidelines

## Project Structure & Module Organization

See `architecture.md`. and `project.md`.

## Authentication & Authorization

See `auth.md`.

## Build, Test, and Development Commands

Use pnpm for package management; `pnpm-lock.yaml` is committed.

- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create a production build and run Next.js compile-time checks.
- `pnpm start`: serve the production build locally.
- `pnpm lint`: run ESLint with Next.js core web vitals and TypeScript rules.

There is no committed test script yet. Align any new test runner with the existing stack first.

## Coding Style & Naming Conventions

Write TypeScript with `strict` mode in mind. Prefer React Server Components by default and add `"use client"` only for browser APIs, interactivity, or client hooks. Use the `@/*` path alias for root-relative imports.

Follow existing file naming: route files use Next conventions (`page.tsx`, `layout.tsx`, `route.ts`), shared React components use kebab-case filenames such as `nav-user.tsx`, and schema modules live under `db/schema/`. Keep `components/ui/` aligned with shadcn conventions and lucide icons.

## Testing Guidelines

Automated tests are not currently configured. For now, validate with `pnpm lint` and `pnpm build`, then manually exercise affected routes in `pnpm dev`. If you add tests, colocate them near the feature or create a clear `tests/` structure, use names like `feature-name.test.ts`, and document the command in `package.json`.

## Commit & Pull Request Guidelines

Recent commit messages are short phrases such as `prepare getqueryclient` and `before gen ai`. Keep commits focused and explain the user-visible change. Pull requests should include a concise summary, linked issue or task when available, screenshots for UI changes, and validation performed (`pnpm lint`, `pnpm build`, manual route checks).

## Security & Configuration Tips

Environment values are loaded from `.env`; never commit secrets. Database configuration reads `DATABASE_URL` in `drizzle.config.ts`. Treat auth, role, and permission changes in `lib/auth.ts`, `lib/permissions.ts`, and `db/schema/auth.ts` as high-risk and validate them carefully.

Architecture rules and coding principles: see `architecture.md`.

---

## Implementer Instructions

Role, task-execution rules, skill-management rules, workflow, and constraints: see `docs/implementer-guide.md`.
