import React, { useState, useEffect } from 'react';
import { ipc } from './lib/ipc';
import type { Setup } from './lib/types';
import Sidebar from './components/Sidebar';
import SetupEditor from './components/SetupEditor';
import ActiveSetupBanner from './components/ActiveSetupBanner';

export default function App() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSetupId, setActiveSetupId] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    loadSetups();
    checkAccess();
  }, []);

  async function loadSetups() {
    let data = await ipc.getSetups();
    // Ensure a "General" default setup exists
    if (!data.some(s => s.isDefault)) {
      const generalSetup: Setup = {
        id: 'default-general',
        name: 'General',
        icon: '\uD83C\uDFE0',
        layout: {
          preset: 'halves-horizontal',
          slots: [
            { id: 'left', x: 0, y: 0, width: 50, height: 100 },
            { id: 'right', x: 50, y: 0, width: 50, height: 100 },
          ],
        },
        assignments: [],
        isDefault: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await ipc.saveSetup(generalSetup);
      data = await ipc.getSetups();
    }
    setSetups(data);
  }

  async function checkAccess() {
    const ok = await ipc.checkAccessibility();
    setHasAccess(ok);
  }

  async function handleSave(setup: Setup) {
    await ipc.saveSetup(setup);
    await loadSetups();
    setSelectedId(setup.id);
  }

  async function handleDelete(id: string) {
    await ipc.deleteSetup(id);
    await loadSetups();
    if (selectedId === id) setSelectedId(null);
  }

  async function handleActivate(id: string) {
    const result = await ipc.activateSetup(id);
    if (result.success) {
      setActiveSetupId(id);
    } else {
      console.error('Activation failed:', result.error);
    }
  }

  const selectedSetup = setups.find(s => s.id === selectedId) || null;
  const activeSetup = setups.find(s => s.id === activeSetupId) || null;

  return (
    <div className="flex h-screen select-none overflow-hidden bg-[#1a1a1e]">
      {/* Accessibility Warning */}
      {!hasAccess && (
        <div className="absolute top-0 left-0 right-0 z-50 px-4 py-2.5 text-center text-[13px] animate-slide-up"
          style={{ background: 'rgba(255, 179, 0, 0.10)', borderBottom: '1px solid rgba(255, 179, 0, 0.12)' }}>
          <span className="text-amber-400">
            WindowBundler needs Accessibility permission to manage windows.
          </span>
          <button
            onClick={checkAccess}
            className="ml-3 text-amber-300 hover:text-amber-200 underline underline-offset-2 font-medium"
          >
            Check Again
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        setups={setups}
        selectedId={selectedId}
        activeSetupId={activeSetupId}
        onSelect={setSelectedId}
        onActivate={handleActivate}
        onNew={() => {
          const newSetup: Setup = {
            id: crypto.randomUUID(),
            name: 'New Setup',
            icon: '\uD83D\uDDA5\uFE0F',
            layout: {
              preset: 'halves-horizontal',
              slots: [
                { id: 'left', x: 0, y: 0, width: 50, height: 100 },
                { id: 'right', x: 50, y: 0, width: 50, height: 100 },
              ],
            },
            assignments: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          handleSave(newSetup);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#141416]" data-no-drag>
        {selectedSetup ? (
          <div className="animate-fade-in">
            <SetupEditor
              key={selectedSetup.id}
              setup={selectedSetup}
              onSave={handleSave}
              onDelete={() => handleDelete(selectedSetup.id)}
              onActivate={() => handleActivate(selectedSetup.id)}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-5 opacity-20">{'\uD83E\uDE9F'}</div>
              <p className="text-[15px] text-text-secondary font-medium">Select a setup or create a new one</p>
              <p className="text-[13px] mt-1.5 text-text-tertiary">
                Bundle your windows into perfect layouts
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Active setup indicator */}
      <ActiveSetupBanner setup={activeSetup} />
    </div>
  );
}
