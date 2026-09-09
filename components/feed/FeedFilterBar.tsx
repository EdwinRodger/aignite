'use client';

import React from 'react';
import { Sparkles, Brain, Cpu, Layers, Eye } from 'lucide-react';

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
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30 font-semibold scale-[1.02]'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 border-border'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
