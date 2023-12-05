import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      keyframes: {
        moveright: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        moveright: 'moveright 0.2s ease-in-out',
      },
    },
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('daisyui')],
  // TODO add daisyui themes
};
export default config;
