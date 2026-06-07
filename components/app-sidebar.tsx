'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  ListTodo,
  LayoutDashboard,
  type LucideIcon,
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
import { authClient } from '@/lib/auth-client';
import { Spinner } from './ui/spinner';
import { Role } from '@/lib/permissions';

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
  navMain: [
    {
      title: 'Users',
      url: '/admin',
      icon: Bot,
    },
  ],
};

const projectsData: Record<Role, { name: string; url: string; icon: LucideIcon }[]> = {
  admin: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'All Projects',
      url: '/admin/projects',
      icon: Map,
    },
    {
      name: 'Global Reports',
      url: '/admin/reports',
      icon: PieChart,
    },
    {
      name: 'System Settings',
      url: '/admin/settings',
      icon: Settings2,
    },
  ],
  manager: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Manage Projects',
      url: '/projects/manage',
      icon: Map,
    },
    {
      name: 'Department Reports',
      url: '/reports',
      icon: PieChart,
    },
  ],
  officer: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Project Tasks',
      url: '/tasks',
      icon: ListTodo,
    },
  ],
  user: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) {
    return (
      <Sidebar {...props}>
        <div className="flex h-full items-center justify-center p-4">
          <Spinner className="size-6" />
        </div>
      </Sidebar>
    );
  }

  const user = {
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    avatar: session?.user?.image ?? '/avatars/default.jpg',
  };

  const userRole = (session?.user?.role as Role) || 'user';
  const isAdmin = userRole === 'admin';
  const userProjects = projectsData[userRole] || projectsData.user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {isAdmin && <NavMain items={data.navMain} />}
        <NavProjects projects={userProjects} label="Projects" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
