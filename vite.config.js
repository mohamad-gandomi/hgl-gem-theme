import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    cssMinify: true,
    manifest: true,
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2018',
    rollupOptions: {
      input: 'index.html'
    }
  }
})
