/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  colors: {
    lightBackground: '#FFFEF8',
    pinkAccent: '#F977CA',
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
    'bg-gray-600',
    'text-white',
    'text-black',
    'uppercase',
    'm-auto',
    'mt-5',
    'p-1',
    'rounded-md',
  ],
  darkMode: 'class',
}

