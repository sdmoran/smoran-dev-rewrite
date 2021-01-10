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
            indigo: colors.indigo,
            'header': '#818cf8', // Same as indigo-400 color, but more configurable this way
            'primary': '#1f2937'
        },
      },
    },
    variants: {},
    plugins: [],
  }