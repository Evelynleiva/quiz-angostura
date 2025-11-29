/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'angostura-turquesa': '#00A9CE',
        'angostura-verde': '#6B9F3E',
        'angostura-amarillo': '#FDB813',
        'angostura-cielo': '#87CEEB',
        'angostura-gris': '#4A4A4A',
        'quibar-naranja': '#FF6B35',
        'quibar-cafe': '#8B4513',
      },
    },
  },
  plugins: [],
}