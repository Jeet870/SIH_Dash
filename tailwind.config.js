/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1d',
        surface: '#111827',
        card: '#1e293b',
        border: '#334155',
        primary: '#38bdf8',
        accent: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
