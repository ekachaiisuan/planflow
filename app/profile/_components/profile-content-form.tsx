'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormErrors } from '@/components/forms/form-errors';
import { FormInput } from '@/components/forms/form-input';
import { FormSubmit } from '@/components/forms/form-submit';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatFormErrors } from '@/lib/form-utils';
import { useTRPC } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
  prefixId: z.string().min(1, { message: 'Prefix is required' }),
  firstName: z.string().trim().min(1, { message: 'First name is required' }),
  lastName: z.string().trim().min(1, { message: 'Last name is required' }),
  positionId: z.string().min(1, { message: 'Position is required' }),
  departmentId: z.string().min(1, { message: 'Department is required' }),
});

type FormSchema = z.infer<typeof formSchema>;

const emptyValues: FormSchema = {
  prefixId: '',
  firstName: '',
  lastName: '',
  positionId: '',
  departmentId: '',
};

export default function ProfileContentForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: profile } = useSuspenseQuery(trpc.userProfile.get.queryOptions());
  const { data: positions } = useSuspenseQuery(
    trpc.userProfile.positionOptions.queryOptions(),
  );
  const { data: departments } = useSuspenseQuery(
    trpc.userProfile.departmentOptions.queryOptions(),
  );
  const { data: prefixes } = useSuspenseQuery(
    trpc.userProfile.prefixOptions.queryOptions(),
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: profile
      ? {
        prefixId: profile.prefixId ?? '',
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        positionId: profile.positionId ?? '',
        departmentId: profile.departmentId ?? '',
      }
      : emptyValues,
  });

  useEffect(() => {
    form.reset(
      profile
        ? {
          prefixId: profile.prefixId ?? '',
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          positionId: profile.positionId ?? '',
          departmentId: profile.departmentId ?? '',
        }
        : emptyValues,
    );
  }, [profile, form]);

  const formattedErrors = formatFormErrors(form.formState.errors);
  const hasProfile = profile != null;

  const saveMutation = useMutation(
    trpc.userProfile.save.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userProfile.get.queryKey(),
        });
        toast.success('Profile saved');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to save profile');
      },
    }),
  );

  function onSubmit(values: FormSchema) {
    saveMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your name, position and department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="user-profile-form"
            className="max-w-md space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="prefixId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-neutral-700 text-sm">
                      Prefix
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="prefixId" className="w-full">
                        <SelectValue placeholder="Select prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefixes.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormErrors id="prefixId" errors={formattedErrors} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormInput
                    {...field}
                    id="firstName"
                    label="Name"
                    placeholder="Enter name"
                    errors={formattedErrors}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormInput
                    {...field}
                    id="lastName"
                    label="Last name"
                    placeholder="Enter last name"
                    errors={formattedErrors}
                  />
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="positionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-neutral-700 text-sm">
                    Position
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="positionId" className="w-full">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormErrors id="positionId" errors={formattedErrors} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-neutral-700 text-sm">
                    Department
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="departmentId" className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormErrors id="departmentId" errors={formattedErrors} />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <FormSubmit className="w-auto" disabled={saveMutation.isPending}>
                {hasProfile ? 'Save changes' : 'Create profile'}
              </FormSubmit>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
