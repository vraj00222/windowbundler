import { SwiftBridge, type ScreenInfo } from './swift-bridge';
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

export async function activateSetup(setupId: string): Promise<{ success: boolean; error?: string }> {
  const setups = loadSetups();
  const setup = setups.find(s => s.id === setupId);
  if (!setup) {
    return { success: false, error: 'Setup not found' };
  }

  if (setup.assignments.length === 0) {
    return { success: false, error: 'No apps assigned to this setup' };
  }

  // Check accessibility
  const trusted = await SwiftBridge.checkAccessibility();
  if (!trusted) {
    return { success: false, error: 'Accessibility permission required' };
  }

  const screen = await SwiftBridge.getScreenInfo();
  const runningApps = await SwiftBridge.listApps();
  const assignedPids: Set<number> = new Set();

  // Track how many windows per PID we've used (for same-app multi-slot)
  const pidWindowIndex: Map<number, number> = new Map();

  // Step 1: Move and resize each assigned app
  for (const assignment of setup.assignments) {
    const slot = setup.layout.slots.find(s => s.id === assignment.slotId);
    if (!slot) continue;

    const app = runningApps.find(
      a => a.name === assignment.appName || a.bundleId === assignment.bundleId
    );
    if (!app) continue; // app not running, skip

    const windowIdx = pidWindowIndex.get(app.pid) || 0;
    pidWindowIndex.set(app.pid, windowIdx + 1);

    const frame = calculateFrame(slot, screen);
    try {
      await SwiftBridge.moveWindow(app.pid, windowIdx, frame.x, frame.y, frame.width, frame.height);
      assignedPids.add(app.pid);
    } catch (err) {
      console.error(`Failed to move window for ${assignment.appName}:`, err);
    }
  }

  // Step 2: Hide all other regular apps (not assigned, not Finder, not ourselves)
  for (const app of runningApps) {
    if (!assignedPids.has(app.pid)) {
      if (app.bundleId !== 'com.apple.finder' && app.name !== 'WindowBundler' && app.name !== 'Electron') {
        try {
          await SwiftBridge.hideApp(app.pid);
        } catch (err) {
          // Non-critical, some apps resist hiding
        }
      }
    }
  }

  // Step 3: Focus the assigned apps — reverse order so the first one ends up on top
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
    try {
      await SwiftBridge.focusApp(focusPids[i]);
    } catch (err) {
      console.error(`Failed to focus app pid ${focusPids[i]}:`, err);
    }
  }

  return { success: true };
}
