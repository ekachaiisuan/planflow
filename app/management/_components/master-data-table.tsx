'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTRPC } from '@/trpc/client';
import { formatDate } from '@/server/util';

import { MasterDataForm } from './master-data-form';

type MasterDataEntity = 'department' | 'position' | 'prefix';

type MasterDataItem = {
  id: string;
  name: string;
  createdAt: Date;
};

type MasterDataTableProps = {
  entity: MasterDataEntity;
  title: string;
  description: string;
  singularLabel: string;
};

export function MasterDataTable({
  entity,
  title,
  description,
  singularLabel,
}: MasterDataTableProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const api = useMemo(
    () =>
      ({
        department: trpc.management.department,
        position: trpc.management.position,
        prefix: trpc.management.prefix,
      })[entity],
    [entity, trpc],
  );

  const { data: items } = useSuspenseQuery(api.list.queryOptions());
  const [activeItem, setActiveItem] = useState<MasterDataItem | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const createMutation = useMutation(
    api.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: api.list.queryKey(),
        });
        toast.success(`${singularLabel} created`);
      },
    }),
  );

  const updateMutation = useMutation(
    api.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: api.list.queryKey(),
        });
        toast.success(`${singularLabel} updated`);
      },
    }),
  );

  const deleteMutation = useMutation(
    api.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: api.list.queryKey(),
        });
        toast.success(`${singularLabel} deleted`);
      },
    }),
  );

  const isEditing = activeItem != null;

  function handleCreateClick() {
    setActiveItem(null);
    setIsFormVisible(true);
  }

  function handleEditClick(item: MasterDataItem) {
    setActiveItem(item);
    setIsFormVisible(true);
  }

  function handleCancel() {
    setIsFormVisible(false);
    setActiveItem(null);
  }

  async function handleDelete(item: MasterDataItem) {
    try {
      await deleteMutation.mutateAsync({
        id: item.id,
      });
    } catch (error) {
      toast.error(
        (error as { message?: string })?.message ??
          `Failed to delete ${singularLabel.toLowerCase()}`,
      );
    }
  }

  async function handleSubmit(name: string) {
    if (activeItem) {
      await updateMutation.mutateAsync({
        id: activeItem.id,
        name,
      });
      handleCancel();
      return;
    }

    await createMutation.mutateAsync({
      name,
    });
    handleCancel();
  }

  return (
    <div className="space-y-4">
      <Dialog
        open={isFormVisible}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Edit ${singularLabel}` : `Create ${singularLabel}`}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Update the ${singularLabel.toLowerCase()} name and save the changes.`
                : `Add a new ${singularLabel.toLowerCase()} to the master data list.`}
            </DialogDescription>
          </DialogHeader>

          <MasterDataForm
            submitLabel={isEditing ? 'Update' : 'Create'}
            defaultName={activeItem?.name ?? ''}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Add {singularLabel}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-muted-foreground"
                >
                  No {title.toLowerCase()} yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEditClick(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="ghost" size="icon-sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete {singularLabel}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {item.name}? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
