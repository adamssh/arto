/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#D1DAD7',
        surface: '#FAFAF7',
        cream: '#F2EEE2',
        primary: '#678770',
        'primary-dark': '#557561',
        sage: '#8FA99A',
        beige: '#D9D5B8',
        income: '#678770',
        expense: '#B87568',
        'text-primary': '#303632',
        'text-secondary': '#7B817C',
      },
      borderRadius: {
        'xl2': '20px',
        '2xl': '24px' // Adding another for options
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(85, 117, 97, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
