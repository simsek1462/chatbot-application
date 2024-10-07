/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Silkscreen', 'sans-serif'], // Başlık için font
        body: ['Lora', 'monospace'], // Normal yazılar için font
      },
    },
  },
  plugins: [],
}