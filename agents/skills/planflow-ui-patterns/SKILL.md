---
name: planflow-ui-patterns
description: Build or modify Planflow UI that should match this repository's profile page, form handling, action button, and notification patterns. Use when working in the Planflow Next.js app on profile/account settings pages, auth-style forms, Better Auth client actions, react-hook-form plus zod validation, shadcn Field components, or sonner toast feedback.
---

# Planflow UI Patterns

## First steps

Read the nearest existing files before editing:

- Profile/settings page shell: `app/profile/page.tsx`
- Profile-local components: `app/profile/_components/`
- Auth forms: `components/forms/`
- Field primitives: `components/ui/field.tsx`
- Toast setup: `components/ui/sonner.tsx` and `app/layout.tsx`
- Action wrappers: `components/ui/action-button.tsx` and `components/better-auth-action.tsx`

Keep changes scoped to the requested feature. Prefer Server Components by default, and add `"use client"` only for form interactivity, Better Auth client calls, router refresh/navigation, local state, or browser-only APIs.

## Profile Page Pattern

Use `app/profile/page.tsx` as the layout model for account/profile settings:

- Keep the route page as an async Server Component.
- Guard access with `authSession()` and `redirect("/login")` when no session exists.
- Use Better Auth server APIs with `headers()` for server-side account/session data.
- Compute simple booleans and derived lists on the server, such as `hasPasswordAccount` and `nonCredentialAccounts`.
- Render the standard sidebar shell with `SidebarProvider`, `AppSidebar`, `SidebarInset`, header breadcrumb, `SidebarTrigger`, and `Separator`.
- Put route-local UI under `app/profile/_components/`.
- Wrap settings sections in `bg-muted/50 flex-1 rounded-xl md:min-h-min` containers when matching the current profile page style.
- Use `Card`, `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent` for individual settings forms or empty states.

Do not access the database from Client Components. For new business logic, route it through tRPC procedures or existing server/auth helpers.

## Form Pattern

For interactive forms, follow `ChangePasswordForm`, `TwoFactorAuth`, and `components/forms/*`:

- Start the file with `"use client"`.
- Define a local zod schema near the top of the file.
- Type values with `z.infer<typeof schema>` unless a named type improves readability.
- Initialize `useForm` with `zodResolver(schema)` and explicit `defaultValues`.
- Use `Controller` for each field.
- Wrap inputs in `Field` and pass `data-invalid={fieldState.invalid}`.
- Pair labels and inputs with matching `htmlFor` and `id`.
- Pass `aria-invalid={fieldState.invalid}` to inputs.
- Render validation with `fieldState.invalid && <FieldError errors={[fieldState.error]} />`.
- Group controls with `FieldGroup`; use `className="max-w-sm"` for compact profile forms.
- Use repo primitives: `Input`, `PasswordInput`, `Checkbox`, `Button`, `Spinner`, and other `components/ui/*`.
- Disable submit buttons with `form.formState.isSubmitting`.
- Show the spinner inside the submit button while loading or submitting.

Use this basic shape:

```tsx
const formSchema = z.object({
  value: z.string().min(1),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    value: "",
  },
})

async function onSubmit(value: z.infer<typeof formSchema>) {
  // call authClient or a tRPC mutation here
}

return (
  <form id="feature-form" onSubmit={form.handleSubmit(onSubmit)}>
    <FieldGroup className="max-w-sm">
      <Controller
        name="value"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="value">Value</FieldLabel>
            <Input {...field} id="value" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field>
        <Button type="submit" form="feature-form" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner className="size-4" />}
          Save
        </Button>
      </Field>
    </FieldGroup>
  </form>
)
```

## Notification Pattern

Use `sonner` directly in client components:

- Import `toast` from `sonner`.
- Use `toast.success("...")` after successful user-visible changes.
- Use `toast.error(error.message || "...")` or the Better Auth equivalent fallback on failure.
- Keep the global `<Toaster position="top-left" />` in `app/layout.tsx`; do not mount extra toasters in feature components.
- Preserve the custom icon/theme wrapper in `components/ui/sonner.tsx`.

For Better Auth callback-style APIs, match the existing shape:

```tsx
await authClient.someAction(value, {
  onError: error => {
    toast.error(error.error.message || "Action failed")
  },
  onSuccess: () => {
    toast.success("Action completed")
    form.reset()
  },
})
```

For Better Auth APIs returning `{ data, error }`, check both branches:

```tsx
const { data, error } = await authClient.someAction(value)
if (error) {
  toast.error(error.message || "Action failed")
}
if (data) {
  toast.success("Action completed")
  router.refresh()
}
```

## Action Button Pattern

For simple one-click actions that do not need a full form:

- Prefer `BetterAuthActionButton` when the action returns Better Auth's `{ error }` shape.
- Prefer `ActionButton` when the action can return `{ error: boolean; message?: string }`.
- Let these wrappers manage loading state and toast messages.
- Use `successMessage` for successful Better Auth actions.
- Call `router.refresh()` in the action success callback when server-rendered data should update.
- Use `variant="destructive"` for revoke, unlink, delete, disable, and similarly risky actions.
- Use lucide icons inside icon/action buttons when available.

## Refresh And Navigation

Use `useRouter` from `next/navigation` in client components only:

- Use `router.refresh()` after actions that change data shown by a Server Component.
- Use `router.push(...)` after auth flows that should move the user to another route.
- Reset forms with `form.reset()` after successful updates when the fields should clear.
- Keep local state only for immediate UI transitions such as email-sent screens, 2FA setup steps, or status badges.

## Validation Checklist

Before finishing a Planflow UI change:

- Run `pnpm lint` when files were changed.
- Run `pnpm build` for broader route/auth/profile changes when feasible.
- Manually check affected routes in `pnpm dev` for profile, auth, form validation, loading state, success toast, and error toast behavior.
- Avoid unrelated refactors, restyling, and new dependencies.
