import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '/app/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#ff204e',
          secondary: '#a0153e',
          accent: '#5d0e41',
          'secondary-light': '#ff4d6d',
           neutral: '#00224d',
          'neutral-light': 'rgba(0, 34, 77, 0.8)',
          'base-100': '#ffffff',
          info: '#0ea5e9',
          success: '#22c55e',
          warning: '#fde047',
          error: '#dc2626',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
export default config;
