'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Bot,
  Command,
  CircuitBoard,
  GalleryVerticalEnd,
  type LucideIcon,
  Settings2,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Spinner } from './ui/spinner';
import { NavOnboarding } from '@/components/nav-onboarding';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: CircuitBoard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [hasAdminPermission, setHasAdminPermission] = useState(false);
  const { data: session, isPending: loading } = authClient.useSession();
  const role = session?.user?.role;

  useEffect(() => {
    if (!session) return;

    authClient.admin
      .hasPermission({
        permission: { user: ['list'] },
      })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, [session]);

  if (loading) {
    return (
      <div>
        <Spinner className="size-4" />
      </div>
    );
  }

  const user = {
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    avatar: session?.user?.image ?? '/avatars/default.jpg',
  };

  const hasManagementAccess = role === 'manager' || role === 'admin';
  const canShowAdminUsers = Boolean(session) && hasAdminPermission;
  const navMainItems = [
    canShowAdminUsers
      ? {
          title: 'Users',
          url: '/admin',
          icon: Bot,
        }
      : null,
    hasManagementAccess
      ? {
          title: 'Management',
          url: '/management',
          icon: Settings2,
        }
      : null,
  ].filter(Boolean) as {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navMainItems.length > 0 && <NavMain items={navMainItems} />}
        <NavOnboarding />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
