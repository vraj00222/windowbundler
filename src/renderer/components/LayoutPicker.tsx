import React from 'react';
import type { Layout, LayoutPreset } from '../lib/types';
import { LAYOUT_PRESETS, PRESET_LABELS } from '../lib/layout-presets';

interface LayoutPickerProps {
  selected: LayoutPreset;
  onChange: (layout: Layout) => void;
}

const PRESETS: LayoutPreset[] = [
  'halves-horizontal',
  'halves-vertical',
  'thirds-horizontal',
  'quadrants',
  'main-sidebar',
];

export default function LayoutPicker({ selected, onChange }: LayoutPickerProps) {
  return (
    <div>
      <label className="text-[11px] text-text-secondary uppercase tracking-[0.08em] font-semibold mb-3 block">
        Layout
      </label>
      <div className="grid grid-cols-5 gap-2.5">
        {PRESETS.map(preset => {
          const layout = LAYOUT_PRESETS[preset];
          const isSelected = selected === preset;

          return (
            <button
              key={preset}
              onClick={() => onChange(layout)}
              className={`p-2.5 rounded-xl border group relative overflow-hidden ${
                isSelected
                  ? 'border-accent/30 bg-accent/[0.05] shadow-glow'
                  : 'border-border hover:border-border-active bg-surface-1 hover:bg-surface-2'
              }`}
              style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              title={PRESET_LABELS[preset]}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-scale-in" />
              )}

              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-surface-2">
                {layout.slots.map(slot => (
                  <div
                    key={slot.id}
                    className={`absolute rounded-[3px] ${
                      isSelected
                        ? 'bg-accent/20 border border-accent/15'
                        : 'bg-white border border-border group-hover:bg-white'
                    }`}
                    style={{
                      left: `calc(${slot.x}% + 1.5px)`,
                      top: `calc(${slot.y}% + 1.5px)`,
                      width: `calc(${slot.width}% - 3px)`,
                      height: `calc(${slot.height}% - 3px)`,
                    }}
                  />
                ))}
              </div>
              <div className={`text-[10px] mt-1.5 text-center truncate ${
                isSelected ? 'text-accent font-medium' : 'text-text-tertiary'
              }`}>
                {PRESET_LABELS[preset]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
