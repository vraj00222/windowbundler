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
      <label className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-2 block">
        Layout
      </label>
      <div className="grid grid-cols-5 gap-2">
        {PRESETS.map(preset => {
          const layout = LAYOUT_PRESETS[preset];
          const isSelected = selected === preset;

          return (
            <button
              key={preset}
              onClick={() => onChange(layout)}
              className={`p-2 rounded-lg border transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-glow'
                  : 'border-border hover:border-border-active bg-surface-2'
              }`}
              title={PRESET_LABELS[preset]}
            >
              <div className="relative w-full aspect-video rounded overflow-hidden bg-surface-0">
                {layout.slots.map(slot => (
                  <div
                    key={slot.id}
                    className={`absolute rounded-sm ${isSelected ? 'bg-accent/40' : 'bg-surface-3'}`}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: `calc(${slot.width}% - 2px)`,
                      height: `calc(${slot.height}% - 2px)`,
                      margin: '1px',
                    }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-text-tertiary mt-1 text-center truncate">
                {PRESET_LABELS[preset]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
