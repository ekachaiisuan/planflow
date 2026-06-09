# tRPC Patterns

- tRPC v11 is the primary communication layer between UI and business logic.

## Router Pattern

Use `trpc/server/routers/count.ts` as the baseline style for server routers.

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
- Export routers from `trpc/server/routers/<feature>.ts`.
- Register each feature router in `trpc/server/routers/_app.ts`.
- Use `baseProcedure` only for public procedures.
- Use `protectedProcedure` for user-specific data and any authenticated mutation.
- Read the current user from `ctx.user` inside `protectedProcedure`.
- Access Drizzle only through `ctx.db`; do not import the database directly into Client Components.
- Validate all external input with `.input(z.object(...))`.
- Use `.query(...)` for reads and `.mutation(...)` for writes.
- Throw `TRPCError` for expected business errors such as `UNAUTHORIZED`, `NOT_FOUND`, and `CONFLICT`.
- Generate IDs with existing server helpers such as `uuid()` when inserting rows.
- Check whether a record exists before updating or deleting when the user should get a clear error.
- Keep business logic in the tRPC procedure or server layer, not in UI components.

### Neon HTTP Driver Constraint

This project uses Drizzle with `drizzle-orm/neon-http` in `db/drizzle.ts`.
The Neon HTTP driver does not support database transactions.

- Do not use `ctx.db.transaction(...)`.
- Do not design procedures that require multi-statement atomic writes.
- Prefer single-statement writes when possible.
- When a procedure needs multiple steps, validate and fail early before writing.
- If true transactional behavior becomes required, flag it before implementation and discuss changing the database driver or restructuring the operation.

## Query Pattern

- Server Prefetch

```ts
const queryClient = getQueryClient();
void queryClient.prefetchQuery(trpc.project.list.queryOptions());
```

- Server Hydration & Error Boundary

```tsx
<HydrationBoundary state={dehydrate(queryClient)}>
  <ErrorBoundary fallback={<div>There was an error</div>}>
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  </ErrorBoundary>
</HydrationBoundary>
```

## Client Hydration

```ts
const { data } = useSuspenseQuery(trpc.project.list.queryOptions());
```

## Rules

- Prefer server prefetching.
- Use HydrationBoundary for prefetched data.
- Use Suspense for loading states.
- Use ErrorBoundary for error handling.

---

## Mutation Pattern

```ts
queryClient.invalidateQueries({
  queryKey: trpc.project.list.queryKey(),
});
```

## Rules

- Invalidate related queries after successful mutations.
- Use tRPC-generated query keys.
- Avoid hardcoded query keys.

---
