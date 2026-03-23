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
      if (app.bundleId !== 'com.apple.finder' && app.name !== 'WindowBundler') {
        await SwiftBridge.hideApp(app.pid);
      }
    }
  }

  // Step 3: Focus the first assigned app
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
