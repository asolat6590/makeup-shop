import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          50: '#FDF8F9',
          100: '#FAF0F3',
          200: '#F5DEE6',
          300: '#ECC2D0',
          400: '#DE9BB2',
          500: '#CA6B8B',
          600: '#B2496E',
          700: '#943657',
          800: '#7B2F49',
          900: '#401322',
        },
        nude: {
          50: '#FDFBF7',
          100: '#F9F5EE',
          200: '#F2E9DE',
          300: '#E6D7C5',
          400: '#D5BDA6',
          500: '#BC9D82',
          600: '#A48267',
          700: '#866750',
          800: '#68503E',
          900: '#2A1F18',
        },
        champagne: {
          light: '#F8F5F0',
          DEFAULT: '#EFE9DE',
          dark: '#DACDBB',
        },
        luxury: {
          dark: '#1C1619',
          charcoal: '#282125',
          muted: '#71656A',
          border: '#EFE7E9',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(202, 107, 139, 0.08)',
        'card': '0 10px 30px -4px rgba(40, 33, 37, 0.05)',
        'hover': '0 20px 40px -10px rgba(202, 107, 139, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
