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
