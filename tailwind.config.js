/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rpg-dark': '#0b0f1a',
        'rpg-accent': '#8b5cf6',
      },
      animation: {
        'fog': 'fog-drift 10s ease-in-out infinite',
      },
      keyframes: {
        'fog-drift': {
          '0%, 100%': { opacity: 0.3, transform: scale(1) },
          '50%': { opacity: 0.6, transform: scale(1.05) },
        }
      }
    },
  },
  plugins: [],
}