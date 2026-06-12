/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#06142f',
          900: '#081b3d',
          800: '#0c2855',
          700: '#123971',
        },
        limebrand: '#b9ef2f',
        goldbrand: '#d9ad4f',
      },
      boxShadow: {
        card: '0 16px 45px rgba(8, 27, 61, 0.08)',
        glow: '0 10px 30px rgba(185, 239, 47, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
