@echo off
echo *** GHID PENTRU DEZVOLTAREA ȘI PUBLICAREA SITE-ULUI ***
echo.

echo === PASUL 1: DEZVOLTARE LOCALĂ ===
echo.
echo Pentru a modifica site-ul local:
echo 1. Deschide proiectul în VS Code:
echo    code .
echo.
echo 2. Modifică fișierele sursă în directorul src/
echo    - Editează App.tsx pentru componente și structură
echo    - Editează CSS-ul pentru stilizare
echo    - Adaugă imagini în directorul public/images/
echo.
echo 3. Rulează server-ul de dezvoltare:
echo    npm run dev
echo.
echo 4. Deschide browser-ul la adresa:
echo    http://localhost:5173/my-website/
echo.
echo 5. Verifică că toate resursele (imagini, CSS, etc.) folosesc calea corectă:
echo    /my-website/...
echo.

echo === PASUL 2: COMMIT MODIFICĂRI ===
echo.
echo După ce ai finalizat modificările și site-ul arată bine local:
echo 1. Închide VS Code
echo 2. Execută script-ul pentru commit:
echo    auto-commit.bat
echo.

echo === PASUL 3: PUBLICARE PE GITHUB PAGES ===
echo.
echo Pentru a publica modificările pe GitHub Pages:
echo 1. Execută script-ul pentru publicare:
echo    publish-github-pages.bat
echo.
echo 2. Așteaptă câteva minute pentru ca GitHub Actions să proceseze modificările
echo 3. Verifică site-ul la adresa:
echo    https://devalo1.github.io/my-website/
echo.

echo === RECOMANDĂRI IMPORTANTE ===
echo.
echo 1. Asigură-te că toate căile pentru resurse (imagini, CSS) încep cu /my-website/
echo 2. Adaugă toate fișierele statice (imagini, fonturi, etc.) în directorul public/
echo 3. Folosește întotdeauna auto-commit.bat pentru commit și publish-github-pages.bat pentru publicare
echo.

echo Apasă orice tastă pentru a deschide VS Code și a începe dezvoltarea...
pause >nul
code .
