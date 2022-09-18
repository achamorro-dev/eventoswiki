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
        DEFAULT: '#6089D3',
        dark: colors.indigo[800],
      },
      accent: {
        light: colors.green[200],
        DEFAULT: colors.green[400],
        dark: colors.green[600],
      },
    },
  },

  plugins: [require('@tailwindcss/line-clamp')],
}
