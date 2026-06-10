'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormSubmit } from '@/components/forms/form-submit';
import { formatFormErrors } from '@/lib/form-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
});

type FormSchema = z.infer<typeof formSchema>;

type MasterDataFormProps = {
  submitLabel: string;
  defaultName?: string;
  onCancel: () => void;
  onSubmit: (name: string) => Promise<void>;
};

const isConflictError = (error: unknown) => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const typedError = error as {
    data?: { code?: string; httpStatus?: number };
    message?: string;
  };
  const message = typedError.message?.toLowerCase() ?? '';

  return (
    typedError.data?.code === 'CONFLICT' ||
    typedError.data?.httpStatus === 409 ||
    message.includes('conflict') ||
    message.includes('already exists')
  );
};

export function MasterDataForm({
  submitLabel,
  defaultName,
  onCancel,
  onSubmit,
}: MasterDataFormProps) {
  const form = useForm<FormSchema>({
    defaultValues: {
      name: defaultName ?? '',
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      name: defaultName ?? '',
    });
  }, [defaultName, form]);

  const formattedErrors = formatFormErrors(form.formState.errors);

  async function handleSubmit(values: FormSchema) {
    try {
      await onSubmit(values.name);
      form.reset({
        name: '',
      });
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? 'Failed to save item';

      if (isConflictError(error)) {
        form.setError('name', {
          message: message === 'Failed to save item' ? 'Name already exists' : message,
        });
        return;
      }

      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormInput
              {...field}
              id="name"
              label="Name"
              errors={formattedErrors}
              placeholder="Enter name"
            />
          )}
        />
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <FormSubmit className="w-auto" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </FormSubmit>
        </div>
      </form>
    </Form>
  );
}
