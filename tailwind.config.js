const colors = require('tailwindcss/colors')

module.exports = {
    purge: [],
    theme: {
      extend: {
        fontFamily: {
            sans: ['Lato', 'sans-serif'],
            heading: ['Oswald', 'sans-serif']
        },
        colors: {
            amber: colors.amber,
            indigo: colors.indigo
        },
      },
    },
    variants: {},
    plugins: [],
  }