const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",
  theme: {
    colors: {
      ...colors,
      primary: {
        light: colors.indigo[300],
        DEFAULT: colors.indigo[700],
        dark: colors.indigo[900],
      },
      accent: {
        light: colors.rose[400],
        DEFAULT: colors.rose[600],
        dark: colors.rose[800],
      },
    },
  },

  plugins: [require("@tailwindcss/line-clamp")],
};
