import React from 'react';
import type { Setup } from '../lib/types';

interface SidebarProps {
  setups: Setup[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onActivate: (id: string) => void;
  onNew: () => void;
}

export default function Sidebar({ setups, selectedId, onSelect, onActivate, onNew }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-surface-1 flex flex-col" data-no-drag>
      {/* Header with drag region */}
      <div className="h-14 flex items-center px-4 border-b border-border" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <span className="text-sm font-semibold text-text-primary pl-16">WindowBundler</span>
      </div>

      {/* Setup list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {setups.length === 0 && (
          <p className="text-text-tertiary text-xs text-center py-8">
            No setups yet. Create one!
          </p>
        )}
        {setups.map(setup => (
          <button
            key={setup.id}
            onClick={() => onSelect(setup.id)}
            onDoubleClick={() => onActivate(setup.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 group ${
              selectedId === setup.id
                ? 'bg-accent/15 text-text-primary'
                : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
            }`}
          >
            <span className="text-lg">{setup.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{setup.name}</div>
              {setup.hotkey && (
                <div className="text-[10px] text-text-tertiary font-mono mt-0.5">
                  {setup.hotkey.replace('CommandOrControl', 'Cmd')}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActivate(setup.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent/20 text-accent text-xs"
              title="Activate"
            >
              ▶
            </button>
          </button>
        ))}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onNew}
          className="w-full py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent text-sm font-medium"
        >
          + New Setup
        </button>
      </div>
    </aside>
  );
}
