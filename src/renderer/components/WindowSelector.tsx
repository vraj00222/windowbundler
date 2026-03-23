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
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-text-secondary uppercase tracking-wider font-medium">
          App Assignments
        </label>
        <button
          onClick={fetchApps}
          className="text-[10px] text-accent hover:text-accent-hover"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Apps'}
        </button>
      </div>

      <div className="space-y-2">
        {slots.map(slot => {
          const assigned = getAssignedApp(slot.id);
          return (
            <div
              key={slot.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2 border border-border"
            >
              {/* Slot indicator */}
              <div className="w-8 h-8 rounded bg-accent/15 flex items-center justify-center text-[10px] text-accent font-mono uppercase flex-shrink-0">
                {slot.id.split('-').map(w => w[0]).join('')}
              </div>

              {/* Slot name */}
              <div className="text-xs text-text-secondary w-20 flex-shrink-0 capitalize">
                {slot.id.replace('-', ' ')}
              </div>

              {/* App dropdown */}
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
                className="flex-1 bg-surface-1 border border-border rounded px-2 py-1.5 text-sm text-text-primary outline-none focus:border-accent"
              >
                <option value="">— None —</option>
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
        <p className="text-text-tertiary text-xs text-center py-4">
          Select a layout first to assign apps to slots.
        </p>
      )}
    </div>
  );
}
