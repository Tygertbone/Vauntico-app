/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vauntico-gold': '#D4AF37',
        'vauntico-gold-hover': '#B8941F',
        'vauntico-pink': '#E91E63',
        'vauntico-dark': '#1a1a1a',
        'vauntico-gray': '#2d2d2d',
        'vauntico-light': '#f8f8f8',
        primary: '#1A1A1A',
        accent: '#FACC15',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'scale-up': 'scaleUp 0.2s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'vauntico-glow': '0 0 10px #D4AF37',
      },
    },
  },
  plugins: [],
}