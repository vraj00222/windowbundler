import React from 'react';
import type { Setup } from '../lib/types';

interface SidebarProps {
  setups: Setup[];
  selectedId: string | null;
  activeSetupId: string | null;
  onSelect: (id: string) => void;
  onActivate: (id: string) => void;
  onNew: () => void;
}

export default function Sidebar({ setups, selectedId, activeSetupId, onSelect, onActivate, onNew }: SidebarProps) {
  return (
    <aside className="w-[260px] flex-shrink-0 glass-panel flex flex-col" style={{ borderRight: '0.5px solid rgba(255,255,255,0.06)' }} data-no-drag>
      {/* Header / drag region */}
      <div
        className="h-[52px] flex items-center px-5 border-b border-border"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className="text-[13px] font-semibold text-text-secondary tracking-wide pl-16 uppercase">
          Setups
        </span>
      </div>

      {/* Setup list */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-0.5">
        {setups.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-3xl opacity-30 mb-3">{'\uD83D\uDCE6'}</div>
            <p className="text-text-tertiary text-[12px]">
              No setups yet
            </p>
            <p className="text-text-tertiary text-[11px] mt-0.5">
              Click below to create one
            </p>
          </div>
        )}
        {setups.map((setup, i) => {
          const isSelected = selectedId === setup.id;
          const isActive = activeSetupId === setup.id;

          return (
            <button
              key={setup.id}
              onClick={() => onSelect(setup.id)}
              onDoubleClick={() => onActivate(setup.id)}
              className={`w-full text-left px-3 py-2.5 rounded-[10px] flex items-center gap-3 group relative animate-slide-in ${
                isSelected
                  ? 'bg-white/[0.08] shadow-glass-sm'
                  : 'hover:bg-white/[0.04]'
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-accent animate-glow-pulse" />
              )}

              <span className="text-lg flex-shrink-0">{setup.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-medium truncate ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {setup.name}
                </div>
                {setup.hotkey && (
                  <div className="text-[10px] text-text-tertiary font-mono mt-0.5 tracking-wide">
                    {setup.hotkey.replace('CommandOrControl', '\u2318').replace('Shift', '\u21E7').replace('Alt', '\u2325').replace(/\+/g, '')}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActivate(setup.id);
                }}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-md flex items-center justify-center
                  bg-accent/10 hover:bg-accent/20 text-accent text-[10px]"
                title="Activate"
              >
                {'\u25B6'}
              </button>
            </button>
          );
        })}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onNew}
          className="w-full py-2.5 rounded-[10px] btn-glass text-[13px] font-medium
            flex items-center justify-center gap-1.5 hover:bg-white/[0.08]"
        >
          <span className="text-accent text-base leading-none">+</span>
          <span>New Setup</span>
        </button>
      </div>
    </aside>
  );
}
