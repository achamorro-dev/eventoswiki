const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  darkMode: 'class',
  theme: {
    colors: {
      ...colors,
      primary: {
        light: colors.indigo[300],
        DEFAULT: colors.indigo[500],
        dark: colors.indigo[800],
      },
      accent: {
        DEFAULT: colors.green[400],
      },
    },
  },

  plugins: [require('@tailwindcss/line-clamp')],
}
