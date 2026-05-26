/**
 * Tailwind CSS configuration — Christ Light Media enhanced design system.
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
        padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      },
      colors: {
        gold:        '#C8A24A',
        'gold-dark': '#B38A3D',
        'gold-light':'#E6D5A8',
        bg:          '#0A0A0A',
        surface:     '#111111',
        card:        '#181818',
        'card-hover':'#202020',
        border:      'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'Georgia', 'serif'],
        inter:  ['var(--font-inter)',  'Inter',  'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.4em',
      },
      backgroundImage: {
        'gold-gradient':    'linear-gradient(135deg, #C8A24A 0%, #E6D5A8 50%, #B38A3D 100%)',
        'gold-gradient-h':  'linear-gradient(90deg, #C8A24A, #E6D5A8, #C8A24A)',
        'dark-gradient':    'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
        'hero-gradient':    'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,162,74,0.1) 0%, transparent 70%)',
        'card-shine':       'linear-gradient(135deg, rgba(200,162,74,0.06) 0%, transparent 60%)',
      },
      boxShadow: {
        'gold-sm': '0 0 12px rgba(200,162,74,0.15)',
        'gold':    '0 0 30px rgba(200,162,74,0.22)',
        'gold-lg': '0 0 60px rgba(200,162,74,0.18)',
        'gold-xl': '0 0 80px rgba(200,162,74,0.25)',
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-lg': '0 8px 40px rgba(0,0,0,0.5)',
        'inset-gold': 'inset 0 1px 0 rgba(200,162,74,0.15)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-20px) rotate(2deg)' },
        },
        divineGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(90px)' },
          '50%':       { opacity: '0.7', filter: 'blur(110px)' },
        },
        lightReveal: {
          '0%':   { opacity: '0', transform: 'scale(0.92) translateY(24px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(200,162,74,0)' },
          '50%':       { boxShadow: '0 0 28px rgba(200,162,74,0.35)' },
        },
        textShine: {
          '0%':   { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseLive: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':       { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(200,162,74,0.15)' },
          '50%':       { borderColor: 'rgba(200,162,74,0.45)' },
        },
        gradientShift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        revealWidth: {
          from: { width: '0' },
          to:   { width: '100%' },
        },
      },
      animation: {
        float:          'float 6s ease-in-out infinite',
        floatSlow:      'floatSlow 8s ease-in-out infinite',
        divineGlow:     'divineGlow 10s ease-in-out infinite',
        lightReveal:    'lightReveal 1.2s cubic-bezier(0.22,1,0.36,1) forwards',
        fadeUp:         'fadeUp 0.8s ease-out forwards',
        fadeIn:         'fadeIn 0.6s ease-out forwards',
        scaleIn:        'scaleIn 0.5s ease-out forwards',
        goldPulse:      'goldPulse 3s ease-in-out infinite',
        textShine:      'textShine 4s linear infinite',
        pulseLive:      'pulseLive 2s ease-in-out infinite',
        shimmer:        'shimmer 1.8s linear infinite',
        borderGlow:     'borderGlow 3s ease-in-out infinite',
        gradientShift:  'gradientShift 6s ease infinite',
        countUp:        'countUp 0.6s ease-out forwards',
        revealWidth:    'revealWidth 1s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
