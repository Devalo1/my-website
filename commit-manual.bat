@echo off
echo *** Script pentru commit manual ***
echo.

echo Această metodă evită folosirea interfeței VS Code pentru commit.
echo.

echo 1. Verificare modificări...
git status
echo.

echo 2. Adăugare fișiere în staging...
git add .
echo.

echo 3. Creare commit cu mesaj explicit...
git commit -m "Actualizare fișiere și rezolvare probleme Git"

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Se pare că a apărut o eroare la commit. Încercăm cu reset HEAD...
  echo.
  
  echo Resetare HEAD...
  git update-ref -d HEAD
  echo.
  
  echo Reconfigurare branch main...
  git symbolic-ref HEAD refs/heads/main
  echo.
  
  echo Încercare commit din nou...
  git add .
  git commit -m "Actualizare fișiere și rezolvare probleme Git după resetare HEAD"
)

echo.
echo 4. Verificare status final...
git status
echo.

echo 5. Instrucțiuni pentru GitHub:
echo - Pentru push pe GitHub:
echo   git push -f origin main
echo.

echo *** Commit manual finalizat! ***
