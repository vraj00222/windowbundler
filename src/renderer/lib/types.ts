// ===== Layout Types =====

export type LayoutPreset =
  | 'halves-horizontal'   // left/right 50-50
  | 'halves-vertical'     // top/bottom 50-50
  | 'thirds-horizontal'   // three columns
  | 'quadrants'           // 2x2 grid
  | 'main-sidebar'        // 60-40 split
  | 'custom';             // user-defined grid

export interface LayoutSlot {
  id: string;
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export interface Layout {
  preset: LayoutPreset;
  slots: LayoutSlot[];
}

// ===== Setup Types =====

export interface AppAssignment {
  slotId: string;          // which layout slot
  appName: string;         // e.g., "Google Chrome"
  bundleId?: string;       // e.g., "com.google.Chrome"
  windowTitle?: string;    // specific window title for per-window selection
  windowId?: number;       // CGWindowID for targeting a specific window
  pid?: number;            // process ID at time of assignment (used for matching)
}

export interface Setup {
  id: string;
  name: string;
  icon: string;            // emoji
  layout: Layout;
  assignments: AppAssignment[];
  hotkey?: string;          // e.g., "CommandOrControl+Shift+1"
  isDefault?: boolean;      // true for the "General" default setup
  createdAt: number;
  updatedAt: number;
}

// ===== IPC Types =====

export interface WindowInfo {
  pid: number;
  appName: string;
  windowTitle: string;
  windowId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppInfo {
  pid: number;
  name: string;
  bundleId: string | null;
}

export interface ScreenInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ===== IPC Channel Map =====

export type IpcChannels = {
  'get-windows': () => WindowInfo[];
  'get-apps': () => AppInfo[];
  'get-screen-info': () => ScreenInfo;
  'get-setups': () => Setup[];
  'save-setup': (setup: Setup) => void;
  'delete-setup': (id: string) => void;
  'activate-setup': (id: string) => void;
  'check-accessibility': () => boolean;
  'register-hotkey': (setupId: string, hotkey: string) => boolean;
  'unregister-hotkey': (hotkey: string) => void;
};
