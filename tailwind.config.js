/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#FFFFFF',
          1: '#F5F5F7',
          2: '#EBEBEE',
          3: '#E0E0E5',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.82)',
          light: 'rgba(255, 255, 255, 0.95)',
          border: 'rgba(0, 0, 0, 0.06)',
          hover: 'rgba(0, 0, 0, 0.04)',
        },
        accent: {
          DEFAULT: '#007AFF',
          hover: '#0A84FF',
          muted: 'rgba(0, 122, 255, 0.10)',
          glow: 'rgba(0, 122, 255, 0.15)',
        },
        text: {
          primary: '#1D1D1F',
          secondary: '#6E6E73',
          tertiary: '#AEAEB2',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          active: 'rgba(0, 0, 0, 0.15)',
        },
        success: '#34C759',
        danger: '#FF3B30',
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
        glass: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.05)',
        'glass-sm': '0 2px 12px rgba(0, 0, 0, 0.06), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
        glow: '0 0 24px rgba(0, 122, 255, 0.12)',
        'btn': '0 1px 2px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
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
          '0%, 100%': { boxShadow: '0 0 16px rgba(0, 122, 255, 0.10)' },
          '50%': { boxShadow: '0 0 24px rgba(0, 122, 255, 0.20)' },
        },
      },
    },
  },
  plugins: [],
};
