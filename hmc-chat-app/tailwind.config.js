module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Make sure this includes your React files
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#FFD700',
          600: '#FFCC00',
          700: '#FFB800',
          800: '#FFA000',
        },
      },
    },
  },
  plugins: [],
}
