# System Architecture

## Technology Stack

- Next.js 16 (App Router)
- TypeScript
- tRPC v11
- TanStack Query
- Drizzle ORM
- Better Auth
- Neon PostgreSQL
- shadcn/ui

---

## Project Structure
Root
- `app/`: Next.js App Router pages, layouts, and route-local components.
- `components/`: common UI, form, email, navigation, and icon components.
- `trpc/`: tRPC client and server configuration.
- `db/`: Database configuration and schema definitions.
- `lib/`: Shared utilities and configurations (auth, permissions, utils).
- `server/`: Server-only helper functions and utilities.
- `docs/`: Project documentation and planning notes.
---

## Architecture Layers

UI Layer
↓
tRPC Procedures
↓
Drizzle ORM
↓
PostgreSQL

---

## Rules

- Use Server Components by default.
- Use "use client" only when required.
- Never access the database from Client Components.
- All business logic must be implemented through tRPC procedures.
- All database operations must use Drizzle ORM.
- Maintain a clear separation between UI, business logic, and data access layers.

---

## Coding Principles

- Prefer Server Components.
- Keep Client Components focused on UI and user interactions.
- Prefer end-to-end type safety.
- Avoid duplicated business rules.
- Follow existing project patterns before introducing new abstractions.
- Authorization must always be enforced on the server.
