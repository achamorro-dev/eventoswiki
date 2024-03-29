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
        foreground: colors.white,
      },
      accent: {
        light: colors.rose[400],
        DEFAULT: colors.rose[900],
        dark: colors.rose[800],
        foreground: colors.white,
      },
      background: {
        light: colors.gray[100],
        DEFAULT: colors.white,
        dark: {
          DEFAULT: colors.slate[900],
          light: colors.slate[800],
        },
      },
      foreground: {
        DEFAULT: colors.black,
        dark: colors.white,
      },
      menu: {
        background: colors.zinc[100],
        dark: {
          DEFAULT: colors.slate[800],
          foreground: colors.white,
        },
        foreground: colors.black,
      },
    },
  },
}
