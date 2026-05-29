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
        ink: 'rgb(var(--color-ink) / <alpha-value>)', // primary text
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)', // secondary text
        line: 'rgb(var(--color-line) / <alpha-value>)', // borders / hairlines
      },
      fontFamily: {
        // Confident, premium type. Falls back to system stack.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
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
