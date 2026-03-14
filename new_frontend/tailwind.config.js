/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-pink': '#EC4899',
        'soft-pink': '#FCE7F3',
        'deep-lavender': '#9333EA',
        'soft-lavender': '#F3E8FF',
      },
    },
  },
  plugins: [],
}
