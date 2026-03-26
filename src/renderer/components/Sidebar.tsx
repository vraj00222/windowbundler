import React from 'react';
import type { Setup } from '../lib/types';
import { useTheme, THEME_LABELS, type ThemeId } from '../lib/theme';

interface SidebarProps {
  setups: Setup[];
  selectedId: string | null;
  activeSetupId: string | null;
  onSelect: (id: string) => void;
  onActivate: (id: string) => void;
  onNew: () => void;
}

const THEME_OPTIONS: ThemeId[] = ['light', 'dark', 'glass'];

export default function Sidebar({ setups, selectedId, activeSetupId, onSelect, onActivate, onNew }: SidebarProps) {
  const { theme, colors, setTheme } = useTheme();

  return (
    <aside
      className="w-[260px] flex-shrink-0 flex flex-col"
      style={{
        background: colors.sidebarBg,
        borderRight: `0.5px solid ${colors.border}`,
      }}
      data-no-drag
    >
      {/* Header / drag region */}
      <div
        className="h-[52px] flex items-center justify-between px-5"
        style={{ WebkitAppRegion: 'drag', borderBottom: `0.5px solid ${colors.border}` } as React.CSSProperties}
      >
        <span className="text-[13px] font-semibold tracking-wide pl-16 uppercase" style={{ color: colors.textTertiary }}>
          Setups
        </span>
      </div>

      {/* Setup list */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-0.5">
        {setups.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-3xl opacity-20 mb-3">{'\uD83D\uDCE6'}</div>
            <p className="text-[12px]" style={{ color: colors.textTertiary }}>No setups yet</p>
            <p className="text-[11px] mt-0.5 opacity-60" style={{ color: colors.textTertiary }}>Click below to create one</p>
          </div>
        )}

        {/* Default setup pinned at top */}
        {setups.filter(s => s.isDefault).map(setup => {
          const isSelected = selectedId === setup.id;
          const isActive = activeSetupId === setup.id;
          return (
            <button
              key={setup.id}
              onClick={() => onSelect(setup.id)}
              onDoubleClick={() => onActivate(setup.id)}
              className="w-full text-left px-3 py-2.5 rounded-[10px] flex items-center gap-3 group relative mb-1"
              style={{ background: isSelected ? colors.accentMuted : 'transparent' }}
            >
              {isActive && (
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full animate-glow-pulse" style={{ background: colors.accent }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate" style={{ color: isSelected ? colors.accent : colors.textPrimary }}>
                  {setup.name}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: colors.textTertiary }}>Default</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onActivate(setup.id); }}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-md flex items-center justify-center text-[10px]"
                style={{ background: colors.accentMuted, color: colors.accent }}
                title="Activate"
              >{'\u25B6'}</button>
            </button>
          );
        })}

        {setups.some(s => s.isDefault) && setups.filter(s => !s.isDefault).length > 0 && (
          <div className="h-px mx-2 my-1.5" style={{ background: colors.border }} />
        )}

        {/* User setups */}
        {setups.filter(s => !s.isDefault).map((setup, i) => {
          const isSelected = selectedId === setup.id;
          const isActive = activeSetupId === setup.id;
          return (
            <button
              key={setup.id}
              onClick={() => onSelect(setup.id)}
              onDoubleClick={() => onActivate(setup.id)}
              className="w-full text-left px-3 py-2.5 rounded-[10px] flex items-center gap-3 group relative animate-slide-in"
              style={{
                background: isSelected ? colors.accentMuted : 'transparent',
                animationDelay: `${i * 30}ms`,
              }}
            >
              {isActive && (
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full animate-glow-pulse" style={{ background: colors.accent }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate" style={{ color: isSelected ? colors.accent : colors.textPrimary }}>
                  {setup.name}
                </div>
                {setup.hotkey && (
                  <div className="text-[10px] font-mono mt-0.5 tracking-wide" style={{ color: colors.textTertiary }}>
                    {setup.hotkey.replace('CommandOrControl', '\u2318').replace('Shift', '\u21E7').replace('Alt', '\u2325').replace(/\+/g, '')}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onActivate(setup.id); }}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-md flex items-center justify-center text-[10px]"
                style={{ background: colors.accentMuted, color: colors.accent }}
                title="Activate"
              >{'\u25B6'}</button>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 space-y-2.5" style={{ borderTop: `0.5px solid ${colors.border}` }}>
        {/* Theme segmented control */}
        <div
          className="flex rounded-lg p-0.5"
          style={{ background: colors.cardBg, border: `0.5px solid ${colors.border}` }}
        >
          {THEME_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="flex-1 py-1.5 rounded-md text-[11px] font-medium text-center"
              style={{
                background: theme === t ? colors.accent : 'transparent',
                color: theme === t ? '#fff' : colors.textTertiary,
                transition: 'all 0.15s ease',
              }}
            >
              {THEME_LABELS[t]}
            </button>
          ))}
        </div>

        {/* New Setup button */}
        <button
          onClick={onNew}
          className="w-full py-2.5 rounded-[10px] btn-glass text-[13px] font-medium flex items-center justify-center gap-1.5"
        >
          <span style={{ color: colors.accent }} className="text-base leading-none">+</span>
          <span>New Setup</span>
        </button>
      </div>
    </aside>
  );
}
