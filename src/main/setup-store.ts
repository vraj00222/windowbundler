import fs from 'fs';
import path from 'path';
import { app } from 'electron';

// Import types directly — these are simple interfaces, compatible with commonjs build
export interface Setup {
  id: string;
  name: string;
  icon: string;
  layout: {
    preset: string;
    slots: Array<{ id: string; x: number; y: number; width: number; height: number }>;
  };
  assignments: Array<{ slotId: string; appName: string; bundleId?: string }>;
  hotkey?: string;
  createdAt: number;
  updatedAt: number;
}

let STORE_DIR: string;
let STORE_FILE: string;

function getPaths() {
  if (!STORE_DIR) {
    STORE_DIR = path.join(app.getPath('userData'), 'window-bundler');
    STORE_FILE = path.join(STORE_DIR, 'setups.json');
  }
}

function ensureDir(): void {
  getPaths();
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
