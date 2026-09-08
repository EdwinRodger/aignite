'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Mic, Trophy, Layers, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: '/feed', label: 'Sparks', icon: Sparkles, activeColor: 'text-primary' },
    { href: '/coach', label: 'Voice Coach', icon: Mic, activeColor: 'text-chart-1' },
    { href: '/league', label: 'League', icon: Trophy, activeColor: 'text-chart-5' },
    { href: '/packs', label: 'Packs', icon: Layers, activeColor: 'text-secondary-foreground' },
    { href: '/login', label: 'Profile', icon: User, activeColor: 'text-chart-4' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border px-2 py-1 safe-area-pb">
      <nav aria-label="Mobile Navigation" className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-3 min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn('p-1 rounded-lg transition-transform', isActive && 'scale-110')}>
                <Icon className={cn('w-5 h-5', isActive ? tab.activeColor : 'text-muted-foreground')} />
              </div>
              <span className={cn('text-[11px] font-medium tracking-tight mt-0.5', isActive ? 'font-semibold text-primary' : 'text-muted-foreground')}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
