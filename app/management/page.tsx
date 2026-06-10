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
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { ManagementTabs } from './_components/management-tabs';

const allowedRoles = new Set(['manager', 'admin']);

export default async function ManagementPage() {
  const session = await authIsRequired();

  if (!allowedRoles.has(session.user.role ?? '')) {
    redirect('/dashboard');
  }

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(trpc.management.department.list.queryOptions()),
    queryClient.prefetchQuery(trpc.management.position.list.queryOptions()),
    queryClient.prefetchQuery(trpc.management.prefix.list.queryOptions()),
  ]);

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
                  <BreadcrumbPage>Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ErrorBoundary
            fallback={<div>There was an error loading management data.</div>}
          >
            <Suspense fallback={<div>Loading management data...</div>}>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="rounded-xl border bg-muted/50 p-4">
                  <ManagementTabs />
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>
        </HydrationBoundary>
      </SidebarInset>
    </SidebarProvider>
  );
}
