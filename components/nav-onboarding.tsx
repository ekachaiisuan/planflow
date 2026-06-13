'use client';

import * as React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarGroup } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export function NavOnboarding() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const trpc = useTRPC();
  const [isDismissed, setIsDismissed] = React.useState(false);

  const isEmailVerified = session?.user?.emailVerified === true;

  const { data: profile, isLoading: isProfileLoading } = useQuery(
    trpc.userProfile.get.queryOptions(undefined, {
      enabled: isEmailVerified,
    }),
  );

  // While session/query are loading, render null to avoid flicker
  if (isSessionPending || isProfileLoading) {
    return null;
  }

  // Show only when session exists, email is verified, and profile returned null
  if (!session || !isEmailVerified || profile !== null || isDismissed) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Card className="relative mx-2 border-sidebar-border bg-sidebar-accent/50">
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-2 top-2 h-5 w-5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss onboarding message"
        >
          <X className="h-3 w-3" />
        </Button>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold">
            Complete your profile
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Add your name, position and department to finish setting up your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button size="xs" className="w-full" asChild>
            <Link href="/profile">Go to profile</Link>
          </Button>
        </CardContent>
      </Card>
    </SidebarGroup>
  );
}
