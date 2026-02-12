/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'umi-bg': '#0a0a14',
        'umi-card': '#12121e',
        'umi-sidebar': '#0e0e1a',
        'umi-input': '#1a1a2e',
        'umi-border': '#2a2a3e',
        'umi-gold': '#d4a843',
        'umi-primary': '#7c5cbf',
        'umi-primary-light': '#9b7ed8',
        'umi-primary-dark': '#5a3d9e',
        'umi-green': '#22c55e',
        'umi-red': '#ef4444',
        'umi-orange': '#f97316',
        'umi-text': '#e8e8f0',
        'umi-muted': '#8888a8',
        'umi-dim': '#555570',
      },
      fontFamily: {
        'system': ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
