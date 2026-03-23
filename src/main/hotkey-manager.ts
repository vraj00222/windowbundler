import { globalShortcut } from 'electron';
import { activateSetup } from './window-manager';

const registeredHotkeys: Map<string, string> = new Map(); // hotkey → setupId

export function registerHotkey(setupId: string, hotkey: string): boolean {
  // Unregister old hotkey for this setup if exists
  for (const [key, id] of registeredHotkeys.entries()) {
    if (id === setupId) {
      globalShortcut.unregister(key);
      registeredHotkeys.delete(key);
    }
  }

  try {
    const success = globalShortcut.register(hotkey, () => {
      activateSetup(setupId);
    });
    if (success) {
      registeredHotkeys.set(hotkey, setupId);
    }
    return success;
  } catch (error) {
    console.error(`Failed to register hotkey ${hotkey}:`, error);
    return false;
  }
}

export function unregisterHotkey(hotkey: string): void {
  globalShortcut.unregister(hotkey);
  registeredHotkeys.delete(hotkey);
}

export function unregisterForSetup(setupId: string): void {
  for (const [key, id] of registeredHotkeys.entries()) {
    if (id === setupId) {
      globalShortcut.unregister(key);
      registeredHotkeys.delete(key);
    }
  }
}

export function unregisterAll(): void {
  globalShortcut.unregisterAll();
  registeredHotkeys.clear();
}

export function reregisterAll(setups: Array<{ id: string; hotkey?: string }>): void {
  unregisterAll();
  for (const setup of setups) {
    if (setup.hotkey) {
      registerHotkey(setup.id, setup.hotkey);
    }
  }
}
