/**
 * Tailwind CSS configuration — Christ Light Media design tokens & animations.
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        gold: '#C8A24A',
        'gold-dark': '#B38A3D',
        bg: '#0A0A0A',
        surface: '#121212',
        card: '#1A1A1A',
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        divineGlow: {
          '0%, 100%': { opacity: '0.5', filter: 'blur(100px)' },
          '50%': { opacity: '0.8', filter: 'blur(120px)' },
        },
        lightReveal: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(200,162,74,0)' },
          '50%': { boxShadow: '0 0 20px rgba(200,162,74,0.3)' },
        },
        textShine: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        pulseLive: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        divineGlow: 'divineGlow 10s ease-in-out infinite',
        lightReveal: 'lightReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        goldPulse: 'goldPulse 3s ease-in-out infinite',
        textShine: 'textShine 3s linear infinite',
        pulseLive: 'pulseLive 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
