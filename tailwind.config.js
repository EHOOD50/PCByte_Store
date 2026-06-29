/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
        '150': '150',
        '200': '200', // <--- Añadimos el nivel 200
      },
      spacing: {
        '100': '25rem', // Esto equivale a 400px (100 * 4px)
      }
    },
  },
  plugins: [],
}