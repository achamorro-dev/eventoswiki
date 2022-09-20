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
        light: colors.emerald[200],
        DEFAULT: colors.emerald[400],
        dark: colors.emerald[600],
      },
    },
  },

  plugins: [require("@tailwindcss/line-clamp")],
};
