import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-website/',
  server: {
    port: 3000,
  },
  build: {
    assetsInclude: ['**/*.jpg', '**/*.jpeg'], // Include fișierele JPG/JPEG
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
