module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      flex: {
        left: '1 0 60%',
        right: '1 0 40%'
      },
      colors: {
        background: '#232323',
        buttonHover: '#2d2d2d',
        primary: '#E2E2E2'
      },
      fontFamily: {
        monospace: 'monospace'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
