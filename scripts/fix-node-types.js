import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Obține directorul curent
const __dirname = process.cwd();

console.log('🔧 Reparare probleme de tipuri Node...');

try {
  // Instalează @types/node
  console.log('Instalare @types/node...');
  execSync('npm install --save-dev @types/node@20.12.0', { stdio: 'inherit' });
  
  // Creează sau actualizează fișierul de definiții de tip global
  const globalTypesPath = path.join(__dirname, 'src', 'global.d.ts');
  const typeDefs = `// Definiții generale pentru proiect

// Extinderea definițiilor pentru fișiere media
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.mp4' {
  const content: string;
  export default content;
}

declare module '*.mov' {
  const content: string;
  export default content;
}

// Definiții pentru variabile de mediu
interface ImportMeta {
  env: {
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
    [key: string]: string | boolean;
  };
}

// Definirea explicită a modulelor Node.js pentru a evita erorile
declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
  export function dirname(path: string): string;
}

// Definiție globală pentru __dirname în ESM
declare const __dirname: string;
`;
  
  fs.writeFileSync(globalTypesPath, typeDefs);
  console.log('✅ src/global.d.ts creat cu definițiile necesare');

  console.log('\n✅ Probleme de tipuri Node rezolvate! Rulează "npm run dev" pentru a testa rezultatul.');
} catch (error) {
  console.error('\n❌ Eroare în timpul reparării tipurilor Node:', error);
}
