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

export const PRESET_LABELS: Record<LayoutPreset, string> = {
  'halves-horizontal': 'Left / Right',
  'halves-vertical': 'Top / Bottom',
  'thirds-horizontal': 'Thirds',
  'quadrants': 'Quadrants',
  'main-sidebar': 'Main + Sidebar',
  'custom': 'Custom',
};
