import type { Setup, WindowInfo, AppInfo, ScreenInfo } from './types';

export interface BundlerAPI {
  getWindows: () => Promise<WindowInfo[]>;
  getApps: () => Promise<AppInfo[]>;
  getScreenInfo: () => Promise<ScreenInfo>;
  getSetups: () => Promise<Setup[]>;
  saveSetup: (setup: Setup) => Promise<void>;
  deleteSetup: (id: string) => Promise<void>;
  activateSetup: (id: string) => Promise<{ success: boolean; error?: string }>;
  checkAccessibility: () => Promise<boolean>;
  registerHotkey: (setupId: string, hotkey: string) => Promise<boolean>;
  unregisterHotkey: (hotkey: string) => Promise<void>;
}

declare global {
  interface Window {
    bundler: BundlerAPI;
  }
}

export const ipc = window.bundler;
