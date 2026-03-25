# WindowBundler

A macOS desktop app that lets you group open windows into named **setups** (workspaces), snap them into split-screen layouts, and switch between setups with one click or a global hotkey.

Built with **Electron + TypeScript + React + Tailwind CSS + Swift** native helper.

---

## What It Does

- **Detect** all open windows across every running app on macOS
- **Bundle** windows into named setups — pick which apps belong together
- **Layout** each setup with split-screen halves, thirds, quadrants, or custom grids
- **Activate** a setup with one click or global hotkey — windows snap into position, everything else hides
- **Tray icon** in the menubar for quick access (no dock clutter)
- **Persist** setups locally so they survive restarts

### Example Setups

| Setup | Layout |
|-------|--------|
| **Writing** | PowerPoint left half, Word right half |
| **Coding** | VS Code left 60%, Chrome right 40% |
| **Research** | Browser full screen |
| **Design** | Figma left, Slack bottom-right, Notes top-right |

---

## UI

WindowBundler uses a clean, minimal **white/light Apple-inspired** interface:

- **Sidebar** — lists all saved setups with quick-activate buttons
- **Setup Editor** — name your setup, pick apps, choose a layout, assign a hotkey
- **Layout Picker** — visual grid selector showing layout previews (halves, thirds, quadrants, custom)
- **Window Selector** — shows all running apps with checkboxes to include in your setup
- **Hotkey Input** — capture any keyboard shortcut combo to activate a setup globally
- **Active Setup Banner** — shows which setup is currently active

The UI is keyboard-first and designed to stay out of your way.

---

## Getting Started

### Prerequisites

- **macOS** (required — uses native Accessibility APIs)
- **Node.js** v18+
- **Xcode Command Line Tools** (`xcode-select --install`)
- **Swift** (comes with Xcode CLT)

### Install & Run

```bash
# Clone the repo
git clone git@github.com:vraj00222/windowbundler.git
cd windowbundler

# Install dependencies (also compiles the Swift native helper)
npm install

# Start in dev mode
npm run dev
```

### Grant Accessibility Permission

On first launch, macOS will prompt you to grant Accessibility access. This is required for WindowBundler to detect, move, and resize windows.

**System Settings > Privacy & Security > Accessibility** — toggle on the app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron 28 |
| UI framework | React 18 + TypeScript |
| Styling | Tailwind CSS 3 |
| Build tooling | Vite 5 + electron-builder |
| Native bridge | Swift (compiled binary using macOS Accessibility API) |
| Storage | Local JSON via electron-store |

### Architecture

```
┌─────────────────────────────────────────────┐
│                 Electron                     │
│  ┌──────────┐    IPC    ┌────────────────┐  │
│  │ Renderer │◄────────►│  Main Process   │  │
│  │ (React)  │           │                │  │
│  └──────────┘           │  ┌───────────┐ │  │
│                         │  │Swift Bridge│ │  │
│                         │  └─────┬─────┘ │  │
│                         └────────┼───────┘  │
└────────────────────────────────┼────────────┘
                                 │ spawn
                        ┌────────▼────────┐
                        │  window-helper  │
                        │  (Swift binary) │
                        └─────────────────┘
                                 │
                        macOS Accessibility API
```

The Swift helper supports three commands:
- `list` — returns JSON array of all open windows
- `move <pid> <windowId> <x> <y> <w> <h>` — repositions a window
- `focus <pid>` — brings an app to the front

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Electron + Vite in dev mode |
| `npm run build` | Build native helper + renderer + main process |
| `npm run package` | Build and package into a `.dmg` |
| `npm run build:native` | Compile the Swift helper binary |

---

## Current Features (v1.0)

- [x] Detect all open windows via native macOS Accessibility API
- [x] Create, edit, and delete named setups
- [x] Assign apps/windows to setups
- [x] Visual layout picker (halves, thirds, quadrants, custom grids)
- [x] One-click setup activation — windows snap into position
- [x] Global hotkey support per setup
- [x] Menubar tray icon with quick-access dropdown
- [x] Persistent storage (setups survive restarts)
- [x] Clean white/light Apple-themed UI
- [x] Accessibility permission check with guided setup

## Upcoming Features

- [ ] Custom grid layouts — drag to define arbitrary zones
- [ ] Multi-monitor support — assign setups to specific displays
- [ ] Auto-launch apps — if an app in a setup isn't running, open it
- [ ] Setup import/export — share setups as JSON files
- [ ] Window memory — remember and restore exact window sizes per app
- [ ] Quick switcher — `Cmd+Space`-style popup to search and activate setups
- [ ] Animations — smooth window transitions when switching setups
- [ ] Auto-activate — trigger setups based on time of day or connected displays
- [ ] Menu bar widget — show active setup name in the menu bar
- [ ] Drag-and-drop reordering in the sidebar

---

## Project Structure

```
windowbundler/
├── src/
│   ├── main/                  # Electron main process
│   │   ├── index.ts           # App entry point
│   │   ├── tray.ts            # Menubar tray icon + menu
│   │   ├── ipc-handlers.ts    # IPC handlers (renderer ↔ main)
│   │   ├── window-manager.ts  # Core window detection/movement logic
│   │   ├── setup-store.ts     # Setup CRUD (JSON persistence)
│   │   ├── hotkey-manager.ts  # Global hotkey registration
│   │   └── swift-bridge.ts    # Spawns Swift helper, parses output
│   │
│   ├── renderer/              # React UI
│   │   ├── App.tsx            # Root component
│   │   ├── components/        # UI components
│   │   ├── lib/               # Types, IPC wrappers, layout presets
│   │   └── global.css         # Tailwind + custom styles
│   │
│   └── preload/               # Electron preload script
│       └── index.ts
│
├── native/                    # Swift native helper
│   ├── WindowHelper.swift
│   └── build.sh
│
└── electron-builder.yml       # Packaging config
```

---

## License

MIT
