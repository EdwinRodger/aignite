'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
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
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOutAction, getCurrentStudentProfileAction } from '@/app/actions/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isProtected?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Core Workflow',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, isProtected: true },
      { label: 'Daily AI Sparks', href: '/feed', icon: Sparkles, isProtected: false },
      { label: 'Voice Coach', href: '/coach', icon: Mic },
    ],
  },
  {
    title: 'AI Learning Suite',
    items: [
      { label: 'Company Packs', href: '/packs', icon: Boxes },
      { label: 'Architecture Sandbox', href: '/sandbox', icon: Cpu, isProtected: true },
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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [studentProfile, setStudentProfile] = useState<{
    fullName: string;
    leagueTier: string;
  } | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load from database / session action
    getCurrentStudentProfileAction()
      .then((profile) => {
        if (!isMounted) return;
        if (profile) {
          setIsLoggedIn(true);
          setStudentProfile({
            fullName: profile.fullName || 'Student Learner',
            leagueTier: profile.leagueTier || 'AI Engineer',
          });
        } else {
          // Check if local student session exists
          if (typeof window !== 'undefined') {
            const storedSession = localStorage.getItem('aignite_student_session');
            if (storedSession) {
              setIsLoggedIn(true);
              const stored = localStorage.getItem('aignite_user_profile');
              if (stored) {
                try {
                  const parsed = JSON.parse(stored);
                  setStudentProfile({
                    fullName: parsed.fullName || parsed.name || 'Student Learner',
                    leagueTier: parsed.leagueTier || 'AI Engineer',
                  });
                } catch {
                  setStudentProfile({ fullName: 'Student Learner', leagueTier: 'AI Engineer' });
                }
              } else {
                setStudentProfile({ fullName: 'Student Learner', leagueTier: 'AI Engineer' });
              }
            } else {
              setIsLoggedIn(false);
              setStudentProfile(null);
            }
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (typeof window !== 'undefined') {
          const storedSession = localStorage.getItem('aignite_student_session');
          setIsLoggedIn(Boolean(storedSession));
        } else {
          setIsLoggedIn(false);
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
    setIsLoggedIn(false);
    setStudentProfile(null);
    router.push('/login');
    router.refresh();
  };

  const userInitials =
    studentProfile?.fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AI';

  const homeHref = isLoggedIn ? '/dashboard' : '/';
  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => (isLoggedIn ? true : !item.isProtected)),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 w-full h-14 bg-background/95 backdrop-blur-md border-b border-border px-4 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <Image
              src="/logo-icon.png"
              alt="AIgnite Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
              priority
            />
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
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-[width,transform] duration-200 ease-in-out',
          collapsed ? 'w-18' : 'w-64',
          'max-md:w-72 max-md:shadow-2xl',
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0">
          <Link
            href={homeHref}
            onClick={() => setMobileOpen(false)}
            className={cn('flex items-center gap-2.5 transition-opacity', collapsed ? 'justify-center w-full' : '')}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <Image
                src="/logo-icon.png"
                alt="AIgnite Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                priority
              />
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
          {visibleSections.map((section) => (
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

        {/* Bottom Student Profile Card & Sign Out / Sign In CTA */}
        <div className="p-3 border-t border-border bg-muted/20 shrink-0 space-y-2">
          {isLoggedIn && studentProfile ? (
            <>
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
            </>
          ) : (
            <div>
              {!collapsed ? (
                <div className="p-3 rounded-2xl border border-primary/25 bg-primary/5 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Student Account</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Sign in to track streaks, earn XP, and unlock your personal dashboard.
                  </p>
                  <Button asChild size="sm" className="w-full font-bold text-sm shadow-xs gap-1.5">
                    <Link href="/login">
                      <span>Sign In / Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline" size="sm" className="w-full p-0 h-9 justify-center" title="Sign In">
                  <Link href="/login">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
