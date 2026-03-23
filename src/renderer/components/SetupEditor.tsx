import React, { useState, useEffect } from 'react';
import type { Setup, Layout } from '../lib/types';
import LayoutPicker from './LayoutPicker';
import WindowSelector from './WindowSelector';
import HotkeyInput from './HotkeyInput';

interface SetupEditorProps {
  setup: Setup;
  onSave: (setup: Setup) => void;
  onDelete: () => void;
  onActivate: () => void;
}

const EMOJI_OPTIONS = ['\uD83D\uDDA5\uFE0F', '\uD83D\uDCBB', '\uD83D\uDCDD', '\uD83C\uDFA8', '\uD83D\uDD2C', '\uD83D\uDCCA', '\uD83C\uDFAE', '\uD83C\uDFB5', '\uD83D\uDCDA', '\uD83D\uDCBC', '\uD83D\uDE80', '\u26A1'];

export default function SetupEditor({ setup, onSave, onDelete, onActivate }: SetupEditorProps) {
  const [name, setName] = useState(setup.name);
  const [icon, setIcon] = useState(setup.icon);
  const [layout, setLayout] = useState<Layout>(setup.layout);
  const [assignments, setAssignments] = useState(setup.assignments);
  const [hotkey, setHotkey] = useState(setup.hotkey);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setName(setup.name);
    setIcon(setup.icon);
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
      icon,
      layout,
      assignments,
      hotkey,
      updatedAt: Date.now(),
    });
  }

  const hasChanges =
    name !== setup.name ||
    icon !== setup.icon ||
    layout.preset !== setup.layout.preset ||
    JSON.stringify(assignments) !== JSON.stringify(setup.assignments) ||
    hotkey !== setup.hotkey;

  return (
    <div className="max-w-[640px] mx-auto px-6 py-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-3xl hover:scale-110 active:scale-95 w-12 h-12 flex items-center justify-center rounded-xl
                bg-surface-1 hover:bg-surface-2 border border-border shadow-card"
              style={{ transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {icon}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-border rounded-xl shadow-glass z-20 grid grid-cols-6 gap-1 animate-scale-in">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => {
                      setIcon(e);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl p-1.5 rounded-lg hover:bg-surface-1 active:scale-90"
                    style={{ transition: 'transform 0.1s ease' }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-[20px] font-semibold text-text-primary outline-none
              border-b-2 border-transparent focus:border-accent/30 px-1 py-0.5 w-[240px]"
            placeholder="Setup name"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onActivate}
            className="btn-primary flex items-center gap-1.5"
          >
            <span className="text-[11px]">{'\u25B6'}</span>
            Activate
          </button>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-glass text-danger hover:bg-danger/5 border-danger/15"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
              className="btn-glass bg-danger/8 text-danger border-danger/15 animate-scale-in"
            >
              Confirm?
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-border" />

      <LayoutPicker selected={layout.preset} onChange={handleLayoutChange} />

      <WindowSelector
        slots={layout.slots}
        assignments={assignments}
        onChange={setAssignments}
      />

      <HotkeyInput value={hotkey} onChange={setHotkey} />

      {hasChanges && (
        <div className="sticky bottom-0 pt-4 pb-2 animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent -z-10" />
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
