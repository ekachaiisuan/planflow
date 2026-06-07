# Planflow Project Instructions

This project is a comprehensive project tracking system designed for internal organizational use. It features workspace management, project monitoring, report generation, and multi-role authentication.

## Project Overview

- **Core Technologies:** Next.js 16 (App Router), React 19, TypeScript.
- **API & Business Logic:** tRPC (v11) for type-safe server-client communication.
- **Database & ORM:** Drizzle ORM with PostgreSQL (Neon serverless).
- **Authentication:** [Better Auth](https://www.better-auth.com/) with support for:
  - 2FA (Two-Factor Authentication).
  - RBAC (Role-Based Access Control) with roles: `admin`, `manager`, `officer`, `user`.
  - Social Auth (GitHub).
  - Email Verification & Password Reset via Resend.
- **Styling:** Tailwind CSS 4 with shadcn/ui components.

## Building and Running

Use `pnpm` as the package manager.

- **Development:** `pnpm dev` - Starts the Next.js development server.
- **Build:** `pnpm build` - Creates the production build (essential for verifying types and framework rules).
- **Start:** `pnpm start` - Serves the production build.
- **Lint:** `pnpm lint` - Runs ESLint with Next.js and TypeScript configurations.
- **Database:**
  - `pnpm drizzle-kit generate` - Generate migrations from schema.
  - `pnpm drizzle-kit push` - Push schema changes directly to the database.
  - `pnpm drizzle-kit studio` - Open Drizzle Studio for data management.

## Development Conventions

### General Architecture Principles
- **Server Components:** Default to Server Components. Use `"use client"` only for interactivity.
- **Business Logic:** Implement ALL business logic within tRPC procedures (`trpc/server/routers/`).
- **Data Access:** Use Drizzle ORM for all database operations. Never access the database directly from Client Components.
- **Type Safety:** Maintain strict type safety across the application using TypeScript and Zod.
- **Code Style:**
  - 2-space indentation.
  - Functional components with PascalCase naming.
  - CamelCase for helper functions and variables.
  - Semicolons are used throughout the project.

### Project Structure
- `app/`: Next.js App Router pages, layouts, and route-local components.
- `trpc/`: tRPC client and server configuration.
  - `trpc/server/routers/`: All API business logic resides here.
- `db/`: Database configuration and schema definitions.
  - `db/schema/`: Individual schema files (e.g., `auth.ts`, `count.ts`).
- `components/`: Shared React components.
  - `components/ui/`: shadcn-style UI primitives.
  - `components/forms/`: Reusable form components using `react-hook-form`.
- `lib/`: Shared utilities and configurations (auth, permissions, utils).
- `server/`: Server-only helper functions and utilities.
- `docs/`: Project documentation and planning notes.

### Authentication & Permissions
- Permissions are defined in `lib/permissions.ts`.
- Auth configuration is in `lib/auth.ts` and uses `auth-schema.ts`.
- Always check for appropriate roles and permissions in tRPC procedures and Server Components.

## Testing Guidelines
Currently, there is no configured test framework. When adding tests:
- Place them near the code they cover (e.g., `*.test.ts` or `*.test.tsx`).
- Use `pnpm test` as the entry point (add it to `package.json`).
- Ensure all changes are validated with `pnpm lint` and `pnpm build` before committing.
