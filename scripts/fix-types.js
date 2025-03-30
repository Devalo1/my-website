import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Reparare tipuri TypeScript...');

try {
  // Verifică și instalează @types/node dacă nu există
  console.log('Instalare @types/node...');
  execSync('npm install --save-dev @types/node', { stdio: 'inherit' });

  // Adaugă types: ["node"] în tsconfig.json
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    let tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    if (!tsconfig.compilerOptions.types || !tsconfig.compilerOptions.types.includes('node')) {
      tsconfig.compilerOptions.types = [...(tsconfig.compilerOptions.types || []), 'node'];
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log('✅ tsconfig.json actualizat cu tipurile pentru node');
    } else {
      console.log('ℹ️ tsconfig.json conține deja tipurile pentru node');
    }
  }

  // Setează skipLibCheck la true pentru a ignora erori din node_modules
  if (fs.existsSync(tsconfigPath)) {
    let tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    if (!tsconfig.compilerOptions.skipLibCheck) {
      tsconfig.compilerOptions.skipLibCheck = true;
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log('✅ skipLibCheck activat în tsconfig.json');
    }
  }

  console.log('✅ Repararea tipurilor s-a finalizat cu succes!');
  console.log('Acum poți rula npm run dev pentru a porni serverul.');
} catch (error) {
  console.error('❌ Eroare la repararea tipurilor TypeScript:', error);
}
