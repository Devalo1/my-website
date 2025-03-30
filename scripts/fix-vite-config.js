import fs from 'fs';
import path from 'path';

// Pentru ES Modules, trebuie să obținem calea curentă
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const rootDir = path.resolve(__dirname, '..');

console.log('🔧 Reparare configurație Vite...');

const viteConfigPath = path.join(rootDir, 'vite.config.ts');

// Configurația corectă pentru Vite
const correctConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-website/', 
  build: {
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  publicDir: 'public'
})
`;

try {
  // Scrie configurația corectă
  fs.writeFileSync(viteConfigPath, correctConfig);
  console.log('✅ vite.config.ts a fost reparat cu succes!');
} catch (error) {
  console.error('❌ Eroare la repararea vite.config.ts:', error);
}
