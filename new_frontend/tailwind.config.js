/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#FF9AA2',
        secondary:  '#FFCAD4',
        accent:     '#C94F7C',
        'app-bg':   '#FFF5F7',
        'text-main':'#3A3A3A',
        // keep legacy aliases
        'mint':        '#FFCAD4',
        'mint-light':  '#FFF0F3',
        'blush':       '#FFCAD4',
        'rose':        '#C94F7C',
        'slate':       '#3A3A3A',
        'deep-pink':   '#FF9AA2',
        'soft-pink':   '#FFCAD4',
        'deep-lavender':'#C94F7C',
        'soft-lavender':'#FFF0F3',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)',   opacity: '0.6' },
          '50%':      { transform: 'scale(1.4)', opacity: '1'   },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)'   },
          '100%': { transform: 'rotate(360deg)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)'    },
          '14%':      { transform: 'scale(1.15)' },
          '28%':      { transform: 'scale(1)'    },
          '42%':      { transform: 'scale(1.1)'  },
          '70%':      { transform: 'scale(1)'    },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,154,162,0.4)'  },
          '50%':      { boxShadow: '0 0 0 16px rgba(255,154,162,0)' },
        },
        'logo-fade': {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '40%':  { opacity: '1', transform: 'scale(1)'    },
          '80%':  { opacity: '1', transform: 'scale(1)'    },
          '100%': { opacity: '0', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'slide-up':   'slide-up 0.45s ease-out both',
        'fade-in':    'fade-in 0.35s ease-out both',
        'pulse-dot':  'pulse-dot 1.2s ease-in-out infinite',
        'spin-slow':  'spin-slow 2s linear infinite',
        'heartbeat':  'heartbeat 1.4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'logo-fade':  'logo-fade 2.8s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
