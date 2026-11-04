import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070A12',
        panel: '#0D1220',
        gold: '#E3B65A',
        'gold-hot': '#F5D38A',
        ivory: '#F3EEE4',
        muted: '#9AA3B5',
        line: 'rgba(227,182,90,0.14)',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.18em',
        tightest: '-0.03em',
      },
      maxWidth: {
        site: '84rem',
      },
      boxShadow: {
        panel: '0 30px 80px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(243,238,228,0.03)',
        gold: '0 0 0 1px rgba(227,182,90,0.35), 0 18px 40px -20px rgba(227,182,90,0.45)',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
