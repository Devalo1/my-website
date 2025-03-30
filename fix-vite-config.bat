@echo off
echo *** REZOLVARE PROBLEME CONFIGURAȚIE VITE ***
echo.
echo Acest script va rezolva problemele cu configurația Vite
echo și va asigura conexiunea corectă între GitHub și dezvoltarea locală.
echo.

echo === PASUL 1: Curățarea fișierelor de configurație nedorite ===
echo.
if exist vite.config.js (
  echo Ștergere vite.config.js...
  del /F vite.config.js
)
if exist vite.config.tsx (
  echo Ștergere vite.config.tsx...
  del /F vite.config.tsx
)
if exist vite.config.tsx.tsx (
  echo Ștergere vite.config.tsx.tsx...
  del /F vite.config.tsx.tsx
)
echo.

echo === PASUL 2: Rulare script de curățare configurație ===
echo.
echo Rulare npm run clean-config...
call npm run clean-config
echo.

echo === PASUL 3: Verificare NODE_MODULES ===
echo.
if not exist node_modules (
  echo Instalare dependențe...
  call npm install
) else (
  echo node_modules există, verificare plugin-uri Vite...
  if not exist node_modules\@vitejs (
    echo Reinstalare dependențe Vite...
    call npm install @vitejs/plugin-react --save-dev
  )
)
echo.

echo === PASUL 4: Verificare configurație finală ===
echo.
if exist vite.config.ts (
  echo ✅ vite.config.ts există.
) else (
  echo ❌ vite.config.ts nu există! Se creează...
  echo import { defineConfig } from 'vite' > vite.config.ts
  echo import react from '@vitejs/plugin-react' >> vite.config.ts
  echo. >> vite.config.ts
  echo // https://vitejs.dev/config/ >> vite.config.ts
  echo export default defineConfig({ >> vite.config.ts
  echo   plugins: [react()], >> vite.config.ts
  echo   base: '/my-website/',  // Necesar pentru GitHub Pages >> vite.config.ts
  echo   server: { >> vite.config.ts
  echo     base: '/my-website/' >> vite.config.ts
  echo   } >> vite.config.ts
  echo }) >> vite.config.ts
  echo.
  echo ✅ vite.config.ts a fost creat manual.
)
echo.

echo === PASUL 5: INSTRUCȚIUNI PENTRU DEZVOLTARE LOCALĂ ===
echo.
echo Pentru a rula proiectul local și a te asigura că folosește
echo aceeași cale de bază ca GitHub Pages:
echo.
echo 1. Folosește comanda:
echo    npm run dev
echo.
echo 2. Accesează site-ul la:
echo    http://localhost:5173/my-website/
echo.
echo 3. Pentru a publica pe GitHub Pages:
echo    npm run build
echo    npm run deploy
echo.

echo === PROCESUL ESTE COMPLET! ===
echo.
echo Configurația Vite a fost rezolvată. Acum ar trebui să funcționeze
echo corect atât local cât și pe GitHub Pages.
echo.
pause
