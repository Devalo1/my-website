// filepath: c:\Proiect\my-website\vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/',  // Necesar pentru GitHub Pages
  server: {
    // Acest lucru va asigura că în dezvoltare locală, calea de bază este aceeași
    base: '/my-website/'
  }
})