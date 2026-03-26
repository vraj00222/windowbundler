import React, { useEffect, useState } from 'react';
import type { Setup } from '../lib/types';
import { useTheme } from '../lib/theme';

interface ActiveSetupBannerProps {
  setup: Setup | null;
}

export default function ActiveSetupBanner({ setup }: ActiveSetupBannerProps) {
  const { colors } = useTheme();
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
      <div
        className="backdrop-blur-xl rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-glass"
        style={{ background: colors.bannerBg, border: `1px solid ${colors.border}` }}
      >
        <div className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: colors.success }} />
        <span className="text-[12px] font-medium" style={{ color: colors.textPrimary }}>{setup.icon} {setup.name}</span>
        <span className="text-[11px]" style={{ color: colors.textTertiary }}>activated</span>
      </div>
    </div>
  );
}
