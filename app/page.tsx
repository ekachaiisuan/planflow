import { authSession } from '@/server/user';
import { redirect } from 'next/navigation';
import LandingPageContent from './_components/landing-page-contents';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

const LandingPage = async () => {
  const session = await authSession();
  if (session) redirect('/dashboard');
  // เรียกใช้ getQueryClient() เพื่อให้แน่ใจว่า Query Client ถูกสร้างขึ้นก่อนที่ LandingPageContent จะถูกเรนเดอร์
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.count.getCount.queryOptions({ countId: '' }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>There was an error</div>}>
        <Suspense fallback={<div>Loading...</div>} >
          <LandingPageContent />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};
export default LandingPage;
