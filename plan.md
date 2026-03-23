# WindowBundler — Full Build Instructions for VS Code

> A macOS desktop app that lets you group open windows into named "setups" (workspaces), snap them into split-screen layouts, and switch between setups with one click or hotkey. Built with Electron + TypeScript + React + Swift native helper.

---

## Table of Contents

1. [What You're Building](#1-what-youre-building)
2. [Prerequisites](#2-prerequisites)
3. [Project Structure](#3-project-structure)
4. [Step-by-Step Build Order](#4-step-by-step-build-order)
5. [File-by-File Implementation](#5-file-by-file-implementation)
6. [Run, Debug, Package](#6-run-debug-package)
7. [GitHub Setup](#7-github-setup)
8. [Architecture Decisions](#8-architecture-decisions)

---

## 1. What You're Building

**App Name:** WindowBundler

**Core Features:**
- Detect all open windows across all running apps on macOS
- Create named "setups" (bundles) by selecting which apps/windows belong together
- Assign a layout to each setup: split-screen halves, thirds, quadrants, or custom grid
- Activate a setup with one click or global hotkey → all bundled windows snap into position, everything else hides
- Menubar tray icon for quick access (no dock icon clutter)
- Persist setups to local JSON so they survive app restarts
- Clean, minimal UI — dark theme, keyboard-first

**Example Setups a User Would Create:**
- "Writing" → PowerPoint left half, Word right half
- "Coding" → VS Code left 60%, Chrome right 40%
- "Research" → Browser full screen
- "Design" → Figma left, Slack bottom-right, Notes top-right

---

## 2. Prerequisites

Run these in Terminal before starting:

```bash
# 1. Check Node.js (need v18+)
node --version
# If not installed: brew install node

# 2. Install Xcode Command Line Tools (needed for Swift compiler)
xcode-select --install

# 3. Verify Swift is available
swift --version

# 4. Install global tools
npm install -g typescript electron-builder
```

**VS Code Extensions to Install:**
- ESLint
- Prettier
- TypeScript Importer
- Tailwind CSS IntelliSense

---

## 3. Project Structure

```
window-bundler/
├── package.json
├── tsconfig.json
├── tsconfig.electron.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── electron-builder.yml
├── .gitignore
├── README.md
│
├── src/
│   ├── main/                      # Electron main process
│   │   ├── index.ts               # App entry — creates window, tray, IPC
│   │   ├── tray.ts                # Menubar tray icon + menu
│   │   ├── ipc-handlers.ts        # IPC handlers for renderer ↔ main
│   │   ├── window-manager.ts      # Core logic: detect, move, resize windows
│   │   ├── setup-store.ts         # Read/write setups to JSON file
│   │   ├── hotkey-manager.ts      # Register global hotkeys per setup
│   │   └── swift-bridge.ts        # Spawns the Swift helper, parses output
│   │
│   ├── renderer/                  # React UI (Electron renderer process)
│   │   ├── index.html             # HTML entry
│   │   ├── main.tsx               # React root
│   │   ├── App.tsx                # Root component
│   │   ├── global.css             # Tailwind imports + custom styles
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.tsx            # Setup list + add new
│   │   │   ├── SetupCard.tsx          # Individual setup display
│   │   │   ├── LayoutPicker.tsx       # Visual grid layout selector
│   │   │   ├── WindowSelector.tsx     # Pick which apps go in a setup
│   │   │   ├── HotkeyInput.tsx        # Capture keyboard shortcut
│   │   │   ├── SetupEditor.tsx        # Full editor panel for a setup
│   │   │   └── ActiveSetupBanner.tsx  # Shows which setup is active
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSetups.ts           # CRUD operations for setups
│   │   │   ├── useWindows.ts          # Fetch open windows from main process
│   │   │   └── useHotkeys.ts          # Hotkey registration bridge
│   │   │
│   │   ├── lib/
│   │   │   ├── ipc.ts                 # Typed IPC invoke wrappers
│   │   │   └── types.ts              # Shared TypeScript types
│   │   │
│   │   └── assets/
│   │       └── trayIconTemplate.png   # 22x22 menubar icon (macOS template image)
│   │
│   └── preload/
│       └── index.ts               # Electron preload — exposes IPC to renderer
│
├── native/                        # Swift native helper
│   ├── WindowHelper.swift         # macOS Accessibility API bridge
│   └── build.sh                   # Compile script
│
└── assets/
    ├── icon.icns                  # macOS app icon
    └── trayIconTemplate.png       # Menubar icon (16x16 + 32x32 @2x)
```

---

## 4. Step-by-Step Build Order

Follow this exact order. Each step builds on the previous one.

### Phase 1: Scaffold (Day 1)
1. Create project folder, `npm init`, install all dependencies
2. Set up config files: `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `electron-builder.yml`
3. Create the preload script
4. Create the main process entry (`src/main/index.ts`) — just opens a window
5. Create the renderer entry (`src/renderer/main.tsx`, `App.tsx`) — just shows "Hello"
6. **Checkpoint:** `npm run dev` opens an Electron window showing "Hello"

### Phase 2: Native Bridge (Day 2-3)
7. Write the Swift helper (`native/WindowHelper.swift`) with 3 commands:
   - `list` → returns JSON array of all open windows
   - `move <pid> <windowId> <x> <y> <width> <height>` → repositions a window
   - `focus <pid>` → brings app to front
8. Write `build.sh` to compile Swift → binary
9. Write `swift-bridge.ts` in main process to spawn the binary and parse results
10. Write `window-manager.ts` to use the bridge
11. **Checkpoint:** Run the Swift binary from Terminal, verify it lists your open windows as JSON

### Phase 3: Setup Storage (Day 3-4)
12. Define TypeScript types in `types.ts`
13. Write `setup-store.ts` — CRUD for setups stored in `~/.window-bundler/setups.json`
14. Wire up IPC handlers in `ipc-handlers.ts`
15. Write the preload bridge
16. **Checkpoint:** Can save and load setups via IPC from renderer console

### Phase 4: UI (Day 4-6)
17. Build `Sidebar.tsx` — list of saved setups
18. Build `SetupEditor.tsx` — name, app picker, layout picker
19. Build `WindowSelector.tsx` — shows running apps with icons, checkboxes
20. Build `LayoutPicker.tsx` — visual grid selector (halves, thirds, quadrants, custom)
21. Build `HotkeyInput.tsx` — captures shortcut combos
22. Wire everything together in `App.tsx`
23. **Checkpoint:** Full UI working, can create/edit/delete setups

### Phase 5: Activation Engine (Day 6-7)
24. Build the activation logic in `window-manager.ts`:
    - Read setup config
    - For each app in the setup: find its windows, calculate target frame based on layout + slot, call Swift helper to move + resize
    - Hide all windows NOT in the active setup
    - Bring setup windows to front
25. Wire activation to UI button + IPC
26. **Checkpoint:** Click "Activate" on a setup → windows rearrange

### Phase 6: Hotkeys + Tray (Day 7-8)
27. Build `hotkey-manager.ts` using Electron `globalShortcut`
28. Build `tray.ts` — menubar icon with dropdown listing all setups
29. Add "Activate" items to tray menu
30. **Checkpoint:** Global hotkey activates a setup from anywhere

### Phase 7: Polish + Package (Day 8-10)
31. Add animations, transitions, empty states
32. Handle edge cases (app not running, permission denied)
33. Add Accessibility permission prompt/check on first launch
34. Package with `electron-builder` → `.dmg`
35. Write README with demo GIF
36. Push to GitHub

---

## 5. File-by-File Implementation

### 5.1 — `package.json`

```json
{
  "name": "window-bundler",
  "version": "1.0.0",
  "description": "Bundle and switch between window setups on macOS",
  "main": "dist/main/index.js",
  "author": "Vraj",
  "license": "MIT",
  "scripts": {
    "dev": "concurrently \"npm run dev:renderer\" \"npm run dev:electron\"",
    "dev:renderer": "vite",
    "dev:electron": "tsc -p tsconfig.electron.json && electron .",
    "build:renderer": "vite build",
    "build:electron": "tsc -p tsconfig.electron.json",
    "build:native": "cd native && chmod +x build.sh && ./build.sh",
    "build": "npm run build:native && npm run build:renderer && npm run build:electron",
    "package": "npm run build && electron-builder",
    "lint": "eslint src --ext .ts,.tsx",
    "postinstall": "npm run build:native"
  },
  "dependencies": {
    "electron-store": "^8.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "concurrently": "^8.2.2",
    "electron": "^28.1.3",
    "electron-builder": "^24.9.1",
    "eslint": "^8.56.0",
    "postcss": "^8.4.33",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.12"
  },
  "build": {
    "extends": "electron-builder.yml"
  }
}
```

### 5.2 — `tsconfig.json` (renderer)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "outDir": "dist/renderer",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/renderer/*"]
    }
  },
  "include": ["src/renderer/**/*", "src/preload/**/*"]
}
```

### 5.3 — `tsconfig.electron.json` (main process)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist/main",
    "rootDir": "src/main",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/main/**/*"]
}
```

### 5.4 — `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
    },
  },
  server: {
    port: 5173,
  },
});
```

### 5.5 — `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#0a0a0b',
          1: '#131316',
          2: '#1c1c21',
          3: '#25252b',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          muted: '#4f46e5',
        },
        text: {
          primary: '#f0f0f3',
          secondary: '#9090a0',
          tertiary: '#60607a',
        },
        border: {
          DEFAULT: '#2a2a35',
          active: '#3a3a4a',
        },
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '14px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
      },
    },
  },
  plugins: [],
};
```

### 5.6 — `postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 5.7 — `electron-builder.yml`

```yaml
appId: com.vraj.windowbundler
productName: WindowBundler
mac:
  category: public.app-category.productivity
  target: dmg
  icon: assets/icon.icns
  hardenedRuntime: true
  entitlements: entitlements.mac.plist
  extraResources:
    - from: native/window-helper
      to: window-helper
dmg:
  title: WindowBundler
  artifactName: WindowBundler-${version}.dmg
files:
  - dist/**/*
  - "!node_modules/**/*"
directories:
  output: release
```

### 5.8 — `.gitignore`

```
node_modules/
dist/
release/
native/window-helper
.DS_Store
*.log
```

---

### 5.9 — `native/WindowHelper.swift`

This is the critical native piece. It talks to the macOS Accessibility API.

```swift
import Cocoa
import Foundation

// MARK: - JSON Output Helpers

struct WindowInfo: Codable {
    let pid: Int32
    let appName: String
    let windowTitle: String
    let windowId: Int
    let x: Int
    let y: Int
    let width: Int
    let height: Int
    let isOnScreen: Bool
}

struct AppInfo: Codable {
    let pid: Int32
    let name: String
    let bundleId: String?
    let icon: String? // base64 encoded small icon (optional, for UI)
}

// MARK: - Accessibility Check

func checkAccessibility() -> Bool {
    let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
    return AXIsProcessTrustedWithOptions(options)
}

// MARK: - List All Windows

func listWindows() -> [WindowInfo] {
    let options = CGWindowListOption(arrayLiteral: .optionOnScreenOnly, .excludeDesktopElements)
    guard let windowList = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as? [[String: Any]] else {
        return []
    }

    var results: [WindowInfo] = []

    for window in windowList {
        guard let pid = window[kCGWindowOwnerPID as String] as? Int32,
              let appName = window[kCGWindowOwnerName as String] as? String,
              let windowId = window[kCGWindowNumber as String] as? Int,
              let bounds = window[kCGWindowBounds as String] as? [String: Any],
              let x = bounds["X"] as? Int,
              let y = bounds["Y"] as? Int,
              let w = bounds["Width"] as? Int,
              let h = bounds["Height"] as? Int,
              let layer = window[kCGWindowLayer as String] as? Int,
              layer == 0 // normal windows only
        else { continue }

        // Skip tiny windows (menu extras, status items)
        guard w > 50 && h > 50 else { continue }

        let title = window[kCGWindowName as String] as? String ?? ""
        let isOnScreen = window[kCGWindowIsOnscreen as String] as? Bool ?? true

        results.append(WindowInfo(
            pid: pid,
            appName: appName,
            windowTitle: title,
            windowId: windowId,
            x: x, y: y,
            width: w, height: h,
            isOnScreen: isOnScreen
        ))
    }

    return results
}

// MARK: - List Running Apps

func listApps() -> [AppInfo] {
    let workspace = NSWorkspace.shared
    let runningApps = workspace.runningApplications.filter {
        $0.activationPolicy == .regular // only apps that appear in Dock
    }

    return runningApps.map { app in
        AppInfo(
            pid: app.processIdentifier,
            name: app.localizedName ?? "Unknown",
            bundleId: app.bundleIdentifier,
            icon: nil
        )
    }
}

// MARK: - Move & Resize Window

func moveWindow(pid: Int32, x: Int, y: Int, width: Int, height: Int) -> Bool {
    let app = AXUIElementCreateApplication(pid)
    var windowsRef: CFTypeRef?

    let result = AXUIElementCopyAttributeValue(app, kAXWindowsAttribute as CFString, &windowsRef)
    guard result == .success, let windows = windowsRef as? [AXUIElement], !windows.isEmpty else {
        return false
    }

    let window = windows[0] // primary window

    // Set position
    var point = CGPoint(x: CGFloat(x), y: CGFloat(y))
    if let positionValue = AXValueCreate(.cgPoint, &point) {
        AXUIElementSetAttributeValue(window, kAXPositionAttribute as CFString, positionValue)
    }

    // Set size
    var size = CGSize(width: CGFloat(width), height: CGFloat(height))
    if let sizeValue = AXValueCreate(.cgSize, &size) {
        AXUIElementSetAttributeValue(window, kAXSizeAttribute as CFString, sizeValue)
    }

    return true
}

// MARK: - Focus App

func focusApp(pid: Int32) -> Bool {
    guard let app = NSRunningApplication(processIdentifier: pid) else {
        return false
    }
    return app.activate(options: [.activateIgnoringOtherApps])
}

// MARK: - Hide App

func hideApp(pid: Int32) -> Bool {
    guard let app = NSRunningApplication(processIdentifier: pid) else {
        return false
    }
    return app.hide()
}

// MARK: - Get Screen Dimensions

func getScreenInfo() -> [String: Any] {
    guard let screen = NSScreen.main else {
        return ["error": "No screen found"]
    }
    let frame = screen.visibleFrame // excludes menu bar and dock
    let fullFrame = screen.frame
    return [
        "x": Int(frame.origin.x),
        "y": Int(fullFrame.height - frame.origin.y - frame.height), // flip Y for CG coords
        "width": Int(frame.width),
        "height": Int(frame.height),
        "fullWidth": Int(fullFrame.width),
        "fullHeight": Int(fullFrame.height),
        "menuBarHeight": Int(fullFrame.height - frame.height - frame.origin.y)
    ]
}

// MARK: - CLI Entry Point

let args = CommandLine.arguments

guard args.count >= 2 else {
    let usage = """
    Usage:
      window-helper list-windows
      window-helper list-apps
      window-helper move <pid> <x> <y> <width> <height>
      window-helper focus <pid>
      window-helper hide <pid>
      window-helper screen-info
      window-helper check-access
    """
    print(usage)
    exit(1)
}

let command = args[1]
let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

switch command {
case "list-windows":
    let windows = listWindows()
    if let data = try? encoder.encode(windows), let json = String(data: data, encoding: .utf8) {
        print(json)
    }

case "list-apps":
    let apps = listApps()
    if let data = try? encoder.encode(apps), let json = String(data: data, encoding: .utf8) {
        print(json)
    }

case "move":
    guard args.count >= 7,
          let pid = Int32(args[2]),
          let x = Int(args[3]),
          let y = Int(args[4]),
          let w = Int(args[5]),
          let h = Int(args[6]) else {
        print("{\"error\": \"Invalid move arguments\"}")
        exit(1)
    }
    let success = moveWindow(pid: pid, x: x, y: y, width: w, height: h)
    print("{\"success\": \(success)}")

case "focus":
    guard args.count >= 3, let pid = Int32(args[2]) else {
        print("{\"error\": \"Invalid focus arguments\"}")
        exit(1)
    }
    let success = focusApp(pid: pid)
    print("{\"success\": \(success)}")

case "hide":
    guard args.count >= 3, let pid = Int32(args[2]) else {
        print("{\"error\": \"Invalid hide arguments\"}")
        exit(1)
    }
    let success = hideApp(pid: pid)
    print("{\"success\": \(success)}")

case "screen-info":
    let info = getScreenInfo()
    if let data = try? JSONSerialization.data(withJSONObject: info),
       let json = String(data: data, encoding: .utf8) {
        print(json)
    }

case "check-access":
    let trusted = checkAccessibility()
    print("{\"trusted\": \(trusted)}")

default:
    print("{\"error\": \"Unknown command: \(command)\"}")
    exit(1)
}
```

### 5.10 — `native/build.sh`

```bash
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Compiling WindowHelper.swift..."
swiftc WindowHelper.swift \
    -o window-helper \
    -framework Cocoa \
    -framework CoreGraphics \
    -O

chmod +x window-helper
echo "Built: native/window-helper"
```

---

### 5.11 — `src/main/swift-bridge.ts`

```ts
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { app } from 'electron';

const execFileAsync = promisify(execFile);

function getHelperPath(): string {
  // In dev: native/window-helper
  // In production: resources/window-helper
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

  async moveWindow(pid: number, x: number, y: number, width: number, height: number): Promise<boolean> {
    const json = await runHelper(['move', String(pid), String(x), String(y), String(width), String(height)]);
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
```

---

### 5.12 — `src/renderer/lib/types.ts`

```ts
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
}

export interface Setup {
  id: string;
  name: string;
  icon: string;            // emoji
  layout: Layout;
  assignments: AppAssignment[];
  hotkey?: string;          // e.g., "CommandOrControl+Shift+1"
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
```

---

### 5.13 — `src/main/setup-store.ts`

```ts
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import type { Setup } from '../renderer/lib/types';

const STORE_DIR = path.join(app.getPath('userData'), 'window-bundler');
const STORE_FILE = path.join(STORE_DIR, 'setups.json');

function ensureDir(): void {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

export function loadSetups(): Setup[] {
  ensureDir();
  if (!fs.existsSync(STORE_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSetups(setups: Setup[]): void {
  ensureDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(setups, null, 2), 'utf-8');
}

export function saveSetup(setup: Setup): void {
  const setups = loadSetups();
  const index = setups.findIndex(s => s.id === setup.id);
  if (index >= 0) {
    setups[index] = setup;
  } else {
    setups.push(setup);
  }
  saveSetups(setups);
}

export function deleteSetup(id: string): void {
  const setups = loadSetups().filter(s => s.id !== id);
  saveSetups(setups);
}
```

---

### 5.14 — `src/main/window-manager.ts`

```ts
import { SwiftBridge, type ScreenInfo } from './swift-bridge';
import { loadSetups } from './setup-store';
import type { Setup, LayoutSlot } from '../renderer/lib/types';

function calculateFrame(slot: LayoutSlot, screen: ScreenInfo) {
  return {
    x: screen.x + Math.round((slot.x / 100) * screen.width),
    y: screen.y + Math.round((slot.y / 100) * screen.height),
    width: Math.round((slot.width / 100) * screen.width),
    height: Math.round((slot.height / 100) * screen.height),
  };
}

export async function activateSetup(setupId: string): Promise<{ success: boolean; error?: string }> {
  const setups = loadSetups();
  const setup = setups.find(s => s.id === setupId);
  if (!setup) {
    return { success: false, error: 'Setup not found' };
  }

  // Check accessibility
  const trusted = await SwiftBridge.checkAccessibility();
  if (!trusted) {
    return { success: false, error: 'Accessibility permission required' };
  }

  const screen = await SwiftBridge.getScreenInfo();
  const runningApps = await SwiftBridge.listApps();
  const assignedPids: Set<number> = new Set();

  // Step 1: Move and resize each assigned app
  for (const assignment of setup.assignments) {
    const slot = setup.layout.slots.find(s => s.id === assignment.slotId);
    if (!slot) continue;

    const app = runningApps.find(
      a => a.name === assignment.appName || a.bundleId === assignment.bundleId
    );
    if (!app) continue; // app not running, skip

    const frame = calculateFrame(slot, screen);
    await SwiftBridge.moveWindow(app.pid, frame.x, frame.y, frame.width, frame.height);
    assignedPids.add(app.pid);
  }

  // Step 2: Hide all other regular apps
  for (const app of runningApps) {
    if (!assignedPids.has(app.pid)) {
      // Don't hide Finder or WindowBundler itself
      if (app.bundleId !== 'com.apple.finder' && app.name !== 'WindowBundler') {
        await SwiftBridge.hideApp(app.pid);
      }
    }
  }

  // Step 3: Focus the first assigned app (brings it to front)
  if (setup.assignments.length > 0) {
    const firstApp = runningApps.find(
      a => a.name === setup.assignments[0].appName || a.bundleId === setup.assignments[0].bundleId
    );
    if (firstApp) {
      await SwiftBridge.focusApp(firstApp.pid);
    }
  }

  return { success: true };
}
```

---

### 5.15 — `src/main/hotkey-manager.ts`

```ts
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
```

---

### 5.16 — `src/main/tray.ts`

```ts
import { Tray, Menu, nativeImage, BrowserWindow } from 'electron';
import path from 'path';
import { loadSetups } from './setup-store';
import { activateSetup } from './window-manager';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow): Tray {
  const iconPath = path.join(__dirname, '../../assets/trayIconTemplate.png');
  // Fallback: create a simple icon if file doesn't exist
  const icon = nativeImage.createEmpty();

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
```

---

### 5.17 — `src/main/ipc-handlers.ts`

```ts
import { ipcMain } from 'electron';
import { SwiftBridge } from './swift-bridge';
import { loadSetups, saveSetup, deleteSetup } from './setup-store';
import { activateSetup } from './window-manager';
import { registerHotkey, unregisterHotkey } from './hotkey-manager';
import type { Setup } from '../renderer/lib/types';

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
```

---

### 5.18 — `src/main/index.ts`

```ts
import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { registerIpcHandlers } from './ipc-handlers';
import { createTray } from './tray';
import { reregisterAll } from './hotkey-manager';
import { loadSetups } from './setup-store';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 620,
    minWidth: 700,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#0a0a0b',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In dev, load from Vite dev server; in prod, load built files
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  if (mainWindow) {
    createTray(mainWindow);
  }

  // Re-register saved hotkeys
  const setups = loadSetups();
  reregisterAll(setups);
});

app.on('window-all-closed', () => {
  // Don't quit on macOS — keep tray alive
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});

app.on('will-quit', () => {
  // Hotkeys cleaned up automatically
});

// Hide dock icon (menubar-only app)
// Uncomment this after you're done debugging:
// app.dock?.hide();
```

---

### 5.19 — `src/preload/index.ts`

```ts
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

contextBridge.exposeInMainProcess('bundler', api);

// Type declaration for renderer
export type BundlerAPI = typeof api;
```

---

### 5.20 — `src/renderer/lib/ipc.ts`

```ts
// Typed wrapper around the preload-exposed API

export interface BundlerAPI {
  getWindows: () => Promise<any[]>;
  getApps: () => Promise<any[]>;
  getScreenInfo: () => Promise<any>;
  getSetups: () => Promise<any[]>;
  saveSetup: (setup: any) => Promise<void>;
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
```

---

### 5.21 — `src/renderer/index.html`

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WindowBundler</title>
    <!-- Drag region for frameless window -->
    <style>
      body {
        margin: 0;
        overflow: hidden;
        -webkit-app-region: drag;
      }
      button, input, select, textarea, [data-no-drag] {
        -webkit-app-region: no-drag;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

---

### 5.22 — `src/renderer/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Smooth transitions globally */
* {
  transition-property: background-color, border-color, color, opacity;
  transition-duration: 150ms;
  transition-timing-function: ease;
}
```

---

### 5.23 — `src/renderer/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### 5.24 — `src/renderer/App.tsx`

This is the skeleton. Build out components one by one.

```tsx
import React, { useState, useEffect } from 'react';
import { ipc } from './lib/ipc';
import type { Setup } from './lib/types';
import Sidebar from './components/Sidebar';
import SetupEditor from './components/SetupEditor';

export default function App() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
    if (!result.success) {
      console.error('Activation failed:', result.error);
    }
  }

  const selectedSetup = setups.find(s => s.id === selectedId) || null;

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
            icon: '🖥️',
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
            setup={selectedSetup}
            onSave={handleSave}
            onDelete={() => handleDelete(selectedSetup.id)}
            onActivate={() => handleActivate(selectedSetup.id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-tertiary">
            <div className="text-center">
              <div className="text-5xl mb-4">🪟</div>
              <p className="text-lg">Select a setup or create a new one</p>
              <p className="text-sm mt-1 text-text-tertiary">
                Bundle your windows into perfect layouts
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
```

---

### 5.25 — Layout Presets Reference

Use these in `LayoutPicker.tsx`. Each preset defines its slots:

```ts
// src/renderer/lib/layout-presets.ts

import type { Layout, LayoutPreset } from './types';

export const LAYOUT_PRESETS: Record<LayoutPreset, Layout> = {
  'halves-horizontal': {
    preset: 'halves-horizontal',
    slots: [
      { id: 'left', x: 0, y: 0, width: 50, height: 100 },
      { id: 'right', x: 50, y: 0, width: 50, height: 100 },
    ],
  },
  'halves-vertical': {
    preset: 'halves-vertical',
    slots: [
      { id: 'top', x: 0, y: 0, width: 100, height: 50 },
      { id: 'bottom', x: 0, y: 50, width: 100, height: 50 },
    ],
  },
  'thirds-horizontal': {
    preset: 'thirds-horizontal',
    slots: [
      { id: 'left', x: 0, y: 0, width: 33.33, height: 100 },
      { id: 'center', x: 33.33, y: 0, width: 33.34, height: 100 },
      { id: 'right', x: 66.67, y: 0, width: 33.33, height: 100 },
    ],
  },
  'quadrants': {
    preset: 'quadrants',
    slots: [
      { id: 'top-left', x: 0, y: 0, width: 50, height: 50 },
      { id: 'top-right', x: 50, y: 0, width: 50, height: 50 },
      { id: 'bottom-left', x: 0, y: 50, width: 50, height: 50 },
      { id: 'bottom-right', x: 50, y: 50, width: 50, height: 50 },
    ],
  },
  'main-sidebar': {
    preset: 'main-sidebar',
    slots: [
      { id: 'main', x: 0, y: 0, width: 65, height: 100 },
      { id: 'sidebar', x: 65, y: 0, width: 35, height: 100 },
    ],
  },
  'custom': {
    preset: 'custom',
    slots: [],
  },
};
```

---

## 6. Run, Debug, Package

### Development

```bash
# Terminal 1: Build the native helper
npm run build:native

# Terminal 2: Start the app (runs Vite + Electron concurrently)
npm run dev
```

### VS Code Debug Config

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Electron Main",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "args": ["."],
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/dist/main/**/*.js"]
    }
  ]
}
```

### Package as .dmg

```bash
npm run package
# Output: release/WindowBundler-1.0.0.dmg
```

### First Launch Checklist

1. App opens → grant Accessibility permission when prompted
2. System Preferences → Privacy & Security → Accessibility → toggle on WindowBundler
3. Create a test setup → pick 2 running apps → assign to left/right split
4. Click "Activate" → watch the windows snap into position

---

## 7. GitHub Setup

```bash
# Initialize
git init
git add .
git commit -m "feat: initial WindowBundler — macOS window workspace manager"

# Create repo on GitHub (or use gh cli)
gh repo create window-bundler --public --source=. --push

# Or manual
git remote add origin https://github.com/vraj00222/window-bundler.git
git push -u origin main
```

### Recommended README Structure

```
# 🪟 WindowBundler

Bundle your windows into named setups. Switch layouts with one click.

[demo GIF here]

## Features
- Create named window setups
- Snap windows into split-screen layouts
- Global hotkeys to switch instantly
- Menubar-only app — stays out of your way

## Install
Download the latest .dmg from Releases, or build from source:
...

## Tech Stack
Electron • TypeScript • React • Tailwind • Swift (macOS native bridge)

## How It Works
[brief architecture diagram]
```

---

## 8. Architecture Decisions

**Why Electron over Tauri?**
Tauri is lighter but the Rust ↔ macOS Accessibility API bridge is harder to write and debug. With Electron, you spawn a Swift binary via `child_process` which is trivial to test independently. For a portfolio project, faster iteration wins.

**Why a Swift CLI binary instead of node-ffi-napi?**
The Accessibility API is Objective-C/Swift-native. A compiled Swift binary is more reliable, easier to debug (`./window-helper list-windows` from Terminal), and avoids the fragility of FFI bindings across Electron/Node versions. Rectangle and yabai use the same pattern.

**Why not use `electron-store` for everything?**
Plain JSON files in `userData` are simpler to debug. You can `cat` the file to inspect state. `electron-store` adds a dependency for no benefit at this scale.

**Why Tailwind in an Electron app?**
Fast iteration on the UI. The dark theme config is all in `tailwind.config.js` and you get macOS-native-feeling spacing and typography without writing custom CSS for every element.

**Menubar vs Dock app?**
Productivity tools like this should live in the menubar. Users don't want another dock icon. The main window opens on click/hotkey and the tray menu provides quick setup activation. Uncomment `app.dock?.hide()` in `index.ts` after development is done.

---

## Components Left to Build (UI)

The following React components are intentionally left for you to implement. The types, IPC layer, and data flow are all set up — you just need to build the JSX:

1. **`Sidebar.tsx`** — List of setup cards, "+" button to add new, click to select
2. **`SetupCard.tsx`** — Shows setup name, icon, hotkey badge, activate button
3. **`SetupEditor.tsx`** — Full editor: name input, emoji picker, layout picker, app assignments, hotkey config, save/delete/activate buttons
4. **`LayoutPicker.tsx`** — Visual grid showing the 5 presets as clickable mini-previews
5. **`WindowSelector.tsx`** — Fetches running apps via `ipc.getApps()`, shows checkboxes, assigns each selected app to a layout slot
6. **`HotkeyInput.tsx`** — Captures keyboard shortcut on focus (listen for keydown, format as Electron accelerator string)
7. **`ActiveSetupBanner.tsx`** — Small floating indicator showing which setup is currently active

Each component should use the `ipc` wrapper from `lib/ipc.ts` and the types from `lib/types.ts`. The hooks in `hooks/` are optional abstractions you can add as the components grow.

---

**You now have everything needed to build WindowBundler end-to-end in VS Code. Start with Phase 1, verify each checkpoint, and iterate forward.**