'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Mic, Trophy, Layers, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: '/feed', label: 'Sparks', icon: Sparkles, activeColor: 'text-emerald-400' },
    { href: '/coach', label: 'Voice Coach', icon: Mic, activeColor: 'text-rose-400' },
    { href: '/league', label: 'League', icon: Trophy, activeColor: 'text-amber-400' },
    { href: '/packs', label: 'Packs', icon: Layers, activeColor: 'text-indigo-400' },
    { href: '/login', label: 'Profile', icon: User, activeColor: 'text-cyan-400' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb">
      <nav className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <div className={cn('p-1 rounded-lg transition-transform', isActive && 'scale-110')}>
                <Icon className={cn('w-5 h-5', isActive ? tab.activeColor : 'text-slate-400')} />
              </div>
              <span className={cn('text-[10px] font-medium tracking-tight mt-0.5', isActive ? 'font-semibold text-white' : 'text-slate-400')}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
