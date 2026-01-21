/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        dark: {
          primary: '#0D0D0D',
          surface: '#1A1A1A',
          elevated: '#242424',
        },
        // Brand
        gold: {
          DEFAULT: '#F5A623',
          dim: '#B8860B',
          bright: '#FFBF00',
        },
        // Semantic
        danger: {
          DEFAULT: '#FF4757',
          dim: '#C0392B',
        },
        success: {
          DEFAULT: '#2ECC71',
          dim: '#27AE60',
        },
        // Medals
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        // Borders
        border: {
          subtle: '#2A2A2A',
          DEFAULT: '#3A3A3A',
        },
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          muted: '#666666',
        },
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 166, 35, 0.3)',
        'glow-gold-lg': '0 0 30px rgba(245, 166, 35, 0.4)',
        'glow-danger': '0 0 20px rgba(255, 71, 87, 0.3)',
        'glow-danger-lg': '0 0 40px rgba(255, 71, 87, 0.5)',
      },
      animation: {
        'pulse-gold': 'goldPulse 2s ease-in-out infinite',
        'pulse-danger': 'dangerPulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 166, 35, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(245, 166, 35, 0.4)' },
        },
        dangerPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 71, 87, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 71, 87, 0.5)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
