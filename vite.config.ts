import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Reminder: Dacă portul 5208 este ocupat, Vite va alege alt port pentru rulare
  server: {
    host: 'localhost', // Rulează numai pe localhost
    port: 5208,        // Portul dorit
    strictPort: false, // Permite fallback la alt port dacă 5208 e ocupat
  },
  base: '/my-website/', // Baza URL-ului site-ului
  plugins: [react()],
});