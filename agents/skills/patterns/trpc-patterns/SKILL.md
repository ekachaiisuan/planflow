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

Base your routers on `trpc/server/routers/count.ts`.

```ts
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { count } from '@/db/schema';
import { uuid } from '@/server/uuid';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';

export const countRouter = createTRPCRouter({
  createCount: protectedProcedure.mutation(async ({ ctx }) => {
    const existingCount = await ctx.db.query.count.findFirst({
      where: eq(count.userId, ctx.user.id),
    });

    if (existingCount) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Count already exists for this user',
      });
    }

    await ctx.db.insert(count).values({
      id: uuid(),
      count: 1,
      userId: ctx.user.id,
    });
  }),

  getCount: baseProcedure
    .input(z.object({ countId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existingCount = await ctx.db.query.count.findFirst({
        where: eq(count.id, input.countId),
      });

      return (
        existingCount ?? { count: undefined, id: undefined, userId: undefined }
      );
    }),
});
```

### Router Rules

- Create feature routers with `createTRPCRouter({ ... })`.
- Export from `trpc/server/routers/<feature>.ts`.
- Register each router in `trpc/server/routers/_app.ts`.
- Use `baseProcedure` for public procedures only.
- Use `protectedProcedure` for authenticated mutations and user-specific reads.
- Read the current user from `ctx.user` inside `protectedProcedure`.
- Access Drizzle only through `ctx.db`.
- Validate all external input with `.input(z.object(...))`.
- Use `.query(...)` for reads and `.mutation(...)` for writes.
- Throw `TRPCError` for expected business errors (`UNAUTHORIZED`, `NOT_FOUND`, `CONFLICT`).
- Generate IDs with `uuid()` when inserting rows.
- Check record existence before updating or deleting when the user should get a clear error.
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

```ts
const queryClient = getQueryClient();
await Promise.all([
  queryClient.prefetchQuery(trpc.project.list.queryOptions()),
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

```ts
const { data } = useSuspenseQuery(trpc.project.list.queryOptions());
```

### Query Rules

- Prefer server prefetching.
- Always wrap prefetched data with `HydrationBoundary`.
- Use `Suspense` for loading states.
- Use `ErrorBoundary` for error handling.

---

## 4. Mutation Pattern

After a successful mutation, invalidate related queries using tRPC-generated query keys.

```ts
queryClient.invalidateQueries({
  queryKey: trpc.project.list.queryKey(),
});
```

### Mutation Rules

- Always invalidate related queries after successful mutations.
- Use tRPC-generated query keys — never hardcoded strings.
