import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obține directorul curent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧹 Curățare cache și configurație...');

try {
  // Curăță cache-ul Vite
  if (fs.existsSync(path.join(rootDir, 'node_modules', '.vite'))) {
    fs.rmSync(path.join(rootDir, 'node_modules', '.vite'), { recursive: true, force: true });
    console.log('✅ Cache-ul Vite a fost curățat');
  }

  // Găsește și oprește procesele care folosesc porturile
  console.log('🔍 Verificare și oprire procese care folosesc porturile...');
  try {
    if (process.platform === 'win32') {
      // Windows
      execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
    } else {
      // Linux/Mac
      execSync('pkill -f node', { stdio: 'ignore' });
    }
    console.log('✅ Procese node oprite');
  } catch (e) {
    console.log('ℹ️ Nu s-au găsit procese node active');
  }

  // Curăță directoarele generate
  ['dist', '.debug-build'].forEach(dir => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Directorul ${dir} a fost șters`);
    }
  });

  // Regenerează directorul de imagini
  console.log('🔄 Regenerare directoare și fișiere...');
  execSync('node scripts/setup-project.cjs', { stdio: 'inherit', cwd: rootDir });
  
  console.log('\n✅ Resetare completă! Acum poți rula npm run dev pentru a porni serverul.');
} catch (error) {
  console.error('\n❌ A apărut o eroare în timpul resetării:', error);
}
