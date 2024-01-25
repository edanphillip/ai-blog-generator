import type { Config } from 'tailwindcss'

export const primary = {
  100: '#03045e',
  200: '#023e8a',
  300: '#0077b6',
  400: '#0096c7',
  500: '#00b4d8',
  600: '#48cae4',
  700: '#90e0ef',
  800: '#ade8f4',
  900: '#caf0f8',
}
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      animation: {
        text: 'text 5s ease infinite',
        shake: 'shake 10s linear infinite',
        movetext: 'movetext 0.75s forwards',
      },
      keyframes: {
        movetext: {
          "0%": { bottom: "-0.2em", opacity: "1" },
          "50%": { bottom: "0.2em", opacity: ".75" },
          "100%": { bottom: "0", opacity: "1" }
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)', },
          '50%': { transform: 'translate(2px, 2px)' },
        },
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
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
        primary
      }
    },
  },
}
export default config
