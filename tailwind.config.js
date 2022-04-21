module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        25: 'repeat(25, minmax(0, 1fr))',
        50: 'repeat(50, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
