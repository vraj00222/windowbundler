import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'dark' | 'light' | 'glass';

export interface ThemeColors {
  // Surfaces
  bg: string;
  sidebarBg: string;
  mainBg: string;
  cardBg: string;
  inputBg: string;
  hoverBg: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Borders
  border: string;
  borderActive: string;

  // Accent
  accent: string;
  accentHover: string;
  accentMuted: string;

  // Buttons
  btnPrimaryBg: string;
  btnPrimaryHoverBg: string;
  btnPrimaryShadow: string;
  btnGlassBg: string;
  btnGlassHoverBg: string;
  btnGlassBorder: string;
  btnGlassColor: string;

  // Status
  success: string;
  danger: string;

  // Special
  selectArrowColor: string;
  selectOptionBg: string;
  scrollThumb: string;
  scrollThumbHover: string;
  selectionBg: string;
  selectionColor: string;
  saveFadeBg: string;
  bannerBg: string;
  emojiPickerBg: string;

  // Slot styling
  slotBg: string;
  slotBorder: string;
  slotActiveBg: string;
  slotActiveBorder: string;

  // Electron window
  electronBg: string;
}

const THEMES: Record<ThemeId, ThemeColors> = {
  dark: {
    bg: '#1a1a1e',
    sidebarBg: 'rgba(22, 22, 26, 0.95)',
    mainBg: '#141416',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    inputBg: 'rgba(255, 255, 255, 0.04)',
    hoverBg: 'rgba(255, 255, 255, 0.06)',
    textPrimary: 'rgba(255, 255, 255, 0.92)',
    textSecondary: 'rgba(255, 255, 255, 0.55)',
    textTertiary: 'rgba(255, 255, 255, 0.30)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderActive: 'rgba(255, 255, 255, 0.18)',
    accent: '#0A84FF',
    accentHover: '#409CFF',
    accentMuted: 'rgba(10, 132, 255, 0.15)',
    btnPrimaryBg: 'linear-gradient(180deg, #409CFF 0%, #0A84FF 100%)',
    btnPrimaryHoverBg: 'linear-gradient(180deg, #5AADFF 0%, #409CFF 100%)',
    btnPrimaryShadow: '0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    btnGlassBg: 'rgba(255, 255, 255, 0.06)',
    btnGlassHoverBg: 'rgba(255, 255, 255, 0.10)',
    btnGlassBorder: 'rgba(255, 255, 255, 0.08)',
    btnGlassColor: 'rgba(255, 255, 255, 0.85)',
    success: '#30D158',
    danger: '#FF453A',
    selectArrowColor: 'rgba(255,255,255,0.25)',
    selectOptionBg: '#1c1c20',
    scrollThumb: 'rgba(255, 255, 255, 0.10)',
    scrollThumbHover: 'rgba(255, 255, 255, 0.18)',
    selectionBg: 'rgba(10, 132, 255, 0.35)',
    selectionColor: 'white',
    saveFadeBg: 'from-[#141416] via-[#141416]/80 to-transparent',
    bannerBg: 'rgba(28, 28, 32, 0.90)',
    emojiPickerBg: 'rgba(36, 36, 40, 0.95)',
    slotBg: 'rgba(255, 255, 255, 0.08)',
    slotBorder: 'rgba(255, 255, 255, 0.06)',
    slotActiveBg: 'rgba(10, 132, 255, 0.25)',
    slotActiveBorder: 'rgba(10, 132, 255, 0.20)',
    electronBg: '#1a1a1e',
  },
  light: {
    bg: '#FFFFFF',
    sidebarBg: '#F5F5F7',
    mainBg: '#FAFAFA',
    cardBg: '#F5F5F7',
    inputBg: '#FFFFFF',
    hoverBg: '#EBEBEE',
    textPrimary: '#1D1D1F',
    textSecondary: '#6E6E73',
    textTertiary: '#AEAEB2',
    border: '#E0E0E5',
    borderActive: '#C8C8CD',
    accent: '#007AFF',
    accentHover: '#0A84FF',
    accentMuted: '#E8F0FE',
    btnPrimaryBg: 'linear-gradient(180deg, #3898FF 0%, #007AFF 100%)',
    btnPrimaryHoverBg: 'linear-gradient(180deg, #5AADFF 0%, #0A84FF 100%)',
    btnPrimaryShadow: '0 1px 3px rgba(0, 122, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    btnGlassBg: '#EBEBEE',
    btnGlassHoverBg: '#E0E0E5',
    btnGlassBorder: '#D5D5DA',
    btnGlassColor: '#1D1D1F',
    success: '#34C759',
    danger: '#FF3B30',
    selectArrowColor: '#999',
    selectOptionBg: '#FFFFFF',
    scrollThumb: '#D5D5DA',
    scrollThumbHover: '#C0C0C5',
    selectionBg: '#C4DFFF',
    selectionColor: '#1D1D1F',
    saveFadeBg: 'from-white via-white/80 to-transparent',
    bannerBg: '#FFFFFF',
    emojiPickerBg: '#FFFFFF',
    slotBg: '#FFFFFF',
    slotBorder: '#E0E0E5',
    slotActiveBg: '#D4E6FF',
    slotActiveBorder: '#A8CDFF',
    electronBg: '#FFFFFF',
  },
  glass: {
    bg: 'rgba(18, 18, 22, 0.78)',
    sidebarBg: 'rgba(18, 18, 22, 0.60)',
    mainBg: 'rgba(10, 10, 14, 0.50)',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    hoverBg: 'rgba(255, 255, 255, 0.07)',
    textPrimary: 'rgba(255, 255, 255, 0.95)',
    textSecondary: 'rgba(255, 255, 255, 0.55)',
    textTertiary: 'rgba(255, 255, 255, 0.30)',
    border: 'rgba(255, 255, 255, 0.10)',
    borderActive: 'rgba(255, 255, 255, 0.20)',
    accent: '#5AC8FA',
    accentHover: '#7DD8FF',
    accentMuted: 'rgba(90, 200, 250, 0.15)',
    btnPrimaryBg: 'linear-gradient(180deg, #7DD8FF 0%, #5AC8FA 100%)',
    btnPrimaryHoverBg: 'linear-gradient(180deg, #9EE3FF 0%, #7DD8FF 100%)',
    btnPrimaryShadow: '0 1px 4px rgba(90, 200, 250, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    btnGlassBg: 'rgba(255, 255, 255, 0.06)',
    btnGlassHoverBg: 'rgba(255, 255, 255, 0.12)',
    btnGlassBorder: 'rgba(255, 255, 255, 0.10)',
    btnGlassColor: 'rgba(255, 255, 255, 0.90)',
    success: '#30D158',
    danger: '#FF453A',
    selectArrowColor: 'rgba(255,255,255,0.30)',
    selectOptionBg: 'rgba(28, 28, 34, 0.98)',
    scrollThumb: 'rgba(255, 255, 255, 0.12)',
    scrollThumbHover: 'rgba(255, 255, 255, 0.22)',
    selectionBg: 'rgba(90, 200, 250, 0.30)',
    selectionColor: 'white',
    saveFadeBg: 'from-black/40 via-black/20 to-transparent',
    bannerBg: 'rgba(28, 28, 34, 0.80)',
    emojiPickerBg: 'rgba(32, 32, 38, 0.92)',
    slotBg: 'rgba(255, 255, 255, 0.08)',
    slotBorder: 'rgba(255, 255, 255, 0.08)',
    slotActiveBg: 'rgba(90, 200, 250, 0.22)',
    slotActiveBorder: 'rgba(90, 200, 250, 0.18)',
    electronBg: '#121216',
  },
};

const THEME_LABELS: Record<ThemeId, string> = {
  dark: 'Dark',
  light: 'Light',
  glass: 'Glass',
};

const STORAGE_KEY = 'windowbundler-theme';

interface ThemeContextValue {
  theme: ThemeId;
  colors: ThemeColors;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  colors: THEMES.dark,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in THEMES) return saved as ThemeId;
    } catch {}
    return 'dark';
  });

  function setTheme(t: ThemeId) {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  const colors = THEMES[theme];

  // Apply CSS variables to root so global.css can use them
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', colors.bg);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-tertiary', colors.textTertiary);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--scroll-thumb', colors.scrollThumb);
    root.style.setProperty('--scroll-thumb-hover', colors.scrollThumbHover);
    root.style.setProperty('--selection-bg', colors.selectionBg);
    root.style.setProperty('--selection-color', colors.selectionColor);
    root.style.setProperty('--select-option-bg', colors.selectOptionBg);
    root.style.setProperty('--btn-primary-bg', colors.btnPrimaryBg);
    root.style.setProperty('--btn-primary-hover-bg', colors.btnPrimaryHoverBg);
    root.style.setProperty('--btn-primary-shadow', colors.btnPrimaryShadow);
    root.style.setProperty('--btn-glass-bg', colors.btnGlassBg);
    root.style.setProperty('--btn-glass-hover-bg', colors.btnGlassHoverBg);
    root.style.setProperty('--btn-glass-border', colors.btnGlassBorder);
    root.style.setProperty('--btn-glass-color', colors.btnGlassColor);

    // Set background on body
    document.body.style.background = colors.bg;
    document.body.style.color = colors.textPrimary;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { THEMES, THEME_LABELS };
export type { ThemeId as Theme };
