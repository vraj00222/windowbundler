import React from 'react';
import type { Layout, LayoutPreset } from '../lib/types';
import { LAYOUT_PRESETS, PRESET_LABELS } from '../lib/layout-presets';
import { useTheme } from '../lib/theme';

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
  const { colors } = useTheme();

  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.08em] font-semibold mb-3 block" style={{ color: colors.textSecondary }}>
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
              className="p-2.5 rounded-xl group relative overflow-hidden"
              style={{
                border: `1px solid ${isSelected ? `${colors.accent}4D` : colors.border}`,
                background: isSelected ? colors.accentMuted : colors.cardBg,
                boxShadow: isSelected ? `0 0 24px ${colors.accent}33` : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              title={PRESET_LABELS[preset]}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-scale-in" style={{ background: colors.accent }} />
              )}
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden" style={{ background: colors.cardBg }}>
                {layout.slots.map(slot => (
                  <div
                    key={slot.id}
                    className="absolute rounded-[3px]"
                    style={{
                      left: `calc(${slot.x}% + 1.5px)`,
                      top: `calc(${slot.y}% + 1.5px)`,
                      width: `calc(${slot.width}% - 3px)`,
                      height: `calc(${slot.height}% - 3px)`,
                      background: isSelected ? colors.slotActiveBg : colors.slotBg,
                      border: `1px solid ${isSelected ? colors.slotActiveBorder : colors.slotBorder}`,
                    }}
                  />
                ))}
              </div>
              <div className="text-[10px] mt-1.5 text-center truncate" style={{
                color: isSelected ? colors.accent : colors.textTertiary,
                fontWeight: isSelected ? 500 : 400,
              }}>
                {PRESET_LABELS[preset]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
