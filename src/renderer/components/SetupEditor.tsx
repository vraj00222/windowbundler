import React, { useState, useEffect } from 'react';
import type { Setup, Layout } from '../lib/types';
import { useTheme } from '../lib/theme';
import LayoutPicker from './LayoutPicker';
import WindowSelector from './WindowSelector';
import HotkeyInput from './HotkeyInput';

interface SetupEditorProps {
  setup: Setup;
  onSave: (setup: Setup) => void;
  onDelete: () => void;
  onActivate: () => void;
}

export default function SetupEditor({ setup, onSave, onDelete, onActivate }: SetupEditorProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(setup.name);
  const [layout, setLayout] = useState<Layout>(setup.layout);
  const [assignments, setAssignments] = useState(setup.assignments);
  const [hotkey, setHotkey] = useState(setup.hotkey);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setName(setup.name);
    setLayout(setup.layout);
    setAssignments(setup.assignments);
    setHotkey(setup.hotkey);
    setShowDeleteConfirm(false);
  }, [setup.id]);

  function handleLayoutChange(newLayout: Layout) {
    setLayout(newLayout);
    const validSlotIds = new Set(newLayout.slots.map(s => s.id));
    setAssignments(prev => prev.filter(a => validSlotIds.has(a.slotId)));
  }

  function handleSave() {
    onSave({
      ...setup,
      name,
      layout,
      assignments,
      hotkey,
      updatedAt: Date.now(),
    });
  }

  const hasChanges =
    name !== setup.name ||
    layout.preset !== setup.layout.preset ||
    JSON.stringify(assignments) !== JSON.stringify(setup.assignments) ||
    hotkey !== setup.hotkey;

  return (
    <div className="max-w-[640px] mx-auto px-6 py-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent text-[22px] font-semibold outline-none border-b-2 border-transparent px-1 py-1 w-[300px]"
          style={{ color: colors.textPrimary }}
          onFocus={(e) => (e.target.style.borderBottomColor = colors.accentMuted)}
          onBlur={(e) => (e.target.style.borderBottomColor = 'transparent')}
          placeholder="Setup name"
        />

        <div className="flex items-center gap-2">
          <button onClick={onActivate} className="btn-primary flex items-center gap-1.5">
            <span className="text-[11px]">{'\u25B6'}</span>
            Activate
          </button>
          {!setup.isDefault && (
            !showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-glass"
                style={{ color: colors.danger, borderColor: `${colors.danger}33` }}
              >
                Delete
              </button>
            ) : (
              <button
                onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
                className="btn-glass animate-scale-in"
                style={{ color: colors.danger, background: `${colors.danger}18`, borderColor: `${colors.danger}33` }}
              >
                Confirm?
              </button>
            )
          )}
        </div>
      </div>

      <div className="h-px" style={{ background: colors.border }} />

      <LayoutPicker selected={layout.preset} onChange={handleLayoutChange} />

      <WindowSelector
        slots={layout.slots}
        assignments={assignments}
        onChange={setAssignments}
      />

      <HotkeyInput value={hotkey} onChange={setHotkey} />

      {hasChanges && (
        <div className="sticky bottom-0 pt-4 pb-2 animate-slide-up">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl btn-primary text-[14px] font-semibold shadow-glow"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
