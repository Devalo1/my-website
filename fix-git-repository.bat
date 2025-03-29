@echo off
echo *** Script de reparare repository Git ***
echo.

echo 1. Verificare branch curent...
git branch
echo.

echo 2. Inițializare repository dacă este necesar...
if not exist .git (
  git init
  echo Repository inițializat.
) else (
  echo Repository deja existent.
)
echo.

echo 3. Verificare remote origin...
git remote -v
echo.

echo 4. Resetare stare Git locală...
echo Ștergere referință HEAD existentă (dacă există)...
git update-ref -d HEAD --no-deref
echo Configurare HEAD către branch-ul main...
git symbolic-ref HEAD refs/heads/main
echo HEAD resetat la refs/heads/main
echo.

echo 5. Adăugare fișiere în staging...
git add .
echo.

echo 6. Creare commit inițial sau resetare...
git commit -m "Resetare repository și rezolvare probleme de referințe"
echo.

echo 7. Verificare status...
git status
echo.

echo 8. Instrucțiuni pentru GitHub Pages:
echo - Dacă repository-ul tău remote există deja, rulează:
echo   git push -f origin main
echo.
echo - Dacă nu există încă pe GitHub, creează un nou repository pe GitHub
echo   și apoi rulează:
echo   git remote add origin https://github.com/username/my-website.git
echo   git push -u origin main
echo.
echo *** Reparare completă! ***
