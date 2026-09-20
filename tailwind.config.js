/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0D12",
          navy: "#101826",
          navyDeep: "#0B121C",
          ivory: "#F3F5F8",
          white: "#FFFFFF",
          red: "#E5484D",
          redDeep: "#C23238",
          green: "#3FBF6F",
          purple: "#A78BFA",
          gold: "#D9A441",
          teal: "#4FD1C5",
          storiesBlue: "#5B9BD5",
          footerBg: "#06080B",
        },
        // Page atmosphere (globals.css): follow the scroll-driven dark/light background.
        atmos: {
          DEFAULT: 'var(--atmos-fg)',
          muted: 'var(--atmos-fg-muted)',
          line: 'var(--atmos-line)',
          tint: 'var(--atmos-tint)',
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
