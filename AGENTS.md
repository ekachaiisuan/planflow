# Repository Guidelines

## Project Structure & Module Organization

Planflow is a Next.js 16 application using TypeScript, React 19, tRPC, Drizzle ORM, Better Auth, Tailwind CSS, and shadcn-style UI components.

- `app/` contains App Router pages, layouts, API routes, and route-local components such as `app/dashboard/_components/`.
- `components/` contains shared UI, form, email, navigation, and icon components. Reusable primitives live in `components/ui/`.
- `trpc/` contains client setup and server routers. Add new routers under `trpc/server/routers/` and register them in `_app.ts`.
- `db/` contains Drizzle setup and schema files in `db/schema/`.
- `lib/`, `server/`, `hooks/`, and `providers/` hold shared utilities, server-only helpers, React hooks, and app providers.
- `public/` stores static assets. `docs/` stores planning and architecture notes.

## Build, Test, and Development Commands

Use pnpm for package management.

- `pnpm dev` starts the local Next.js development server.
- `pnpm build` creates the production build and catches many type and framework errors.
- `pnpm start` serves the production build after `pnpm build`.
- `pnpm lint` runs ESLint using the Next.js core-web-vitals and TypeScript rules.

There is no configured test command in `package.json` yet.

## Coding Style & Naming Conventions

Write TypeScript and React components consistently with the existing codebase. Use 2-space indentation, double quotes, semicolons where already present, and functional components. Name React components in `PascalCase`, hooks as `useThing`, route folders in lower-case, and shared helpers in `camelCase`.

Prefer local patterns: shadcn-style primitives from `components/ui/`, Lucide icons from `lucide-react`, shared class merging via `lib/utils.ts`, and server-only code under `server/` or API routes.

## Testing Guidelines

No test framework or coverage threshold is currently configured. When adding tests, place them near the code they cover using a clear suffix such as `*.test.ts` or `*.test.tsx`, and add a matching `pnpm test` script. Until then, validate changes with `pnpm lint` and `pnpm build`.

## Commit & Pull Request Guidelines

Recent commits use short, lower-case, imperative-style summaries such as `prepare getqueryclient`. Keep commits focused and descriptive.

Pull requests should include a brief summary, validation steps run, linked issues or task references, and screenshots for visible UI changes. Call out database schema, auth, environment, or routing changes explicitly.

## Security & Configuration Tips

Keep secrets in `.env` and do not commit real credentials. Review auth, role, and permission changes carefully in `lib/auth.ts`, `lib/permissions.ts`, and related API routes. For database changes, update Drizzle schema files intentionally and document required migration steps.

## Architecture Rules

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
