'use client';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const PageContent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.count.getCount.queryOptions({
      countId: '8d0fb1b1-0e4b-47ab-b841-52951f7b5c8f',
    }),
  );

  const createCount = useMutation(
    trpc.count.createCount.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.count.getCount.queryKey(),
        });
      },
      onError: () =>
        toast('Error!', {
          closeButton: true,
          description: "Couldn't create count",
        }),
    }),
  );

  const deleteCount = useMutation(
    trpc.count.deleteCount.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.count.getCount.queryKey(),
        });
      },
      onError: () =>
        toast('Error!', {
          closeButton: true,
          description: "Couldn't delete count",
        }),
    }),
  );

  const updateCount = useMutation(
    trpc.count.updateCount.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.count.getCount.queryKey(),
        });
      },
      onError: () =>
        toast('Error!', {
          closeButton: true,
          description: "Couldn't update count",
        }),
    }),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
        {data?.count ? (
          <>
            <div>{'Count: ' + data?.count}</div>
            <div className="flex flex-row gap-x-2">
              <Button
                onClick={() => updateCount.mutate({ isIncreasing: true })}
              >
                Increment
              </Button>
              <Button
                onClick={() => updateCount.mutate({ isIncreasing: false })}
              >
                Decrement
              </Button>
              <Button onClick={() => deleteCount.mutate()}>Delete</Button>
            </div>
          </>
        ) : (
          <Button onClick={() => createCount.mutate()}>Create Count</Button>
        )}
      </div>
    </div>
  );
};

export default PageContent;
