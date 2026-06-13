---
name: trpc-patterns
description:
  Patterns and rules for writing tRPC v11 routers, procedures, queries, mutations,
  and client-side data fetching in the PlanFlow project. Use this skill whenever
  you are creating or modifying a tRPC router, writing a procedure (baseProcedure
  or protectedProcedure), setting up server prefetching, using HydrationBoundary,
  writing useSuspenseQuery, or invalidating queries after a mutation. Also use when
  the user asks about data fetching architecture, ctx.db usage, or tRPC patterns
  in this project — even if they don't say "tRPC" explicitly.
---

# tRPC Skill — PlanFlow

tRPC v11 is the **primary communication layer** between UI and business logic.
The architecture enforces: UI → tRPC → Drizzle ORM → PostgreSQL.
Do **not** import the database directly into Client Components.

---

## 1. Router Pattern

Base your routers on `trpc/server/routers/user-profile.ts` (the canonical
reference for this project). It shows protected reads, lookup/option lists, and a
single-statement upsert with foreign-key error mapping.

```ts
import { department, prefix, position, userProfile } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/server/init';
import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import z from 'zod';

const profileSchema = z.object({
  prefixId: z.string().min(1, { message: 'Prefix is required' }),
  firstName: z.string().trim().min(1, { message: 'First name is required' }),
  lastName: z.string().trim().min(1, { message: 'Last name is required' }),
  positionId: z.string().min(1, { message: 'Position is required' }),
  departmentId: z.string().min(1, { message: 'Department is required' }),
});

export const userProfileRouter = createTRPCRouter({
  // Read the current user's own row — scope by ctx.user.id, never by input.
  get: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.userProfile.findFirst({
      where: eq(userProfile.userId, ctx.user.id),
      columns: {
        prefixId: true,
        firstName: true,
        lastName: true,
        positionId: true,
        departmentId: true,
      },
    });

    return profile ?? null;
  }),

  // Option list for a <Select> — select only the columns the client needs.
  departmentOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ id: department.id, name: department.name })
      .from(department)
      .orderBy(asc(department.name));
  }),

  // Create-or-update in ONE statement (see §2 — Neon HTTP has no transactions).
  save: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [saved] = await ctx.db
          .insert(userProfile)
          .values({ userId: ctx.user.id, ...input })
          .onConflictDoUpdate({
            target: userProfile.userId,
            set: { ...input },
          })
          .returning();

        return saved;
      } catch (error) {
        // Map known Postgres errors to clear TRPCErrors.
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23503') {
          // foreign_key_violation — a referenced row no longer exists
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Selected position or department no longer exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save profile',
        });
      }
    }),
});
```

> Use `prefixOptions` / `positionOptions` in the same file for more option-list
> examples, and `db/schema/user-profile.ts` for the matching table + relations.

### Router Rules

- Create feature routers with `createTRPCRouter({ ... })`.
- Export from `trpc/server/routers/<feature>.ts`.
- Register each router in `trpc/server/routers/_app.ts`.
- Use `baseProcedure` for public procedures only.
- Use `protectedProcedure` for authenticated mutations and user-specific reads.
- Read the current user from `ctx.user` inside `protectedProcedure`. **Scope
  user-owned reads/writes by `ctx.user.id`, never trust an id from input.**
- Access Drizzle only through `ctx.db`.
- Validate all external input with `.input(z.object(...))` — share the schema with
  the client form when possible (the form uses the same shape).
- Use `.query(...)` for reads and `.mutation(...)` for writes.
- Throw `TRPCError` for expected business errors (`UNAUTHORIZED`, `NOT_FOUND`,
  `BAD_REQUEST`, `CONFLICT`).
- Map known Postgres error codes from `error.cause.code` to meaningful errors
  (`23505` unique_violation → `CONFLICT`, `23503` foreign_key_violation →
  `BAD_REQUEST`).
- Generate IDs with `uuid()` when inserting rows that need a generated primary key.
  (`userProfile` keys on `userId`, so it doesn't.)
- For create-or-update, prefer a single `insert().onConflictDoUpdate()` (upsert)
  over read-then-write — it stays one statement (see §2).
- Return `null` from a single-row read when nothing is found, so the client can
  branch on "has data yet?".
- Keep business logic in the tRPC procedure layer, not in UI components.

---

## 2. Neon HTTP Driver Constraint ⚠️

This project uses `drizzle-orm/neon-http`. The Neon HTTP driver **does not support transactions**.

- ❌ Do NOT use `ctx.db.transaction(...)`.
- ❌ Do NOT design procedures that require multi-statement atomic writes.
- ✅ Prefer single-statement writes.
- ✅ Validate and fail early before any write when multiple steps are needed.
- If true transactional behavior becomes required, **flag it before implementing** and discuss changing the driver or restructuring the operation.

---

## 3. Query Pattern

### Server Prefetch (Server Component)

Use `await Promise.all(...)` — never `void` — to force parallel prefetching before render.

See `app/profile/page.tsx` for a live example.

```ts
const queryClient = getQueryClient();
await Promise.all([
  queryClient.prefetchQuery(trpc.userProfile.get.queryOptions()),
  queryClient.prefetchQuery(trpc.userProfile.departmentOptions.queryOptions()),
]);
```

> `void` triggers fire-and-forget. If the Server Component finishes before the fetch, the client re-fetches and shows a loading state.

### Server Hydration & Error Boundary

```tsx
<HydrationBoundary state={dehydrate(queryClient)}>
  <ErrorBoundary fallback={<div>There was an error</div>}>
    <Suspense fallback={<div>Loading...</div>}>
      <FeatureContent />
    </Suspense>
  </ErrorBoundary>
</HydrationBoundary>
```

### Client Hydration

See `app/profile/_components/profile-content-form.tsx` for a live example.

```ts
const trpc = useTRPC();
const { data: profile } = useSuspenseQuery(trpc.userProfile.get.queryOptions());
```

### Query Rules

- Prefer server prefetching.
- Always wrap prefetched data with `HydrationBoundary`.
- Use `Suspense` for loading states.
- Use `ErrorBoundary` for error handling.

---

## 4. Mutation Pattern

After a successful mutation, invalidate related queries using tRPC-generated query
keys. See `app/profile/_components/profile-content-form.tsx` for a live example.

```ts
const save = useMutation(
  trpc.userProfile.save.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.userProfile.get.queryKey(),
      });
      toast.success('Profile saved');
    },
    onError: (error) => toast.error(error.message),
  }),
);
```

### Mutation Rules

- Always invalidate related queries after successful mutations.
- Use tRPC-generated query keys — never hardcoded strings.
