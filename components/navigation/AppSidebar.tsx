'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Flame,
  LayoutDashboard,
  Sparkles,
  Mic,
  Boxes,
  Cpu,
  Route,
  Trophy,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CircleDot,
  Bug,
  Scale,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOutAction, getCurrentStudentProfileAction } from '@/app/actions/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Workflow',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Daily AI Sparks', href: '/feed', icon: Sparkles },
      { label: 'Voice Coach', href: '/coach', icon: Mic },
    ],
  },
  {
    title: 'AI Learning Suite',
    items: [
      { label: 'Company Packs', href: '/packs', icon: Boxes },
      { label: 'Architecture Sandbox', href: '/sandbox', icon: Cpu },
      { label: 'Career Roadmap', href: '/roadmap', icon: Route },
    ],
  },
  {
    title: 'Interactive Games',
    items: [
      { label: 'Pipeline Bubble', href: '/games/pipeline-bubble', icon: CircleDot },
      { label: 'Error Code Hunter', href: '/games/error-hunter', icon: Bug },
      { label: 'Decision Simulator', href: '/games/decision-simulator', icon: Scale },
      { label: 'Micro-Quiz', href: '/games/micro-quiz', icon: HelpCircle },
    ],
  },
  {
    title: 'Career & League',
    items: [
      { label: 'Competitive League', href: '/league', icon: Trophy },
      { label: 'Resume ATS Radar', href: '/resume-analyzer', icon: FileText },
    ],
  },
];

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return React.useContext(SidebarContext);
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarCtx = useSidebar();
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [localMobileOpen, setLocalMobileOpen] = useState(false);

  const collapsed = sidebarCtx ? sidebarCtx.collapsed : localCollapsed;
  const setCollapsed = sidebarCtx ? sidebarCtx.setCollapsed : setLocalCollapsed;
  const mobileOpen = sidebarCtx ? sidebarCtx.mobileOpen : localMobileOpen;
  const setMobileOpen = sidebarCtx ? sidebarCtx.setMobileOpen : setLocalMobileOpen;

  const [studentProfile, setStudentProfile] = useState<{
    fullName: string;
    leagueTier: string;
  }>({
    fullName: 'Student Learner',
    leagueTier: 'AI Engineer',
  });
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load from database / session action
    getCurrentStudentProfileAction()
      .then((profile) => {
        if (isMounted && profile) {
          setStudentProfile({
            fullName: profile.fullName || 'Student Learner',
            leagueTier: profile.leagueTier || 'AI Engineer',
          });
        }
      })
      .catch(() => {
        // Fallback to local profile if offline
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('aignite_user_profile');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.fullName || parsed.name) {
                setStudentProfile({
                  fullName: parsed.fullName || parsed.name,
                  leagueTier: parsed.leagueTier || 'AI Engineer',
                });
              }
            } catch {
              // ignore
            }
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutAction();
    } catch (err) {
      console.warn('Sign out failed:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = 'sb_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'aignite_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/login');
    router.refresh();
  };

  const userInitials =
    studentProfile.fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AI';

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 w-full h-14 bg-background/95 backdrop-blur-md border-b border-border px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Flame className="w-4.5 h-4.5" />
          </div>
          <span className="text-base font-black tracking-tight text-foreground font-mono">
            <span className="text-primary underline decoration-primary/50 decoration-2 underline-offset-4">A</span>
            Ignite
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          className="h-9 w-9 p-0"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-200 ease-in-out',
          collapsed ? 'w-18' : 'w-64',
          'max-md:w-72 max-md:shadow-2xl',
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={cn('flex items-center gap-2.5 transition-opacity', collapsed ? 'justify-center w-full' : '')}
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="text-lg font-black tracking-tight text-foreground font-mono">
                <span className="text-primary underline decoration-primary/50 decoration-2 underline-offset-4">A</span>
                Ignite
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="hidden md:flex h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Collapsed Expand Trigger (Desktop) */}
        {collapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Navigation Link Groups */}
        <nav
          aria-label="Application Navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group',
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4.5 h-4.5 shrink-0 transition-colors',
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Student Profile Card & Sign Out */}
        <div className="p-3 border-t border-border bg-muted/20 shrink-0 space-y-2">
          <div
            className={cn(
              'p-2 rounded-lg border border-border bg-card flex items-center gap-2.5',
              collapsed && 'justify-center p-1.5 border-transparent bg-transparent'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0 font-mono">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground truncate">
                  {studentProfile.fullName}
                </div>
                <div className="text-sm text-muted-foreground truncate font-mono">
                  {studentProfile.leagueTier}
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer',
                collapsed && 'justify-center px-0'
              )}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
