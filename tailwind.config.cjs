const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  darkMode: 'class',
  theme: {
    colors: {
      ...colors,
      primary: {
        light: colors.rose[500],
        DEFAULT: colors.rose[600],
        dark: colors.rose[800],
      },
      accent: {
        light: colors.rose[400],
        DEFAULT: colors.rose[900],
        dark: colors.rose[800],
      },
    },
  },
}
