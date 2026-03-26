import React, { useState, useEffect } from 'react';
import { ipc } from '../lib/ipc';
import type { WindowInfo, AppAssignment, LayoutSlot } from '../lib/types';

interface WindowSelectorProps {
  slots: LayoutSlot[];
  assignments: AppAssignment[];
  onChange: (assignments: AppAssignment[]) => void;
}

interface WindowOption {
  pid: number;
  appName: string;
  windowTitle: string;
  windowId: number;
  bundleId?: string;
  label: string;
}

export default function WindowSelector({ slots, assignments, onChange }: WindowSelectorProps) {
  const [windowOptions, setWindowOptions] = useState<WindowOption[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchWindows() {
    setLoading(true);
    try {
      const [windows, apps] = await Promise.all([ipc.getWindows(), ipc.getApps()]);

      // Build a map of bundleId by pid from apps
      const bundleMap = new Map<number, string>();
      for (const app of apps) {
        if (app.bundleId) bundleMap.set(app.pid, app.bundleId);
      }

      // Group windows by app, showing title for disambiguation
      const appWindowCounts = new Map<string, number>();
      for (const w of windows) {
        appWindowCounts.set(w.appName, (appWindowCounts.get(w.appName) || 0) + 1);
      }

      const options: WindowOption[] = windows.map(w => {
        const count = appWindowCounts.get(w.appName) || 1;
        const title = w.windowTitle || 'Untitled';
        // If an app has multiple windows, show the window title to distinguish
        const label = count > 1
          ? `${w.appName} — ${title.length > 40 ? title.slice(0, 40) + '...' : title}`
          : w.appName;

        return {
          pid: w.pid,
          appName: w.appName,
          windowTitle: w.windowTitle,
          windowId: w.windowId,
          bundleId: bundleMap.get(w.pid),
          label,
        };
      });

      setWindowOptions(options);
    } catch (err) {
      console.error('Failed to fetch windows:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchWindows();
  }, []);

  function assignWindow(slotId: string, option: WindowOption | null) {
    const filtered = assignments.filter(a => a.slotId !== slotId);
    if (option) {
      filtered.push({
        slotId,
        appName: option.appName,
        bundleId: option.bundleId,
        windowTitle: option.windowTitle,
        windowId: option.windowId,
        pid: option.pid,
      });
    }
    onChange(filtered);
  }

  function getAssigned(slotId: string): AppAssignment | undefined {
    return assignments.find(a => a.slotId === slotId);
  }

  function getAssignedLabel(slotId: string): string {
    const a = getAssigned(slotId);
    if (!a) return '';
    // Build a unique key matching window options
    if (a.windowId) {
      const opt = windowOptions.find(o => o.windowId === a.windowId);
      if (opt) return opt.label;
    }
    return a.appName;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-[11px] text-text-secondary uppercase tracking-[0.08em] font-semibold">
          Window Assignments
        </label>
        <button
          onClick={fetchWindows}
          className="text-[11px] text-accent/70 hover:text-accent flex items-center gap-1 font-medium"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse-soft">Refreshing...</span>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="opacity-60">
                <path d="M13.65 2.35a8 8 0 1 0 1.77 5.15.5.5 0 0 0-1 .06A7 7 0 1 1 13 3.29V5.5a.5.5 0 0 0 1 0V2a.5.5 0 0 0-.5-.5H10a.5.5 0 0 0 0 1h2.15l1.5.85Z"/>
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {slots.map((slot, i) => {
          const assigned = getAssigned(slot.id);
          const assignedLabel = getAssignedLabel(slot.id);
          return (
            <div
              key={slot.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border group animate-slide-up shadow-card"
              style={{
                animationDelay: `${i * 40}ms`,
                background: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono uppercase flex-shrink-0 ${
                assigned ? 'bg-accent/15 text-accent border border-accent/20' : 'bg-white/[0.05] text-text-tertiary border border-border'
              }`}>
                {slot.id.split('-').map(w => w[0]).join('')}
              </div>

              <div className="text-[12px] text-text-secondary w-[70px] flex-shrink-0 capitalize font-medium">
                {slot.id.replace(/-/g, ' ')}
              </div>

              <select
                value={assigned ? (assigned.windowId ? String(assigned.windowId) : assigned.appName) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    assignWindow(slot.id, null);
                  } else {
                    // Find by windowId first (numeric), then by label
                    const opt = windowOptions.find(o => String(o.windowId) === val)
                      || windowOptions.find(o => o.label === val);
                    if (opt) assignWindow(slot.id, opt);
                  }
                }}
                className="flex-1 border border-border rounded-lg px-2.5 py-2 text-[13px]
                  text-text-primary outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10
                  appearance-none cursor-pointer shadow-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  paddingRight: '28px',
                }}
              >
                <option value="">{'\u2014'} None {'\u2014'}</option>
                {windowOptions.map(opt => (
                  <option key={`${opt.windowId}`} value={String(opt.windowId)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-8 rounded-xl border border-border animate-fade-in"
          style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
          <div className="text-2xl opacity-20 mb-2">{'\uD83D\uDDBC\uFE0F'}</div>
          <p className="text-text-tertiary text-[12px]">
            Select a layout to assign windows to slots
          </p>
        </div>
      )}
    </div>
  );
}
