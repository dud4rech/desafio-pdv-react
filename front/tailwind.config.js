/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        'white': '#fff',
        'purple': '#637eff',
        'light-blue': '#148cfc',
        'dark-blue': '#273266',
        'black': '#292626',
      },
      fontFamily: {
        custom: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}

