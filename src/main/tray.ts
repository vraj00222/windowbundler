import { Tray, Menu, nativeImage, BrowserWindow } from 'electron';
import { loadSetups } from './setup-store';
import { activateSetup } from './window-manager';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow): Tray {
  // Create a simple 16x16 tray icon programmatically
  const icon = nativeImage.createFromBuffer(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABhSURBVDiNY/z//z8DEwMDAwMjIyMDMzMzAysrKwMHBwcDFxcXAw8PDwMfHx+DgIAAgxATE4OwsDCDiIgIg5iYGIO4uDiDpKQkg5SUFIOcnByDgoICg5KSEoOKigqDmpoaAwBaShANB3gBGgAAAABJRU5ErkJggg==',
      'base64'
    )
  );
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  tray.setToolTip('WindowBundler');

  updateTrayMenu(mainWindow);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  return tray;
}

export function updateTrayMenu(mainWindow: BrowserWindow): void {
  if (!tray) return;

  const setups = loadSetups();

  const setupItems: Electron.MenuItemConstructorOptions[] = setups.map(setup => ({
    label: `${setup.icon} ${setup.name}`,
    sublabel: setup.hotkey || undefined,
    click: () => activateSetup(setup.id),
  }));

  const menu = Menu.buildFromTemplate([
    ...setupItems,
    ...(setupItems.length > 0 ? [{ type: 'separator' as const }] : []),
    {
      label: 'Open WindowBundler',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      role: 'quit' as const,
    },
  ]);

  tray.setContextMenu(menu);
}
