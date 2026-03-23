import React from 'react';
import type { Setup } from '../lib/types';

interface ActiveSetupBannerProps {
  setup: Setup | null;
}

export default function ActiveSetupBanner({ setup }: ActiveSetupBannerProps) {
  if (!setup) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm flex items-center gap-2 shadow-glow">
      <span className="text-sm">{setup.icon}</span>
      <span className="text-xs text-accent font-medium">{setup.name} active</span>
    </div>
  );
}
