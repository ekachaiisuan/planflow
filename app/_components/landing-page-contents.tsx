'use client';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';

const LandingPageContent = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.count.getCount.queryOptions({
      countId: '8d0fb1b1-0e4b-47ab-b841-52951f7b5c8f',
    }),
  );
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col gap-4 justify-center items-center">
        This Landing Page No count exists.
        {data?.count ? (
          <>
            <div>{'Count: ' + data?.count}</div>
            <p>{data.id}</p>
            <p>{data.userId}</p>
          </>
        ) : (
          <p>No count found</p>
        )}
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPageContent;
