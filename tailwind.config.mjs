/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'android-blue': '#4285F4',
        'android-dark': '#3367D6',
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Tamil"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
