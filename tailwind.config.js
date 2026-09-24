/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
        },
        base: {
          DEFAULT: "var(--color-bg-base)",
          card: "var(--color-bg-card)",
          surface: "var(--color-bg-surface)",
        },
        main: "var(--color-text-main)",
        muted: "var(--color-text-muted)",
        gold: {
          DEFAULT: "var(--color-gold)",
          light: "var(--color-gold-light)",
          dark: "var(--color-gold-dark)",
        },
      },
      fontFamily: {
        serif: ['"Shippori Mincho B1"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Josefin Sans"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      fontSize: {
        // Minor Third (1.200) Type Scale - Typescale.com (Base 16px)
        'scale-h1': ['47.78px', { lineHeight: '1.15' }],
        'scale-h2': ['39.81px', { lineHeight: '1.2' }],
        'scale-h3': ['33.18px', { lineHeight: '1.25' }],
        'scale-h4': ['27.65px', { lineHeight: '1.3' }],
        'scale-h5': ['23.04px', { lineHeight: '1.35' }],
        'scale-h6': ['19.2px', { lineHeight: '1.4' }],
        'scale-p': ['16px', { lineHeight: '1.6' }],
        'scale-small': ['13.33px', { lineHeight: '1.5' }],
        'scale-xs': ['11.11px', { lineHeight: '1.4' }],
        'scale-2xs': ['11.11px', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'luxury': '0 20px 40px -15px rgba(19, 34, 56, 0.12)',
        'glow': '0 0 25px rgba(197, 168, 128, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
      },
    },
  },
  plugins: [],
}
