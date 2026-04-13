/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        customPrimary: {
          50: '#f4f7f4',
          100: '#e5eee6',
          200: '#ceddcf',
          300: '#adc4af',
          400: '#85a489',
          500: '#658a6b', // 핵심 포인트 컬러
          600: '#4e6d53',
          700: '#3f5743',
          800: '#344637',
          900: '#2c3b2f',
        },
        secondary: {
          50: '#f9f8f4', // 메인 배경색
          100: '#f1efe6',
          200: '#e2dec9',
          300: '#cdc3a1',
          400: '#b4a578',
        },
        customGray: {
          50: '#f9f9f9',
          100: '#f2f2f1',
          200: '#e5e5e2',
          300: '#d4d4cf',
          400: '#a3a39d',
          500: '#73736d',
          900: '#1a1a18',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
      },
    },
  },
}
