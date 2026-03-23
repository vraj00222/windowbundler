import React, { useState, useEffect } from 'react';
import { ipc } from '../lib/ipc';
import type { AppInfo, AppAssignment, LayoutSlot } from '../lib/types';

interface WindowSelectorProps {
  slots: LayoutSlot[];
  assignments: AppAssignment[];
  onChange: (assignments: AppAssignment[]) => void;
}

export default function WindowSelector({ slots, assignments, onChange }: WindowSelectorProps) {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchApps() {
    setLoading(true);
    try {
      const data = await ipc.getApps();
      setApps(data);
    } catch (err) {
      console.error('Failed to fetch apps:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchApps();
  }, []);

  function assignApp(slotId: string, app: AppInfo | null) {
    const filtered = assignments.filter(a => a.slotId !== slotId);
    if (app) {
      filtered.push({
        slotId,
        appName: app.name,
        bundleId: app.bundleId || undefined,
      });
    }
    onChange(filtered);
  }

  function getAssignedApp(slotId: string): AppAssignment | undefined {
    return assignments.find(a => a.slotId === slotId);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-[11px] text-text-secondary uppercase tracking-[0.08em] font-semibold">
          App Assignments
        </label>
        <button
          onClick={fetchApps}
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
          const assigned = getAssignedApp(slot.id);
          return (
            <div
              key={slot.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-1 border border-border group animate-slide-up shadow-card"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono uppercase flex-shrink-0 ${
                assigned ? 'bg-accent/10 text-accent border border-accent/15' : 'bg-surface-2 text-text-tertiary border border-border'
              }`}>
                {slot.id.split('-').map(w => w[0]).join('')}
              </div>

              <div className="text-[12px] text-text-secondary w-[70px] flex-shrink-0 capitalize font-medium">
                {slot.id.replace(/-/g, ' ')}
              </div>

              <select
                value={assigned?.appName || ''}
                onChange={(e) => {
                  const appName = e.target.value;
                  if (!appName) {
                    assignApp(slot.id, null);
                  } else {
                    const app = apps.find(a => a.name === appName);
                    if (app) assignApp(slot.id, app);
                  }
                }}
                className="flex-1 bg-white border border-border rounded-lg px-2.5 py-2 text-[13px]
                  text-text-primary outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10
                  appearance-none cursor-pointer shadow-card"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(0,0,0,0.25)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  paddingRight: '28px',
                }}
              >
                <option value="">{'\u2014'} None {'\u2014'}</option>
                {apps.map(app => (
                  <option key={`${app.pid}-${app.name}`} value={app.name}>
                    {app.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-8 bg-surface-1 rounded-xl border border-border animate-fade-in">
          <div className="text-2xl opacity-30 mb-2">{'\uD83D\uDDBC\uFE0F'}</div>
          <p className="text-text-tertiary text-[12px]">
            Select a layout to assign apps to slots
          </p>
        </div>
      )}
    </div>
  );
}
