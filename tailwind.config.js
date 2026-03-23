/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgba(255, 255, 255, 0.02)',
          1: 'rgba(255, 255, 255, 0.04)',
          2: 'rgba(255, 255, 255, 0.07)',
          3: 'rgba(255, 255, 255, 0.10)',
        },
        glass: {
          bg: 'rgba(30, 30, 35, 0.72)',
          light: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
        accent: {
          DEFAULT: '#007AFF',
          hover: '#0A84FF',
          muted: 'rgba(0, 122, 255, 0.15)',
          glow: 'rgba(0, 122, 255, 0.25)',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.92)',
          secondary: 'rgba(255, 255, 255, 0.55)',
          tertiary: 'rgba(255, 255, 255, 0.30)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          active: 'rgba(255, 255, 255, 0.16)',
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
        glass: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-sm': '0 2px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        card: '0 4px 24px rgba(0, 0, 0, 0.25), 0 0 0 0.5px rgba(255, 255, 255, 0.06)',
        glow: '0 0 24px rgba(0, 122, 255, 0.2), 0 0 8px rgba(0, 122, 255, 0.1)',
        'btn': '0 1px 3px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
          '50%': { opacity: '0.7' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 122, 255, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 122, 255, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
