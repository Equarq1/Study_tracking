// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Цветовая палитра КФУ
        kfu: {
          blue: {
            50: '#e8f0fe',
            100: '#c5d9f7',
            200: '#a3c2f0',
            300: '#80abec',
            400: '#5e94e8',
            500: '#3b7de4',
            600: '#2f64b6',
            700: '#234b89',
            800: '#18325c',
            900: '#0c192e',
            950: '#060d17',
          },
          gold: {
            50: '#fdf7e8',
            100: '#f9ecc5',
            200: '#f5e1a3',
            300: '#f1d680',
            400: '#edcb5e',
            500: '#e9c03c',
            600: '#ba9a30',
            700: '#8c7324',
            800: '#5d4d18',
            900: '#2e260c',
          }
        }
      },
      fontFamily: {
        'kfu': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'kfu-gradient': 'linear-gradient(135deg, #0c192e 0%, #18325c 50%, #234b89 100%)',
        'kfu-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b7de4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}