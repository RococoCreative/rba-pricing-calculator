/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ----------------------------------------------------------------------
      // BRAND TOKENS (placeholder palette — swap these later)
      // These map to CSS variables defined in src/index.css so the whole
      // palette can be re-themed in one place without touching components.
      // ----------------------------------------------------------------------
      colors: {
        base: 'rgb(var(--color-base) / <alpha-value>)', // dark page background
        surface: 'rgb(var(--color-surface) / <alpha-value>)', // card background
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)', // raised card
        accent: 'rgb(var(--color-accent) / <alpha-value>)', // single accent color
        'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
        'on-accent': 'rgb(var(--color-on-accent) / <alpha-value>)', // text/icons on accent fills
        ink: 'rgb(var(--color-ink) / <alpha-value>)', // primary text
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)', // secondary text
        line: 'rgb(var(--color-line) / <alpha-value>)', // borders / hairlines
      },
      fontFamily: {
        // RBA brand type: body = Helvetica Neue LT Pro, headings = Proxima Nova.
        // Real fonts load via Adobe Fonts (see index.html); fallbacks approximate.
        sans: ['helvetica-neue-lt-pro', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['proxima-nova', 'Montserrat', '"Helvetica Neue"', 'sans-serif'],
      },
      borderRadius: {
        // Echoes the brand's tight 4px radius (cards a touch softer at 8px).
        xl2: '0.5rem',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
