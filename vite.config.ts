// filepath: c:\Proiect\my-website\vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' 
    ? '/my-website/' 
    : '/',
  build: {
    assetsInlineLimit: 0, // Asigură că toate fișierele sunt emise ca fișiere separate
  },
  server: {
    base: '/my-website/'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  publicDir: 'public'
})