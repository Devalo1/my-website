import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Use if you're working with React

export default defineConfig({
  plugins: [react()], // Remove if not using React
  build: {
    outDir: 'dist',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'] // Adjust based on your dependencies
        }
      }
    }
  },
  base: './' // Important for GitHub Pages deployment
})
