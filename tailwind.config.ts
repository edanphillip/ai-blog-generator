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

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
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
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        text: 'text 5s ease infinite',
        shake: 'shake 10s linear infinite',
        movetext: 'movetext 0.75s forwards',
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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    themes: ["forest"],
  },
}
export default config
