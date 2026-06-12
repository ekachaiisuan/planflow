# System Architecture

## Technology Stack

**Stack**: Next.js 16 (App Router) · TypeScript · tRPC v11 · TanStack Query · Drizzle ORM · Neon PostgreSQL · Better Auth · shadcn/ui · Tailwind CSS 4

---

## Project Structure

Root

- `app/` — Next.js App Router pages and route-local `_components/`
- `trpc/server/routers/` — feature routers; register each in `_app.ts`
- `db/schema/` — Drizzle schema files; export from `index.ts`
- `lib/` — shared config: `auth.ts` (Better Auth server), `auth-client.ts` (client helpers), `permissions.ts` (RBAC)
- `server/` — server-only helpers: `user.ts` (`authSession`, `authIsRequired`), `uuid.ts`
- `providers/index.tsx` — client-side TRPCReactProvider with hydration safety
- `agents/skills/patterns` - Patterns extracted from this codebase (source of truth).
- `agents/skills/playbooks` - External-library reference playbooks; verify against real code.

---

## Architecture Layers

```
UI (React Server/Client Components)
  → tRPC procedures (trpc/server/routers/)
    → Drizzle ORM (ctx.db)
      → Neon PostgreSQL
```

## Rules

- Use Server Components by default.
- Use "use client" only when required.
- Never access the database from Client Components.
- All business logic must be implemented through tRPC procedures.
- All database operations must use Drizzle ORM.
- Maintain a clear separation between UI, business logic, and data access layers.

---

## Coding Principles

- Keep Client Components focused on UI and user interactions.
- Prefer end-to-end type safety.
- Avoid duplicated business rules.
- Follow existing project patterns before introducing new abstractions.
- Authorization must always be enforced on the server.
