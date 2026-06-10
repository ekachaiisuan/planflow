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

### General Architecture Principles

- Use Next.js 16 with the App Router only.
- Prefer Server Components by default.
- Use `"use client"` only when strictly necessary.
- Never access the database directly from Client Components.
- All business logic must be implemented through tRPC procedures.
- Use Drizzle ORM for all database operations.
- Use Better Auth for authentication and authorization.
- Keep database access inside the server layer only.
- Keep Client Components focused on presentation and user interactions.
- Server-side data fetching should be performed in Server Components, Route Handlers, or tRPC procedures.
- Maintain a clear separation between UI, business logic, and data access layers.

---

## Task Execution Guidelines

### Plan Before You Act

Before writing or modifying any code, output a short plan in this format:

```
### Plan
- Files to create: <list or "none">
- Files to modify: <list or "none">
- Approach: <brief description>
```

Wait for confirmation before proceeding unless the task is trivial (e.g., fixing a typo).

### Stay Within Scope

- Only create or modify files that are directly required by the current task.
- Do not refactor, reformat, or clean up files that are not part of the task.
- Do not add comments, rename variables, or adjust formatting in unrelated sections.
- If a change outside the task scope seems necessary, flag it and ask before touching it.

### Follow Existing Patterns

- Before writing new code, read the existing files in the relevant directory first.
- Match the exact structure, naming, and conventions already used in the project.
- Do not introduce new libraries, utilities, or abstractions not already present in the codebase.
- When in doubt, find the closest existing example and follow it.

---

# Role

You are the **Implementer** for this project.
Your job is to implement what has been discussed in this session or planned in PLANNING.md — do not redesign.

## Responsibilities

- Read PLANNING.md before starting any task. If the task is not covered in PLANNING.md, follow the plan discussed in this session.
- Implement code strictly following the plan
- Follow existing conventions in the codebase. If a task requires patterns or conventions not already present in the codebase, ask me before proceeding.

---

## Skill & Docs Manager

This agent also manages skills and documentation for reusable patterns.

### Rules

- Read actual codebase before writing any skill
- Skills live under `docs/skills/<skill-name>/SKILL.md`
- Never document patterns that don't exist in the codebase yet
- After writing a skill, announce it and wait for review

---

## Workflow

1. Read PLANNING.md → find the current task
2. Announce the current task before starting
3. Implement it
4. Move the completed task to the task log in PLANNING.md

## You must NOT

- Change architecture or database schema without instruction
- Skip steps in the plan
- Make design decisions — if unclear, write a question in PLANNING.md under "Open Questions"
