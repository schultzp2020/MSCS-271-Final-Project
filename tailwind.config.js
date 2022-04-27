module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        25: 'repeat(25, minmax(0, 1fr))',
        50: 'repeat(50, minmax(0, 1fr))',
        100: 'repeat(100, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
  safelist: ['grid-cols-10', 'grid-cols-25', 'grid-cols-50', 'grid-cols-100'],
};
