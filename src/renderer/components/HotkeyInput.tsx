import React, { useState, useRef } from 'react';

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

  if (['Meta', 'Control', 'Alt', 'Shift'].includes(key)) {
    return null;
  }

  if (parts.length === 0) return null;

  const keyMap: Record<string, string> = {
    ' ': 'Space',
    'ArrowUp': 'Up',
    'ArrowDown': 'Down',
    'ArrowLeft': 'Left',
    'ArrowRight': 'Right',
    'Escape': 'Escape',
    'Enter': 'Return',
    'Backspace': 'Backspace',
    'Delete': 'Delete',
    'Tab': 'Tab',
  };

  const mappedKey = keyMap[key] || (key.length === 1 ? key.toUpperCase() : key);
  parts.push(mappedKey);

  return parts.join('+');
}

function displayHotkey(hotkey: string): string {
  return hotkey
    .replace('CommandOrControl', '\u2318')
    .replace('Shift', '\u21E7')
    .replace('Alt', '\u2325')
    .replace(/\+/g, ' ');
}

export default function HotkeyInput({ value, onChange }: HotkeyInputProps) {
  const [capturing, setCapturing] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Escape') {
      setCapturing(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      onChange(undefined);
      setCapturing(false);
      inputRef.current?.blur();
      return;
    }

    const hotkey = formatHotkey(e);
    if (hotkey) {
      onChange(hotkey);
      setCapturing(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div>
      <label className="text-[11px] text-text-secondary uppercase tracking-[0.08em] font-semibold mb-3 block">
        Global Hotkey
      </label>
      <div className="flex items-center gap-2">
        <div
          ref={inputRef}
          tabIndex={0}
          onFocus={() => setCapturing(true)}
          onBlur={() => setCapturing(false)}
          onKeyDown={handleKeyDown}
          className={`flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer
            border shadow-card ${
            capturing
              ? 'border-accent/40 ring-2 ring-accent/10 bg-accent/[0.06]'
              : 'border-border bg-white/[0.03]'
          }`}
        >
          {capturing ? (
            <span className="text-accent animate-pulse-soft">Press a key combo...</span>
          ) : value ? (
            <span className="font-mono text-text-primary tracking-wider">{displayHotkey(value)}</span>
          ) : (
            <span className="text-text-tertiary">Click to set hotkey</span>
          )}
        </div>
        {value && (
          <button
            onClick={() => onChange(undefined)}
            className="text-[11px] text-text-tertiary hover:text-danger px-2.5 py-2 rounded-lg hover:bg-danger/10 font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
