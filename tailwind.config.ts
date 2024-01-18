import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%', // add required value here
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          100: '#03045e',
          200: '#023e8a',
          300: '#0077b6',
          400: '#0096c7',
          500: '#00b4d8',
          600: '#48cae4',
          700: '#90e0ef',
          800: '#ade8f4',
          900: '#caf0f8',
        },
      }
    },
  },
}
export default config
