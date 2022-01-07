module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      flex: {
        left: '1 0 60%',
        right: '1 0 40%'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
