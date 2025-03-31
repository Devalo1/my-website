import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      // Add external dependencies here to avoid bundling issues
      external: ['vite']
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/' : '/my-website/',
  server: {
    port: 3000,
    open: true,
  }
});