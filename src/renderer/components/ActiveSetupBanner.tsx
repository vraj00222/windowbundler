import React, { useEffect, useState } from 'react';
import type { Setup } from '../lib/types';

interface ActiveSetupBannerProps {
  setup: Setup | null;
}

export default function ActiveSetupBanner({ setup }: ActiveSetupBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (setup) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [setup?.id]);

  if (!setup || !visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="backdrop-blur-xl rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-glass border border-border"
        style={{ background: 'rgba(28, 28, 32, 0.85)' }}>
        <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
        <span className="text-[12px] text-text-primary font-medium">{setup.icon} {setup.name}</span>
        <span className="text-[11px] text-text-tertiary">activated</span>
      </div>
    </div>
  );
}
