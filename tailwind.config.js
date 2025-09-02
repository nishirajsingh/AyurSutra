/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayur: {
          primary: '#2D5016',
          secondary: '#4A7C59',
          accent: '#8FBC8F',
          light: '#E8F5E8',
          earth: '#8B4513',
          gold: '#DAA520'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}