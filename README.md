# WindowBundler

A macOS app that groups your open windows into named **setups**, snaps them into split-screen layouts, and lets you switch between setups with one click or a global hotkey. Close the window and it keeps running in the background — your hotkeys stay active.

Built with Electron, React, TypeScript, Tailwind CSS, and a native Swift helper.

---

## Install

Download the latest `.dmg` from [Releases](https://github.com/vraj00222/windowbundler/releases), open it, and drag **WindowBundler** to Applications.

On first launch, grant **Accessibility** permission when prompted:
**System Settings > Privacy & Security > Accessibility** > toggle on WindowBundler.

### Build from source

```bash
git clone git@github.com:vraj00222/windowbundler.git
cd windowbundler
npm install        # also compiles the native Swift helper
npm run dev        # development mode
npm run package    # builds .dmg to release/
```

Requires macOS, Node.js 18+, and Xcode Command Line Tools.

---

## How It Works

1. **Create a setup** — give it a name, pick a layout (halves, thirds, quadrants, main+sidebar)
2. **Assign apps** — choose which running apps go in each slot
3. **Activate** — click the button or press your hotkey. Windows snap into position, everything else hides.

The app stays in your dock and menu bar tray. Closing the window doesn't quit it — hotkeys and tray access keep working.

### Example setups

| Setup | Layout |
|-------|--------|
| Coding | VS Code left 65%, Chrome right 35% |
| Writing | Docs left half, Notes right half |
| Research | Browser full width, two columns |
| Design | Figma left, Slack top-right, Notes bottom-right |

---

## Features

- **3 themes** — Light, Dark, and Glass. Switch instantly from the sidebar.
- **Layout picker** — visual previews for 5 built-in layouts (left/right, top/bottom, thirds, quadrants, main+sidebar)
- **Global hotkeys** — assign a keyboard shortcut to any setup, works system-wide even when the app is hidden
- **Menu bar tray** — quick-access dropdown to activate setups or open the window
- **Default setup** — a pinned "General" setup that's always available
- **Background mode** — closing the window hides it; the app keeps running for hotkeys and tray
- **Persistent storage** — setups saved locally as JSON, survive restarts
- **Single instance** — opening the app again brings the existing window to front

---

## Architecture

```
Electron
  Renderer (React + Tailwind)  <-- IPC -->  Main Process
                                               |
                                          Swift Bridge
                                               |
                                        window-helper binary
                                               |
                                     macOS Accessibility API
```

The native Swift binary handles window detection (`list-apps`), positioning (`move`), focusing (`focus`), and hiding (`hide`) through the macOS Accessibility API. The Electron main process spawns it as a child process and communicates via JSON over stdout.

---

## Project Structure

```
windowbundler/
  src/
    main/              Electron main process
      index.ts          App entry, window, tray, lifecycle
      swift-bridge.ts   Spawns native helper
      window-manager.ts Setup activation logic
      setup-store.ts    JSON persistence
      hotkey-manager.ts Global shortcuts
      ipc-handlers.ts   IPC wiring
      tray.ts           Menu bar tray
    renderer/           React UI
      App.tsx
      components/       Sidebar, SetupEditor, LayoutPicker, etc.
      lib/              Types, IPC wrappers, theme system
    preload/            Electron context bridge
  native/
    WindowHelper.swift  macOS Accessibility API bridge
    build.sh
  assets/
    icon.icns           App icon
```

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start in dev mode (Vite + Electron) |
| `npm run build` | Build native + renderer + main |
| `npm run package` | Build and create `.dmg` |

---

## Roadmap

- [ ] Custom drag-to-define grid layouts
- [ ] Multi-monitor support
- [ ] Auto-launch apps that aren't running
- [ ] Import/export setups
- [ ] Quick switcher overlay (Cmd+Space style)
- [ ] Auto-activate based on time or display

---

## License

MIT
