/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f7f4',
        canvasSoft: '#fafaf7',
        ink: '#26251e',
        body: '#5a5852',
        muted: '#807d72',
        mutedSoft: '#a09c92',
        primary: '#f54e00',
        primaryActive: '#d04200',
        surface: '#ffffff',
        surfaceStrong: '#e6e5e0',
        hairline: '#e6e5e0',
        hairlineSoft: '#efeee8',
        hairlineStrong: '#cfcdc4',
        thinking: '#dfa88f',
        grep: '#9fc9a2',
        read: '#9fbbe0',
        edit: '#c0a8dd',
        done: '#c08532',
        success: '#1f8a65',
        error: '#cf2d56'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace']
      },
      boxShadow: {
        none: 'none'
      }
    }
  },
  plugins: []
}
