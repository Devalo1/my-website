import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/lupul-si-corbul/',
  
  // Ensure all static assets are properly served
  publicDir: 'public',
  
  // Adăugăm suport pentru fișierele statice (HTML, imagini, etc.)
  assetsInclude: ['**/*.html', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.mp3', '**/*.wav'],
  
  // Optimizări pentru build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    // Asigurăm că toate fișierele statice sunt copiate corect
    copyPublicDir: true,
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  },
  
  // Rezolvăm problemele cu rutarea SPA
  server: {
    port: 3000,
    open: true,
    cors: true,
    strictPort: true,
    host: true,
    historyApiFallback: true
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'antd'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});