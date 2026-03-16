/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a1a2e',
        neonPink: '#f9a8d4',
        neonCyan: '#67e8f9',
        surface: '#252238',
        'text-muted': '#94a3b8',
      },
      fontFamily: {
        pixel: ['FZG_CN', 'monospace'],
      },
      boxShadow: {
        panel: '0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset',
      },
    },
  },
  plugins: [],
}
