'use client';

import React from 'react';
import { SidebarProvider, useSidebar, AppSidebar } from '@/components/navigation/AppSidebar';
import { cn } from '@/lib/utils';

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const sidebarCtx = useSidebar();
  const collapsed = sidebarCtx ? sidebarCtx.collapsed : false;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppSidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-[padding] duration-200 ease-in-out',
          collapsed ? 'md:pl-18' : 'md:pl-64'
        )}
      >
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StudentLayoutInner>{children}</StudentLayoutInner>
    </SidebarProvider>
  );
}
