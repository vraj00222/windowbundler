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

const EMOJI_OPTIONS = ['🖥️', '💻', '📝', '🎨', '🔬', '📊', '🎮', '🎵', '📚', '💼', '🚀', '⚡'];

export default function SetupEditor({ setup, onSave, onDelete, onActivate }: SetupEditorProps) {
  const [name, setName] = useState(setup.name);
  const [icon, setIcon] = useState(setup.icon);
  const [layout, setLayout] = useState<Layout>(setup.layout);
  const [assignments, setAssignments] = useState(setup.assignments);
  const [hotkey, setHotkey] = useState(setup.hotkey);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Reset state when setup changes
  useEffect(() => {
    setName(setup.name);
    setIcon(setup.icon);
    setLayout(setup.layout);
    setAssignments(setup.assignments);
    setHotkey(setup.hotkey);
  }, [setup.id]);

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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Emoji picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-3xl hover:scale-110 transition-transform"
            >
              {icon}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-surface-2 border border-border rounded-lg shadow-card z-10 grid grid-cols-6 gap-1">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => {
                      setIcon(e);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl p-1 hover:bg-surface-3 rounded"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-xl font-semibold text-text-primary outline-none border-b-2 border-transparent focus:border-accent px-1"
            placeholder="Setup name"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onActivate}
            className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover"
          >
            Activate
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-400/10 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Layout Picker */}
      <LayoutPicker selected={layout.preset} onChange={setLayout} />

      {/* Window Assignments */}
      <WindowSelector
        slots={layout.slots}
        assignments={assignments}
        onChange={setAssignments}
      />

      {/* Hotkey */}
      <HotkeyInput value={hotkey} onChange={setHotkey} />

      {/* Save button */}
      {hasChanges && (
        <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-surface-0 via-surface-0">
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover shadow-glow"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
