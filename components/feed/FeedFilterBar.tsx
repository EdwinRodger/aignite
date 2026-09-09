'use client';

import React from 'react';
import { Sparkles, Brain, Cpu, Layers, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedFilterBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All Sparks', icon: Sparkles },
  { id: 'GenAI & LLMs', label: 'GenAI & LLMs', icon: Layers },
  { id: 'Inference & Infra', label: 'Inference & Infra', icon: Cpu },
  { id: 'Agents & RL', label: 'Agents & RL', icon: Brain },
  { id: 'Vision & Multimodal', label: 'Vision & Multi', icon: Eye },
];

export function FeedFilterBar({ activeCategory, onSelectCategory }: FeedFilterBarProps) {
  return (
    <nav
      aria-label="Feed Categories"
      className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 mb-4"
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <Button
            key={cat.id}
            type="button"
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(cat.id)}
            className="rounded-full text-sm font-semibold shrink-0 gap-1.5"
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{cat.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
