import React, { useState, useEffect, useRef } from 'react';
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

const EMOJI_OPTIONS = ['\uD83D\uDDA5\uFE0F', '\uD83D\uDCBB', '\uD83D\uDCDD', '\uD83C\uDFA8', '\uD83D\uDD2C', '\uD83D\uDCCA', '\uD83C\uDFAE', '\uD83C\uDFB5', '\uD83D\uDCDA', '\uD83D\uDCBC', '\uD83D\uDE80', '\u26A1'];

export default function SetupEditor({ setup, onSave, onDelete, onActivate }: SetupEditorProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(setup.name);
  const [icon, setIcon] = useState(setup.icon);
  const [layout, setLayout] = useState<Layout>(setup.layout);
  const [assignments, setAssignments] = useState(setup.assignments);
  const [hotkey, setHotkey] = useState(setup.hotkey);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(setup.name);
    setIcon(setup.icon);
    setLayout(setup.layout);
    setAssignments(setup.assignments);
    setHotkey(setup.hotkey);
    setShowDeleteConfirm(false);
  }, [setup.id]);

  // Click outside to close emoji picker
  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClick(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojiPicker]);

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
          <div className="relative" ref={emojiRef}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-3xl hover:scale-110 active:scale-95 w-12 h-12 flex items-center justify-center rounded-xl shadow-card"
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {icon}
            </button>
            {showEmojiPicker && (
              <div
                className="absolute top-full left-0 mt-2 p-2 rounded-xl shadow-glass z-20 grid grid-cols-6 gap-1 animate-scale-in"
                style={{ background: colors.emojiPickerBg, border: `0.5px solid ${colors.borderActive}` }}
              >
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setIcon(e);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl p-1.5 rounded-lg active:scale-90"
                    style={{ transition: 'transform 0.1s ease' }}
                    onMouseEnter={(ev) => (ev.currentTarget.style.background = colors.hoverBg)}
                    onMouseLeave={(ev) => (ev.currentTarget.style.background = 'transparent')}
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
            className="bg-transparent text-[20px] font-semibold outline-none border-b-2 border-transparent px-1 py-0.5 w-[240px]"
            style={{ color: colors.textPrimary }}
            onFocus={(e) => (e.target.style.borderBottomColor = colors.accentMuted)}
            onBlur={(e) => (e.target.style.borderBottomColor = 'transparent')}
            placeholder="Setup name"
          />
        </div>

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
