/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    extend: {
      colors: {
        brand: { DEFAULT: '#E8731E', dark: '#1A3A5C', light: '#E8F0F8' },
        sand: '#F6F2ED',
        cream: '#FDFBF7',
        'text-main': '#1A1A1A',
        'text-muted': '#6B7280'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif']
      },
      borderRadius: { card: '16px' }
    }
  },
  plugins: []
};
