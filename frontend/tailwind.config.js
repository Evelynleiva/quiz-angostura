/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'angostura-turquesa': '#0891B2',
        'angostura-verde': '#059669',
        'angostura-amarillo': '#F59E0B',
        'angostura-cielo': '#BAE6FD',
        'angostura-gris': '#1F2937',
        'quibar-naranja': '#FF6B35',
        'quibar-cafe': '#8B4513',
      },
      animation: {
        // Animaciones generales
        wiggle: 'wiggle 0.9s ease-in-out infinite',
        'float-soft': 'float-soft 2.5s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1.1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',

        // Animaciones especiales para Quibar
        'idle-quibar': 'idle-quibar 2s ease-in-out infinite',
        'quibar-celebra': 'quibar-celebra 1.4s ease-in-out infinite',
        'quibar-entrada': 'quibar-entrada 0.8s ease-out forwards',
      },
      keyframes: {
        // Ligero bamboleo
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        // Flotación suave
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Rebote suave
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },

        // Idle de Quibar (mucho movimiento tipo personaje)
        'idle-quibar': {
          '0%':   { transform: 'translateY(0) scale(1) rotate(0deg)' },
          '12%':  { transform: 'translateY(-12px) scale(1.06) rotate(-6deg)' },
          '25%':  { transform: 'translateY(0) scale(1.02) rotate(3deg)' },
          '37%':  { transform: 'translateY(-8px) scale(1.04) rotate(-4deg)' },
          '50%':  { transform: 'translateY(0) scale(1.01) rotate(2deg)' },
          '62%':  { transform: 'translateY(-10px) scale(1.05) rotate(-3deg)' },
          '75%':  { transform: 'translateY(0) scale(1.02) rotate(2deg)' },
          '87%':  { transform: 'translateY(-6px) scale(1.03) rotate(-2deg)' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
        },

        // Animación de celebración (para estados de triunfo)
        'quibar-celebra': {
          '0%':   { transform: 'translateY(0) scale(1) rotate(0deg)' },
          '15%':  { transform: 'translateY(-14px) scale(1.08) rotate(-8deg)' },
          '30%':  { transform: 'translateY(0) scale(1.03) rotate(6deg)' },
          '45%':  { transform: 'translateY(-16px) scale(1.1) rotate(-6deg)' },
          '60%':  { transform: 'translateY(0) scale(1.04) rotate(4deg)' },
          '75%':  { transform: 'translateY(-10px) scale(1.06) rotate(-4deg)' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
        },

        // Entrada desde abajo con zoom
        'quibar-entrada': {
          '0%': {
            opacity: 0,
            transform: 'translateY(40px) scale(0.8)',
          },
          '60%': {
            opacity: 1,
            transform: 'translateY(-8px) scale(1.05)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
