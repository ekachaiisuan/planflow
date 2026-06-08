# tRPC Patterns

- tRPC v11 is the primary communication layer between UI and business logic.

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
