import { SwiftBridge, type ScreenInfo, type NativeWindowInfo } from './swift-bridge';
import { loadSetups, type Setup } from './setup-store';

interface LayoutSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function calculateFrame(slot: LayoutSlot, screen: ScreenInfo) {
  return {
    x: screen.x + Math.round((slot.x / 100) * screen.width),
    y: screen.y + Math.round((slot.y / 100) * screen.height),
    width: Math.round((slot.width / 100) * screen.width),
    height: Math.round((slot.height / 100) * screen.height),
  };
}

/**
 * Find the window index within an app's window list that best matches the assignment.
 * Tries to match by window title first, falls back to sequential index.
 */
function findWindowIndex(
  windows: NativeWindowInfo[],
  assignment: { appName: string; windowTitle?: string; windowId?: number; pid?: number },
  usedIndices: Map<number, Set<number>>
): { pid: number; windowIndex: number } | null {
  // Find all windows for this app
  const appWindows = windows.filter(w =>
    w.appName === assignment.appName
  );

  if (appWindows.length === 0) return null;

  const pid = appWindows[0].pid;
  const used = usedIndices.get(pid) || new Set();

  // All windows for this pid to determine index
  const pidWindows = windows.filter(w => w.pid === pid);

  // Try matching by windowTitle first (most reliable for per-window targeting)
  if (assignment.windowTitle) {
    for (let i = 0; i < pidWindows.length; i++) {
      if (!used.has(i) && pidWindows[i].windowTitle === assignment.windowTitle) {
        used.add(i);
        usedIndices.set(pid, used);
        return { pid, windowIndex: i };
      }
    }
    // Partial title match fallback
    for (let i = 0; i < pidWindows.length; i++) {
      if (!used.has(i) && pidWindows[i].windowTitle.includes(assignment.windowTitle)) {
        used.add(i);
        usedIndices.set(pid, used);
        return { pid, windowIndex: i };
      }
    }
  }

  // Fall back to next unused window index for this pid
  for (let i = 0; i < pidWindows.length; i++) {
    if (!used.has(i)) {
      used.add(i);
      usedIndices.set(pid, used);
      return { pid, windowIndex: i };
    }
  }

  return null;
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
  const allWindows = await SwiftBridge.listWindows();
  const runningApps = await SwiftBridge.listApps();
  const assignedPids: Set<number> = new Set();
  const usedIndices: Map<number, Set<number>> = new Map();

  // Step 1: Move and resize each assigned window
  for (const assignment of setup.assignments) {
    const slot = setup.layout.slots.find(s => s.id === assignment.slotId);
    if (!slot) continue;

    const match = findWindowIndex(allWindows, assignment, usedIndices);
    if (!match) continue; // window not found, skip

    const frame = calculateFrame(slot, screen);
    await SwiftBridge.moveWindow(match.pid, match.windowIndex, frame.x, frame.y, frame.width, frame.height);
    assignedPids.add(match.pid);
  }

  // Step 2: Hide all other regular apps
  for (const app of runningApps) {
    if (!assignedPids.has(app.pid)) {
      if (app.bundleId !== 'com.apple.finder' && app.name !== 'WindowBundler') {
        await SwiftBridge.hideApp(app.pid);
      }
    }
  }

  // Step 3: Focus the assigned apps (in reverse so the first one ends up on top)
  const focusPids: number[] = [];
  for (const assignment of setup.assignments) {
    const app = runningApps.find(
      a => a.name === assignment.appName || a.bundleId === assignment.bundleId
    );
    if (app && !focusPids.includes(app.pid)) {
      focusPids.push(app.pid);
    }
  }
  for (let i = focusPids.length - 1; i >= 0; i--) {
    await SwiftBridge.focusApp(focusPids[i]);
  }

  return { success: true };
}
