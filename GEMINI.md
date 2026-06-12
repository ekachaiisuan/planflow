# Planflow

Planflow is an internal project tracking system built with Next.js 16, TypeScript, tRPC v11, Drizzle ORM, and Better Auth.

## Project Overview

- **Purpose**: Internal project tracking, workspace management, reporting (PDF), and task tracking.
- **Architecture**: Next.js App Router (Server-first) with tRPC as the communication layer.
- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui.
- **Backend**: Next.js API Routes, tRPC v11.
- **Database**: PostgreSQL (Neon) with Drizzle ORM.
- **Authentication**: Better Auth with Role-Based Access Control (RBAC).
- **Storage**: S3-compatible (AWS S3 in Dev, MinIO in Prod).
- **Email**: Resend with React Email templates.

---

## Project Structure & Key Files

See `docs/architecture.md`

---

## Build, Test, and Development Commands

Use pnpm for package management; `pnpm-lock.yaml` is committed.

- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create a production build and run Next.js compile-time checks.
- `pnpm start`: serve the production build locally.
- `pnpm lint`: run ESLint with Next.js core web vitals and TypeScript rules.

There are no automated tests. Validate with `pnpm lint`, `pnpm build`, and manual testing.

---

## Development Conventions

### 1. Component Architecture

- **Server Components by default**: Use `"use client"` only when client-side interactivity is required.
- **Client Components**: Keep them focused on UI and user interactions. Do NOT access the database directly.

### 2. Data Fetching & Mutations

See `agents/skills/patterns/trpc-patterns/SKILL.md`

### 3. Database Rules (Drizzle)

- **Neon HTTP Constraint**: **Transactions are NOT supported.** Design operations as single-statement writes or validate thoroughly before multiple steps.
- **ID Generation**: Use the `uuid()` helper from `@/server/uuid` for primary keys.
- **Schema**: Export all schema definitions from `db/schema/index.ts`.

### 4. Authentication & Authorization

See `docs/auth.md`

### 5. Storage Design

- **Keys Only**: Store only the object keys in the database (e.g., `projects/2026/file.pdf`).
- **No Full URLs**: Never store full URLs in the database.
- **Presigned URLs**: Always use presigned URLs for uploading and downloading files.
- **S3-Compatible**: Maintain compatibility between AWS S3 (Dev) and MinIO (Prod).

### 6. Coding Style & Naming Conventions

Write TypeScript with `strict` mode. Use the `@/*` path alias for root-relative imports.

Follow existing file naming: route files use Next conventions (`page.tsx`, `layout.tsx`, `route.ts`), shared React components use kebab-case filenames, and schema modules live under `db/schema/`. Keep `components/ui/` aligned with shadcn conventions and lucide icons.

### 7. Security

Never commit secrets. Treat changes in `lib/auth.ts`, `lib/permissions.ts`, and `db/schema/auth.ts` as high-risk — validate carefully.

---

## Implementer Instructions

Role, task-execution rules, skill-management rules, workflow, and constraints: see `docs/implementer-guide.md`.
