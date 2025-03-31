import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/', // Required for GitHub Pages
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services')
    }
  },
  server: {
    open: true, // Automatically open browser
    port: 3000, // Default port
    strictPort: false, // Allow fallback to another port if in use
    host: true, // Listen on all network interfaces
    cors: true // Enable CORS for all requests
  },
  preview: {
    port: 4173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})