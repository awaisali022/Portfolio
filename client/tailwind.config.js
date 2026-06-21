/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#050508',
          card: 'rgba(13, 13, 20, 0.65)',
          border: 'rgba(255, 255, 255, 0.07)',
          text: '#f3f4f6',
          muted: '#9ca3af'
        },
        light: {
          bg: '#f8fafc',
          card: 'rgba(255, 255, 255, 0.65)',
          border: 'rgba(0, 0, 0, 0.07)',
          text: '#0f172a',
          muted: '#475569'
        },
        accent: {
          primary: '#6366f1', // Indigo
          secondary: '#a855f7', // Purple
          glow: 'rgba(99, 102, 241, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
