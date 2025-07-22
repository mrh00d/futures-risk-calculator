/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./calculator.js",
    "!./node_modules/**/*"
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}