/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#003c89',
          900: '#003c89',
          800: '#0750ad',
          700: '#1264cc',
        },
        blue: {
          50: '#edf5ff',
          100: '#d7e9ff',
          200: '#afd2ff',
          300: '#7db5ff',
          400: '#4591f3',
          500: '#176fd8',
          600: '#0056bd',
          700: '#003c89',
          800: '#033572',
          900: '#062f60',
          950: '#031b38',
        },
        limebrand: '#b7c72c',
        goldbrand: '#b7c72c',
      },
      boxShadow: {
        card: '0 16px 45px rgba(0, 60, 137, 0.08)',
        glow: '0 10px 30px rgba(183, 199, 44, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
