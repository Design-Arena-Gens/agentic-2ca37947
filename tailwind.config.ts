import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#12a8ff',
        neonOrange: '#ff7a12',
        darkBg: '#0b0f18',
        darkCard: '#111827'
      },
      boxShadow: {
        neon: '0 0 20px rgba(18, 168, 255, 0.6)',
        neonOrange: '0 0 20px rgba(255, 122, 18, 0.6)'
      }
    }
  },
  plugins: []
} satisfies Config
