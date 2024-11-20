const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
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
        border: {
          DEFAULT: colors.gray[300],
          dark: colors.white,
        },
        label: {
          DEFAULT: colors.zinc[900],
          dark: {
            DEFAULT: colors.white,
          },
        },
        placeholder: {
          DEFAULT: colors.gray[400],
          dark: colors.gray[600],
        },
        input: {
          DEFAULT: colors.white,
          dark: {
            DEFAULT: colors.slate[800],
          },
        },
        'input-foreground': {
          DEFAULT: colors.black,
          dark: colors.white,
        },
        caption: {
          DEFAULT: colors.zinc[500],
          dark: colors.zinc[400],
        },
        backdrop: {
          DEFAULT: colors.black,
        },
        error: {
          DEFAULT: colors.red[500],
          dark: colors.red[400],
        },
      },
    },
  },
}
