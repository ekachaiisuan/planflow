'use client';
import { FormInput } from '@/components/forms/form-input';
import { FormSubmit } from '@/components/forms/form-submit';
import { Form, FormField } from '@/components/ui/form';
import { formatFormErrors } from '@/lib/form-utils';
import { useTRPC } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name must not be empty' }),
});

type FormSchema = z.infer<typeof formSchema>;

export const DepartmentCreateForm = () => {
  const form = useForm<FormSchema>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  const formattedErrors = formatFormErrors(form.formState.errors);
  const trpc = useTRPC();
  const createDepartment = useMutation(
    trpc.department.createDepartment.mutationOptions({
      onError: (error) => {
        if (error.data?.code === 'CONFLICT') {
          form.setError('name', { message: 'Department name already exists' });
          return;
        }
      },

      onSuccess: () => {
        toast('Department created successfully');
      },
    }),
  );
  const onSubmit = (values: FormSchema) =>
    createDepartment.mutate({
      ...values,
    });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormInput
              {...field}
              id="name"
              label="Department Name"
              errors={formattedErrors}
            />
          )}
        />
        <FormSubmit>Create New</FormSubmit>
      </form>
    </Form>
  );
};
