import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // Window management
  getWindows: () => ipcRenderer.invoke('get-windows'),
  getApps: () => ipcRenderer.invoke('get-apps'),
  getScreenInfo: () => ipcRenderer.invoke('get-screen-info'),

  // Setup CRUD
  getSetups: () => ipcRenderer.invoke('get-setups'),
  saveSetup: (setup: any) => ipcRenderer.invoke('save-setup', setup),
  deleteSetup: (id: string) => ipcRenderer.invoke('delete-setup', id),

  // Activation
  activateSetup: (id: string) => ipcRenderer.invoke('activate-setup', id),

  // Accessibility
  checkAccessibility: () => ipcRenderer.invoke('check-accessibility'),

  // Hotkeys
  registerHotkey: (setupId: string, hotkey: string) =>
    ipcRenderer.invoke('register-hotkey', setupId, hotkey),
  unregisterHotkey: (hotkey: string) =>
    ipcRenderer.invoke('unregister-hotkey', hotkey),
};

contextBridge.exposeInMainWorld('bundler', api);

// Type declaration for renderer
export type BundlerAPI = typeof api;
