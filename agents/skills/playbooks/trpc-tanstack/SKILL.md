---
name: trpc-tanstack
description:
  Reference for the @trpc/tanstack-react-query integration (the new proxy/options
  API) used in PlanFlow. Use this whenever you write client data fetching with
  useTRPC(), queryOptions/mutationOptions/queryKey, optimistic updates
  (onMutate/onError/onSettled), or infinite queries with tRPC. Read this BEFORE
  copying any tRPC + React Query snippet from the web — most blog/training-data
  examples use the OLD createTRPCReact API which does NOT exist in this project.
---

# tRPC × TanStack React Query — PlanFlow Playbook

> ⚠️ **Reference playbook, not source of truth.** Always verify against the real
> code before trusting anything here — for project CRUD conventions defer to
> `agents/skills/patterns/trpc-patterns/SKILL.md` (that pattern skill wins on conflict).
>
> Official docs: https://trpc.io/docs/client/tanstack-react-query/setup

**Versions in this project** (`package.json`): `@trpc/tanstack-react-query`,
`@trpc/client`, `@trpc/server` all `^11.17`, `@tanstack/react-query ^5.101`.

---

## 1. Which API this project uses — pin this, don't drift ❌→✅

PlanFlow uses the **proxy / options** integration, NOT the classic
`createTRPCReact` hooks. The two look similar but are different APIs. Most
examples online use the OLD one — translate them before use.

Setup that defines the API (already wired, don't recreate):

- Client: `createTRPCContext<AppRouter>()` → exports `useTRPC` — `trpc/client/index.tsx`
- Server: `createTRPCOptionsProxy({ ctx, router, queryClient })` → `trpc` — `trpc/server/index.ts`

### Old ❌ vs New ✅

| Task | OLD `createTRPCReact` ❌ (not in this repo) | NEW proxy API ✅ (use this) |
|---|---|---|
| Get the client | `import { trpc } from ...` then `trpc.x.useQuery()` | `const trpc = useTRPC()` (hook, inside component) |
| Query | `trpc.user.get.useQuery(input)` | `useQuery(trpc.user.get.queryOptions(input))` |
| Suspense query | `trpc.user.get.useSuspenseQuery(input)` | `useSuspenseQuery(trpc.user.get.queryOptions(input))` |
| Mutation | `trpc.user.save.useMutation({...})` | `useMutation(trpc.user.save.mutationOptions({...}))` |
| Invalidate | `utils.user.get.invalidate()` | `queryClient.invalidateQueries({ queryKey: trpc.user.get.queryKey() })` |
| Read/set cache | `utils.user.get.setData(...)` | `queryClient.setQueryData(trpc.user.get.queryKey(), ...)` |
| Infinite query | `trpc.feed.list.useInfiniteQuery(...)` | `useInfiniteQuery(trpc.feed.list.infiniteQueryOptions(...))` |

**Rule of thumb:** there is no `trpc.x.useQuery()` / `useMutation()` method in this
project. tRPC only builds the *options object*; the hook comes from
`@tanstack/react-query`. `useTRPC()` is a hook → call it in the component body, not
at module top level.

### Canonical client shape (from `app/profile/_components/profile-content-form.tsx`)

```tsx
'use client';
const trpc = useTRPC();
const queryClient = useQueryClient();

const { data } = useSuspenseQuery(trpc.userProfile.get.queryOptions());

const save = useMutation(
  trpc.userProfile.save.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.userProfile.get.queryKey() });
      toast.success('Saved');
    },
    onError: (error) => toast.error(error.message),
  }),
);
```

Server prefetch + hydrate (from `app/profile/page.tsx` / `trpc/server/index.ts`):
use `getQueryClient()` + `trpc.x.queryOptions()` inside `Promise.all`, wrap the
client subtree in `HydrationBoundary` → `ErrorBoundary` → `Suspense`. See the
pattern skill §3 for the full rule.

---

## 2. Patterns not yet in the codebase — verify before using

These are NOT used anywhere in PlanFlow yet, so there is no in-repo example to copy.
Treat the snippets below as a starting point and **verify the exact key/option
shape against the live `useTRPC()` proxy** when you first introduce them.

### 2a. Optimistic update (onMutate / onError / onSettled rollback)

Use when you want the UI to reflect a mutation instantly and roll back on error.
The key is built from the tRPC proxy so it always matches the query you read with.

```tsx
const trpc = useTRPC();
const queryClient = useQueryClient();
const key = trpc.userProfile.get.queryKey();

const save = useMutation(
  trpc.userProfile.save.mutationOptions({
    // 1. fires before the request
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: key }); // stop in-flight refetch
      const previous = queryClient.getQueryData(key);     // snapshot for rollback
      queryClient.setQueryData(key, (old) => ({ ...old, ...newValue })); // optimistic write
      return { previous };                                // passed to onError/onSettled as context
    },
    // 2. on failure → restore snapshot
    onError: (_err, _newValue, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      toast.error('Failed, reverted');
    },
    // 3. always re-sync with server (success OR error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  }),
);
```

Notes / gotchas:
- `setQueryData` value is the **deserialized** shape (superjson runs at the
  transport boundary, see `trpc/client/query-client.ts`) — write plain JS objects.
- Always `cancelQueries` first, otherwise an in-flight refetch can overwrite your
  optimistic value.
- Keep `onSettled` invalidation even with optimistic writes — it reconciles drift.

### 2b. Infinite query

Requires the procedure to accept a cursor input and return a `nextCursor`.

```tsx
const trpc = useTRPC();
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  trpc.feed.list.infiniteQueryOptions(
    { limit: 20 },                          // input (without the cursor field)
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  ),
);
const items = data?.pages.flatMap((p) => p.items) ?? [];
```

Server side the procedure must declare a `cursor` in its input and return
`{ items, nextCursor }`. There is no such procedure in this repo yet — design it
following the pattern skill (single-statement reads, Neon HTTP = no transactions).

---

## 3. Reference links

- Setup: https://trpc.io/docs/client/tanstack-react-query/setup
- Server components / prefetch: https://trpc.io/docs/client/tanstack-react-query/server-components
- Usage (queryOptions/mutationOptions/queryKey): https://trpc.io/docs/client/tanstack-react-query/usage
- TanStack optimistic updates: https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates
- TanStack infinite queries: https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries
