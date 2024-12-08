/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'scale-100', // Säkerställ att den normala skalningen behålls
    'scale-125', // Säkerställ att den förstora skalningen behålls
    'transition-transform', // Säkerställ att transitionen för transformering behålls
    'transform', // Säkerställ att transformeringar behålls
    'bg-yellow-400',
    'bg-red-400',
  ],
}

