import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/',
  build: {
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    host: true,
    port: 3000
  }
})