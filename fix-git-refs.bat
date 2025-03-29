@echo off
echo Fixing Git reference issues...

:: Backup important files
echo Creating backup of important files...
mkdir git-backup
xcopy .git\HEAD git-backup\ /Y
xcopy .git\config git-backup\ /Y

:: Remove Git locks
echo Removing Git locks...
if exist .git\index.lock del .git\index.lock
if exist .git\HEAD.lock del .git\HEAD.lock
if exist .git\refs\heads\*.lock del .git\refs\heads\*.lock

:: Reset Git HEAD reference
echo Resetting Git HEAD reference...
git update-ref -d HEAD
git reset

:: If needed, try harder reset
echo Attempting to reset repository state...
git fetch origin
git reset --hard origin/main

:: Setarea preventivă pentru viitor
echo Configurarea pentru prevenirea problemelor cu Vite...
echo Eliminarea vite.config.js...
if exist vite.config.js del vite.config.js

:: Adăugare vite.config.js în .gitignore dacă nu există deja
findstr /c:"vite.config.js" .gitignore >nul 2>&1
if errorlevel 1 (
  echo Adăugare vite.config.js în .gitignore...
  echo. >> .gitignore
  echo # Exclude vite.config.js to prevent accidental commits >> .gitignore
  echo vite.config.js >> .gitignore
)

echo Verificarea cache-ului...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo Curățarea cache-ului npm...
npm cache clean --force

echo Reinstalarea dependențelor...
npm install

echo Crearea script-ului de prevenție...
if not exist scripts mkdir scripts
if not exist scripts\ensure-vite-config.js (
  echo Crearea scripts\ensure-vite-config.js...
  echo const fs = require('fs'); > scripts\ensure-vite-config.js
  echo const path = require('path'); >> scripts\ensure-vite-config.js
  echo. >> scripts\ensure-vite-config.js
  echo const rootDir = path.resolve(__dirname, '..'); >> scripts\ensure-vite-config.js
  echo const viteConfigJs = path.join(rootDir, 'vite.config.js'); >> scripts\ensure-vite-config.js
  echo. >> scripts\ensure-vite-config.js
  echo // Verifică dacă există vite.config.js >> scripts\ensure-vite-config.js
  echo if (fs.existsSync(viteConfigJs)) { >> scripts\ensure-vite-config.js
  echo   console.log('⚠️ Fișierul vite.config.js a fost detectat și va fi eliminat.'); >> scripts\ensure-vite-config.js
  echo   try { >> scripts\ensure-vite-config.js
  echo     fs.unlinkSync(viteConfigJs); >> scripts\ensure-vite-config.js
  echo     console.log('✅ vite.config.js a fost eliminat cu succes.'); >> scripts\ensure-vite-config.js
  echo   } catch (error) { >> scripts\ensure-vite-config.js
  echo     console.error('❌ Eroare la eliminarea vite.config.js:', error.message); >> scripts\ensure-vite-config.js
  echo     console.log('Încearcă să ștergi manual fișierul.'); >> scripts\ensure-vite-config.js
  echo   } >> scripts\ensure-vite-config.js
  echo } >> scripts\ensure-vite-config.js
)

echo Configurarea Vite a fost standardizată. Acum doar vite.config.tsx va fi folosit.

echo Done! If you still have issues, consider:
echo 1. Creating a backup of your project files (outside Git)
echo 2. Deleting the repository locally
echo 3. Cloning it fresh from GitHub
echo 4. Manually copying over your latest changes
pause
