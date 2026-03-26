/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgba(18, 18, 20, 0.85)',
          1: 'rgba(28, 28, 32, 0.80)',
          2: 'rgba(44, 44, 50, 0.70)',
          3: 'rgba(58, 58, 66, 0.60)',
        },
        glass: {
          bg: 'rgba(22, 22, 26, 0.75)',
          light: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.06)',
        },
        accent: {
          DEFAULT: '#0A84FF',
          hover: '#409CFF',
          muted: 'rgba(10, 132, 255, 0.15)',
          glow: 'rgba(10, 132, 255, 0.20)',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.92)',
          secondary: 'rgba(255, 255, 255, 0.55)',
          tertiary: 'rgba(255, 255, 255, 0.30)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          active: 'rgba(255, 255, 255, 0.18)',
        },
        success: '#30D158',
        danger: '#FF453A',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 0.5px 0 rgba(255, 255, 255, 0.06)',
        'glass-sm': '0 2px 12px rgba(0, 0, 0, 0.25), inset 0 0.5px 0 rgba(255, 255, 255, 0.04)',
        card: '0 1px 4px rgba(0, 0, 0, 0.30), inset 0 0.5px 0 rgba(255, 255, 255, 0.04)',
        glow: '0 0 24px rgba(10, 132, 255, 0.20)',
        'btn': '0 1px 3px rgba(0, 0, 0, 0.30), inset 0 0.5px 0 rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        glass: '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(10, 132, 255, 0.15)' },
          '50%': { boxShadow: '0 0 28px rgba(10, 132, 255, 0.30)' },
        },
      },
    },
  },
  plugins: [],
};
