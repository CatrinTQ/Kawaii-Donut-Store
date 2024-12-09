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
    'scale-100',
    'scale-125',
    'transition-transform', 
    'transform',
    'bg-yellow-400',
    'bg-red-400',
    'w-20',
    'rounded-md',
    'hover:bg-yellow-100',
    'pt-5',
    'pb-5',
    'dark:hover:bg-gray-500',
  ],
  darkMode: 'class',
}

