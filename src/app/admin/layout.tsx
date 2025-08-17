'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { BotMessageSquare, LayoutGrid, Users, BarChart, Compass, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
              <BotMessageSquare className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">PlanWise</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'}>
                  <Link href="/admin/dashboard">
                    <BarChart />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/locations')}>
                  <Link href="/admin/locations">
                    <Compass />
                    Locations
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin/editor'}>
                  <Link href="/admin/editor">
                    <LayoutGrid />
                    Map Editor
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin/bookings'} disabled>
                  <Link href="/admin/bookings">
                    <Users />
                    Bookings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/admin/profile'}>
                        <Link href="/admin/profile">
                            <UserIcon />
                            Profile
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 bg-background border-b sticky top-0">
                <SidebarTrigger />
            </div>
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
