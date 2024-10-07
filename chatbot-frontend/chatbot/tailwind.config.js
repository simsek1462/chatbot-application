/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Silkscreen', 'sans-serif'], 
        body: ['Lora', 'monospace'],
      },
    },
  },
  plugins: [],
}