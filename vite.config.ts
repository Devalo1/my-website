// filepath: c:\Proiect\my-website\vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Folosim un singur mod de a defini baza
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.BASE_PATH || '/my-website/') 
    : '/',
  build: {
    assetsInlineLimit: 0, // Asigură că toate fișierele sunt emise ca fișiere separate
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    host: true,
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  publicDir: 'public'
})