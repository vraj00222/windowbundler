import React, { useState, useEffect } from 'react';
import { ipc } from '../lib/ipc';
import { useTheme } from '../lib/theme';
import type { AppInfo, AppAssignment, LayoutSlot } from '../lib/types';

interface WindowSelectorProps {
  slots: LayoutSlot[];
  assignments: AppAssignment[];
  onChange: (assignments: AppAssignment[]) => void;
}

export default function WindowSelector({ slots, assignments, onChange }: WindowSelectorProps) {
  const { colors } = useTheme();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchApps() {
    setLoading(true);
    try {
      const data = await ipc.getApps();
      data.sort((a, b) => a.name.localeCompare(b.name));
      setApps(data);
    } catch (err) {
      console.error('Failed to fetch apps:', err);
    }
    setLoading(false);
  }

  useEffect(() => { fetchApps(); }, []);

  function assignApp(slotId: string, app: AppInfo | null) {
    const filtered = assignments.filter(a => a.slotId !== slotId);
    if (app) {
      filtered.push({ slotId, appName: app.name, bundleId: app.bundleId || undefined });
    }
    onChange(filtered);
  }

  function getAssignedApp(slotId: string): AppAssignment | undefined {
    return assignments.find(a => a.slotId === slotId);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-[11px] uppercase tracking-[0.08em] font-semibold" style={{ color: colors.textSecondary }}>
          Window Assignments
        </label>
        <button
          onClick={fetchApps}
          className="text-[11px] flex items-center gap-1 font-medium"
          style={{ color: `${colors.accent}B3` }}
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
              className="flex items-center gap-3 p-3 rounded-xl group animate-slide-up shadow-card"
              style={{
                animationDelay: `${i * 40}ms`,
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono uppercase flex-shrink-0"
                style={{
                  background: assigned ? colors.accentMuted : colors.cardBg,
                  color: assigned ? colors.accent : colors.textTertiary,
                  border: `1px solid ${assigned ? `${colors.accent}33` : colors.border}`,
                }}
              >
                {slot.id.split('-').map(w => w[0]).join('')}
              </div>

              <div className="text-[12px] w-[70px] flex-shrink-0 capitalize font-medium" style={{ color: colors.textSecondary }}>
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
                className="flex-1 rounded-lg px-2.5 py-2 text-[13px] outline-none appearance-none cursor-pointer shadow-card"
                style={{
                  background: colors.inputBg,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='${encodeURIComponent(colors.selectArrowColor)}' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
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
        <div className="text-center py-8 rounded-xl animate-fade-in"
          style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div className="text-2xl opacity-20 mb-2">{'\uD83D\uDDBC\uFE0F'}</div>
          <p className="text-[12px]" style={{ color: colors.textTertiary }}>
            Select a layout to assign windows to slots
          </p>
        </div>
      )}
    </div>
  );
}
