import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        buttonPrimaryBg: '#7F56D9',
        buttonSecondaryFg: '#344054',
        textTertiary: '#475467',
      },
    },
  },
  plugins: [],
} satisfies Config;
