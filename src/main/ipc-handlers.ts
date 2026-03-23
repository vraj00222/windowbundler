import { ipcMain } from 'electron';
import { SwiftBridge } from './swift-bridge';
import { loadSetups, saveSetup, deleteSetup, type Setup } from './setup-store';
import { activateSetup } from './window-manager';
import { registerHotkey, unregisterHotkey } from './hotkey-manager';

export function registerIpcHandlers(): void {
  ipcMain.handle('get-windows', async () => {
    return SwiftBridge.listWindows();
  });

  ipcMain.handle('get-apps', async () => {
    return SwiftBridge.listApps();
  });

  ipcMain.handle('get-screen-info', async () => {
    return SwiftBridge.getScreenInfo();
  });

  ipcMain.handle('get-setups', () => {
    return loadSetups();
  });

  ipcMain.handle('save-setup', (_event, setup: Setup) => {
    saveSetup(setup);
    if (setup.hotkey) {
      registerHotkey(setup.id, setup.hotkey);
    }
  });

  ipcMain.handle('delete-setup', (_event, id: string) => {
    deleteSetup(id);
  });

  ipcMain.handle('activate-setup', async (_event, id: string) => {
    return activateSetup(id);
  });

  ipcMain.handle('check-accessibility', async () => {
    return SwiftBridge.checkAccessibility();
  });

  ipcMain.handle('register-hotkey', (_event, setupId: string, hotkey: string) => {
    return registerHotkey(setupId, hotkey);
  });

  ipcMain.handle('unregister-hotkey', (_event, hotkey: string) => {
    unregisterHotkey(hotkey);
  });
}
