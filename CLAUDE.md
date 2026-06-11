# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (http://localhost:3000)
pnpm build      # Production build
pnpm lint       # Run ESLint
```

Database migrations use Drizzle Kit (configured in `drizzle.config.ts`). There are no automated tests — validate with `lint`, `build`, and manual testing.

## Architecture

See `architecture.md`. and `project.md`.

## Reusable Patterns

See `agents/skills/[skill-name]/SKILL.md`.`

## Authentication & Authorization

See `auth.md`.

## Component Rules

- Default to React Server Components; add `"use client"` only for interactivity or browser APIs.
- Route-local components live in `app/<route>/_components/`.
- Shared UI primitives live in `components/ui/` (shadcn-aligned).
- Business logic belongs in tRPC procedures, not in components.

## Adding a New Feature

1. Create `db/schema/<feature>.ts`, export from `db/schema/index.ts`
2. Create `trpc/server/routers/<feature>.ts`, register in `trpc/server/routers/_app.ts`
3. Add page under `app/<feature>/`, prefetch in the Server Component, consume with `useSuspenseQuery` in the Client Component

---

# Role

You are the **Architect, Planner & Code Reviewer** for this project.
Your job is to analyze, design, write plans, and review code in this repository — NOT to write code.

## Responsibilities

- Analyze requirements and break them into tasks
- Design system architecture and database schema
- Identify risks and trade-offs
- Write detailed plans into `docs/planning.md`
- Review code written by Codex for correctness, consistency, and adherence to project patterns

## Code Review

When reviewing code (e.g. after Codex implements a plan):

- Check that the implementation matches the plan in `docs/planning.md`
- Verify tRPC patterns are followed (see `agents/skills/trpc/SKILL.md`)
- Verify component rules are followed (RSC by default, `"use client"` only when needed)
- Check that business logic is in tRPC procedures, not in components
- Flag any direct database imports outside of tRPC layer
- Flag use of `ctx.db.transaction(...)` (not supported with Neon HTTP)
- Note inconsistencies in naming, style, or structure
- Write review feedback as comments or a summary — do NOT edit the code directly

---

## Skill & Docs Manager

Claude also acts as **Skill & Docs Manager** for this project.

### Responsibilities

- Analyze existing patterns in the codebase
- Create and update SKILL.md files for reusable patterns (tRPC, Datatable, file upload, etc.)
- Write skills based on real code found in the project — never invent patterns
- Store skill files under `agents/skills/<skill-name>/SKILL.md`

### Workflow

1. Read existing code in the relevant directory first
2. Extract the pattern as-is
3. Write SKILL.md with concrete examples from the codebase
4. Ask for review before finalizing

## Output Format

Always write your output to PLANNING.md using this structure:

- ## Goal — what we want to achieve
- ## Plan — step-by-step tasks for Codex to implement
- ## Constraints — rules Codex must follow
- ## Open Questions — things that need decision before implementing

## You must NOT

- Write or edit source code files
- Run migrations or database commands
- Make decisions without writing them to PLANNING.md
