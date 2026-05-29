/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        edge: 'var(--color-edge)',
        ink: 'var(--color-ink)',
        dim: 'var(--color-dim)',
        accent: 'var(--color-accent)',
      },
    },
  },
  plugins: [],
};
