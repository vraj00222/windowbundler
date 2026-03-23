import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { app } from 'electron';

const execFileAsync = promisify(execFile);

function getHelperPath(): string {
  const isDev = !app.isPackaged;
  if (isDev) {
    return path.join(process.cwd(), 'native', 'window-helper');
  }
  return path.join(process.resourcesPath, 'window-helper');
}

async function runHelper(args: string[]): Promise<string> {
  const helperPath = getHelperPath();
  try {
    const { stdout } = await execFileAsync(helperPath, args, {
      timeout: 5000,
    });
    return stdout.trim();
  } catch (error: any) {
    console.error(`Swift helper error [${args.join(' ')}]:`, error.message);
    throw error;
  }
}

export interface NativeWindowInfo {
  pid: number;
  appName: string;
  windowTitle: string;
  windowId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isOnScreen: boolean;
}

export interface NativeAppInfo {
  pid: number;
  name: string;
  bundleId: string | null;
}

export interface ScreenInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  menuBarHeight: number;
}

export const SwiftBridge = {
  async listWindows(): Promise<NativeWindowInfo[]> {
    const json = await runHelper(['list-windows']);
    return JSON.parse(json);
  },

  async listApps(): Promise<NativeAppInfo[]> {
    const json = await runHelper(['list-apps']);
    return JSON.parse(json);
  },

  async moveWindow(pid: number, windowIndex: number, x: number, y: number, width: number, height: number): Promise<boolean> {
    const json = await runHelper(['move', String(pid), String(windowIndex), String(x), String(y), String(width), String(height)]);
    return JSON.parse(json).success;
  },

  async focusApp(pid: number): Promise<boolean> {
    const json = await runHelper(['focus', String(pid)]);
    return JSON.parse(json).success;
  },

  async hideApp(pid: number): Promise<boolean> {
    const json = await runHelper(['hide', String(pid)]);
    return JSON.parse(json).success;
  },

  async getScreenInfo(): Promise<ScreenInfo> {
    const json = await runHelper(['screen-info']);
    return JSON.parse(json);
  },

  async checkAccessibility(): Promise<boolean> {
    const json = await runHelper(['check-access']);
    return JSON.parse(json).trusted;
  },
};
