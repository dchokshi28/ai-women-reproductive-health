/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette
        'rq-primary':   '#F7CAD0',   // Rose Quartz
        'rq-secondary': '#FFDDE2',   // Soft Pink
        'rq-accent':    '#E87A9A',   // Deep Rose
        'rq-bg':        '#FFF9FA',   // Warm White
        'rq-text':      '#3A3A3A',   // Charcoal
        'rq-sub':       '#5A5052',   // Secondary text
        'rq-muted':     '#8C7A7F',   // Helper text
        'rq-border':    '#EED9DE',   // Borders
        'rq-mint':      '#DFF3EA',   // Micro accent (success)
        'rq-card':      '#FFFFFF',
        // Legacy aliases so nothing breaks
        'mint':          '#F7CAD0',
        'mint-light':    '#FFF1F4',
        'blush':         '#FFDDE2',
        'rose':          '#E87A9A',
        'slate':         '#3A3A3A',
        'deep-pink':     '#E87A9A',
        'soft-pink':     '#FFDDE2',
        'deep-lavender': '#E87A9A',
        'soft-lavender': '#FFF1F4',
        'app-bg':        '#FFF9FA',
        'primary':       '#F7CAD0',
        'secondary':     '#FFDDE2',
        'accent':        '#E87A9A',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: { '18': '18px', '24': '24px' },
      boxShadow: {
        'card':  '0 10px 25px rgba(0,0,0,0.04)',
        'card-hover': '0 14px 28px rgba(0,0,0,0.06)',
        'btn':   '0 4px 14px rgba(232,122,154,0.30)',
      },
      animation: {
        'slide-up':   'slide-up 0.45s ease-out both',
        'fade-in':    'fade-in 0.35s ease-out both',
        'pulse-dot':  'pulse-dot 1.2s ease-in-out infinite',
        'heartbeat':  'heartbeat 1.4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'logo-fade':  'logo-fade 2.8s ease-in-out forwards',
      },
      keyframes: {
        'slide-up':   { '0%': { opacity:'0', transform:'translateY(16px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        'fade-in':    { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        'pulse-dot':  { '0%,100%': { transform:'scale(1)', opacity:'0.6' }, '50%': { transform:'scale(1.4)', opacity:'1' } },
        'heartbeat':  { '0%,100%': { transform:'scale(1)' }, '14%': { transform:'scale(1.15)' }, '28%': { transform:'scale(1)' }, '42%': { transform:'scale(1.1)' }, '70%': { transform:'scale(1)' } },
        'glow-pulse': { '0%,100%': { boxShadow:'0 0 0 0 rgba(247,202,208,0.5)' }, '50%': { boxShadow:'0 0 0 16px rgba(247,202,208,0)' } },
        'logo-fade':  { '0%': { opacity:'0', transform:'scale(0.88)' }, '40%': { opacity:'1', transform:'scale(1)' }, '80%': { opacity:'1', transform:'scale(1)' }, '100%': { opacity:'0', transform:'scale(1.04)' } },
      },
    },
  },
  plugins: [],
}
