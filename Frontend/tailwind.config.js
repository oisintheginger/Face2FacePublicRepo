/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        'surface-gray': '#f8f8f8',
        thistle: '#e6dbd2',
        primary: {
          800: '#4c282d',
          700: '#6b373f',
          600: '#894751',
          DEFAULT: '#9C515C',
          400: '#a85763',
          300: '#b8767f',
          200: '#c8949c',
          100: '#d7b3b8',
          50: '#e7d1d4',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('prettier-plugin-tailwindcss'),
  ],
};
