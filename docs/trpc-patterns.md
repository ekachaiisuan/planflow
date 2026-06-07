# tRPC Patterns

## tRPC v11 is the primary communication layer between UI and business logic.

## Query Pattern

## Server Prefetch

const queryClient = getQueryClient();

void queryClient.prefetchQuery(
trpc.project.list.queryOptions(),
);

## Server Hydration & Error Boundary

<HydrationBoundary state={dehydrate(queryClient)}>
    <ErrorBoundary fallback={<div>There was an error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <LandingPageContent />
        </Suspense>
    </ErrorBoundary>
</HydrationBoundary>

## Client Hydration

const { data } = useSuspenseQuery(
trpc.project.list.queryOptions(),
);

## Rules

- Prefer server prefetching.
- Use HydrationBoundary for prefetched data.
- Use Suspense for loading states.
- Use ErrorBoundary for error handling.

---

## Mutation Pattern

queryClient.invalidateQueries({
queryKey: trpc.project.list.queryKey(),
});

## Rules

- Invalidate related queries after successful mutations.
- Use tRPC-generated query keys.
- Avoid hardcoded query keys.

---

## Business Logic

Location:
`trpc/server/routers/`

## Responsibilities:

- Validation
- Authorization
- Business rules
- Workflow execution

Examples:

- Create project
- Approve project
- Calculate project progress

Client Components should never contain business logic.
