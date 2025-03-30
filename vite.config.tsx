import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-website/', // Setează baza pentru GitHub Pages
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html', // Asigură-te că index.html este punctul de intrare
      },
      output: {
        assetFileNames: 'assets/[name].[ext]', // Controlează structura fișierelor în build
      },
    },
  },
});
