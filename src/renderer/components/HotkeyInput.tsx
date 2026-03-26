import React, { useState, useRef } from 'react';
import { useTheme } from '../lib/theme';

interface HotkeyInputProps {
  value: string | undefined;
  onChange: (hotkey: string | undefined) => void;
}

function formatHotkey(e: React.KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.metaKey) parts.push('CommandOrControl');
  if (e.ctrlKey && !e.metaKey) parts.push('CommandOrControl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  const key = e.key;
  if (['Meta', 'Control', 'Alt', 'Shift'].includes(key)) return null;
  if (parts.length === 0) return null;
  const keyMap: Record<string, string> = {
    ' ': 'Space', 'ArrowUp': 'Up', 'ArrowDown': 'Down', 'ArrowLeft': 'Left',
    'ArrowRight': 'Right', 'Escape': 'Escape', 'Enter': 'Return',
    'Backspace': 'Backspace', 'Delete': 'Delete', 'Tab': 'Tab',
  };
  parts.push(keyMap[key] || (key.length === 1 ? key.toUpperCase() : key));
  return parts.join('+');
}

function displayHotkey(hotkey: string): string {
  return hotkey.replace('CommandOrControl', '\u2318').replace('Shift', '\u21E7').replace('Alt', '\u2325').replace(/\+/g, ' ');
}

export default function HotkeyInput({ value, onChange }: HotkeyInputProps) {
  const { colors } = useTheme();
  const [capturing, setCapturing] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') { setCapturing(false); inputRef.current?.blur(); return; }
    if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      onChange(undefined); setCapturing(false); inputRef.current?.blur(); return;
    }
    const hotkey = formatHotkey(e);
    if (hotkey) { onChange(hotkey); setCapturing(false); inputRef.current?.blur(); }
  }

  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.08em] font-semibold mb-3 block" style={{ color: colors.textSecondary }}>
        Global Hotkey
      </label>
      <div className="flex items-center gap-2">
        <div
          ref={inputRef}
          tabIndex={0}
          onFocus={() => setCapturing(true)}
          onBlur={() => setCapturing(false)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer shadow-card"
          style={{
            background: capturing ? colors.accentMuted : colors.cardBg,
            border: `1px solid ${capturing ? `${colors.accent}66` : colors.border}`,
            boxShadow: capturing ? `0 0 0 2px ${colors.accent}1A` : undefined,
          }}
        >
          {capturing ? (
            <span className="animate-pulse-soft" style={{ color: colors.accent }}>Press a key combo...</span>
          ) : value ? (
            <span className="font-mono tracking-wider" style={{ color: colors.textPrimary }}>{displayHotkey(value)}</span>
          ) : (
            <span style={{ color: colors.textTertiary }}>Click to set hotkey</span>
          )}
        </div>
        {value && (
          <button
            onClick={() => onChange(undefined)}
            className="text-[11px] px-2.5 py-2 rounded-lg font-medium"
            style={{ color: colors.textTertiary }}
            onMouseEnter={(e) => { e.currentTarget.style.color = colors.danger; e.currentTarget.style.background = `${colors.danger}18`; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = colors.textTertiary; e.currentTarget.style.background = 'transparent'; }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
