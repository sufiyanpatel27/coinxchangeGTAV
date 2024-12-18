/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3067F0',
          dark: '#2D3446',
        },
        secondary: {
          DEFAULT: 'white',
          dark: '#1E2433',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

