/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090E',
        surface: '#111318',
        'surface-elevated': '#1A1D26',
        border: '#252836',
        'border-subtle': '#1C1F2E',
        'text-primary': '#F0F2FF',
        'text-secondary': '#8B8FA8',
        'text-muted': '#52566A',
        'accent-blue': '#3B6EEA',
        'accent-purple': '#7C3AED',
        'accent-teal': '#0D9488',
        'accent-amber': '#D97706',
        'success-green': '#10B981',
        'danger-red': '#EF4444',
        'warning-amber': '#F59E0B',
        'escalated-orange': '#F97316'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
