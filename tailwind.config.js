/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d1514',
          dim: '#0d1514',
          bright: '#333b3a',
          lowest: '#08100f',
          low: '#151d1c',
          container: '#192120',
          high: '#232c2a',
          highest: '#2e3635',
          variant: '#2e3635',
        },
        'on-surface': {
          DEFAULT: '#dce4e2',
          variant: '#c1c8c4',
        },
        primary: {
          DEFAULT: '#a8cfc2',
          container: '#173b32',
          dark: '#12362e',
          fixed: '#c4ebde',
        },
        forest: {
          DEFAULT: '#173b32',
          hover: '#1e4e42',
          dark: '#0e241f',
        },
        mountain: {
          DEFAULT: '#263238',
          light: '#3c494f',
          border: 'rgba(120, 183, 201, 0.16)',
        },
        vermilion: {
          DEFAULT: '#a33a2b',
          bright: '#ff5449',
          glow: 'rgba(163, 58, 43, 0.45)',
          container: '#6b1107',
        },
        saffron: {
          DEFAULT: '#d69a32',
          glow: 'rgba(214, 154, 50, 0.4)',
        },
        glacial: {
          DEFAULT: '#78b7c9',
          light: '#a8cfc2',
          glow: 'rgba(120, 183, 201, 0.3)',
        },
        mist: {
          DEFAULT: '#f4f1e8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      backgroundImage: {
        'kath-kuni-pattern': "repeating-linear-gradient(45deg, rgba(120, 183, 201, 0.03) 0px, rgba(120, 183, 201, 0.03) 2px, transparent 2px, transparent 8px)",
        'radar-grid': "radial-gradient(circle, rgba(120, 183, 201, 0.08) 1px, transparent 1px)",
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-vermilion': 'pulseVermilion 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beacon-blink': 'beaconBlink 1s step-start infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseVermilion: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px 2px rgba(163, 58, 43, 0.6)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 8px 0px rgba(163, 58, 43, 0.2)' },
        },
        beaconBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
