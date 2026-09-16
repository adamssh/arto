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
        surface: '#FFFFFF',
        cream: '#F2EEE2',
        primary: '#678770',
        'primary-dark': '#557561',
        sage: '#8FA99A',
        beige: '#D9D5B8',
        income: '#678770',
        expense: '#B87568',
        'text-primary': '#303632',
        'text-secondary': '#7B817C',
        'pastel-red': '#FFB3BA',
        'pastel-orange': '#FFDFBA',
        'pastel-green': '#BAFFC9',
        'pastel-blue': '#BAE1FF',
        'pastel-purple': '#D5AAFF',
        'pastel-pink': '#FFC4E1',
        'pastel-teal': '#A2E1DB',
        'pastel-peach': '#FFD3B6',
        'pastel-lavender': '#E6B3FF',
      },
      borderRadius: {
        'xl2': '20px',
        '2xl': '24px'
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(85, 117, 97, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  safelist: [
    'bg-primary',
    'bg-sage',
    'bg-beige',
    'bg-expense',
    'bg-cream',
    'bg-primary-dark',
    'bg-pastel-red',
    'bg-pastel-orange',
    'bg-pastel-green',
    'bg-pastel-blue',
    'bg-pastel-purple',
    'bg-pastel-pink',
    'bg-pastel-teal',
    'bg-pastel-peach',
    'bg-pastel-lavender',
  ],
  plugins: [],
}
