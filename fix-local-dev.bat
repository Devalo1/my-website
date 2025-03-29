@echo off
echo *** SINCRONIZARE DEZVOLTARE LOCALĂ CU GITHUB PAGES ***
echo.
echo Acest script face ca dezvoltarea locală să fie identică cu GitHub Pages
echo.

echo 1. Verificare configurații Vite...
node scripts/ensure-vite-config.js
echo.

echo 2. Pregătire directoare statice...
if not exist "public" (
    mkdir public
    echo Director public creat.
)

echo.
echo 3. Verificare package.json pentru script corect de dezvoltare...
findstr "dev" package.json
echo.
echo Dacă vezi "dev": "vite --base=/my-website/", configurația este corectă.
echo.

echo 4. Acum poți rula dezvoltarea locală cu:
echo    npm run dev
echo.
echo Site-ul va fi disponibil la: http://localhost:5173/my-website/
echo.
echo 5. Când termini modificările și vrei să le publici:
echo    a) Folosește auto-commit.bat pentru a face commit
echo    b) Folosește publish-github-pages.bat pentru publicare
echo.
echo IMPORTANT: Pentru a fi identic cu GitHub Pages, trebuie să accesezi:
echo http://localhost:5173/my-website/
echo NU http://localhost:5173/
echo.

echo *** CHECKLIST PROBLEME FRECVENTE ***
echo.
echo 1. Verifică dacă în codul sursă toate căile încep cu /my-website/:
echo    - Imagini: src="/my-website/imagini/poza.jpg"
echo    - CSS: url('/my-website/assets/style.css')
echo    - Link-uri: href="/my-website/about"
echo.
echo 2. Verifică dacă imaginile statice sunt în directorul public:
echo    - public/images/poza.jpg va fi /my-website/images/poza.jpg
echo.
echo 3. Verifică package.json:
echo    - "dev": "vite --base=/my-website/" pentru dezvoltare identică
echo.

echo Apasă orice tastă pentru a deschide VS Code...
pause >nul
code .
