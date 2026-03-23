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
    const data = await ipc.getSetups();
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
    <div className="flex h-screen bg-surface-0 text-text-primary select-none">
      {/* Accessibility Warning */}
      {!hasAccess && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-600/20 border-b border-yellow-500/30 px-4 py-2 text-center text-sm text-yellow-300">
          WindowBundler needs Accessibility permission to manage windows.
          <button
            onClick={checkAccess}
            className="ml-2 underline hover:text-yellow-100"
          >
            Check Again
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        setups={setups}
        selectedId={selectedId}
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
      <main className="flex-1 overflow-y-auto p-6" data-no-drag>
        {selectedSetup ? (
          <SetupEditor
            key={selectedSetup.id}
            setup={selectedSetup}
            onSave={handleSave}
            onDelete={() => handleDelete(selectedSetup.id)}
            onActivate={() => handleActivate(selectedSetup.id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-tertiary">
            <div className="text-center">
              <div className="text-5xl mb-4">{'\uD83E\uDE9F'}</div>
              <p className="text-lg">Select a setup or create a new one</p>
              <p className="text-sm mt-1 text-text-tertiary">
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
