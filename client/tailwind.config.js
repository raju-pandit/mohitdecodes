/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary = Electric Blue (CoderArmy style)
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Cyan accent (neon glow)
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Dark navy backgrounds
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#334155',
          700: '#1e293b',
          800: '#111827',
          900: '#0d1117',
          950: '#060a12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.04'%3E%3Cpath d='M0 0h40v1H0zM0 0v40h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-in-out',
        'slide-up':     'slideUp 0.5s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'slide-left':   'slideLeft 0.3s ease-out',
        'float':        'float 4s ease-in-out infinite',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient':     'gradient 8s ease infinite',
        'spin-slow':    'spin 3s linear infinite',
        'glow-pulse':   'glowPulse 2.5s ease-in-out infinite',
        'border-flow':  'borderFlow 3s linear infinite',
        'particle':     'particle 6s ease-in-out infinite',
        'typing':       'typing 3.5s steps(40, end)',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { transform: 'translateY(30px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown:   { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideLeft:   { '0%': { transform: 'translateX(20px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        float:       { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-16px)' } },
        gradient:    { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.3), 0 0 30px rgba(37, 99, 235, 0.15)' },
          '50%':      { boxShadow: '0 0 25px rgba(6, 182, 212, 0.6), 0 0 60px rgba(37, 99, 235, 0.35)' },
        },
        borderFlow: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        particle: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)', opacity: '0.4' },
          '33%':      { transform: 'translate(10px,-15px) scale(1.2)', opacity: '0.8' },
          '66%':      { transform: 'translate(-8px,10px) scale(0.8)', opacity: '0.5' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        typing: {
          '0%':   { width: '0' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'glow':         '0 0 20px rgba(37, 99, 235, 0.5), 0 0 40px rgba(37, 99, 235, 0.2)',
        'glow-cyan':    '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.2)',
        'glow-sm':      '0 0 10px rgba(37, 99, 235, 0.4)',
        'glow-lg':      '0 0 40px rgba(37, 99, 235, 0.6), 0 0 80px rgba(6, 182, 212, 0.2)',
        'card':         '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover':   '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)',
        'neon-blue':    '0 0 5px rgba(37, 99, 235, 0.8), 0 0 20px rgba(37, 99, 235, 0.5), 0 0 40px rgba(37, 99, 235, 0.3)',
        'neon-cyan':    '0 0 5px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
        'inner-glow':   'inset 0 0 30px rgba(6, 182, 212, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderColor: {
        'glow-blue': 'rgba(37, 99, 235, 0.5)',
        'glow-cyan': 'rgba(6, 182, 212, 0.5)',
      }
    },
  },
  plugins: [],
}
