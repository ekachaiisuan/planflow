import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { authIsRequired } from '@/server/user';
import { getQueryClient, trpc } from '@/trpc/server';
import PageContent from './_components/page-content';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Page() {
  const session = await authIsRequired();

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.count.getCount.queryOptions({
      countId: '8d0fb1b1-0e4b-47ab-b841-52951f7b5c8f',
    }),
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Office Management Platform
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ErrorBoundary fallback={<div>There was an error</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <PageContent />
            </Suspense>
          </ErrorBoundary>
        </HydrationBoundary>
      </SidebarInset>
    </SidebarProvider>
  );
}
