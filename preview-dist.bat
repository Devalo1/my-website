@echo off
echo *** PREVIEW BUILD LOCAL (FOLDERUL DIST) ***
echo.
echo Acest script îți permite să previzualizezi cum va arăta
echo site-ul tău pe GitHub Pages (conținutul folderului dist).
echo.

echo 1. Verificăm dacă folderul dist există...
if not exist "dist" (
    echo Folderul dist nu există! Trebuie să rulezi build-ul mai întâi.
    echo.
    echo Rulăm build acum...
    call npm run build
    echo.
)

echo 2. Pornim server-ul de preview pe localhost...
echo.
echo Se va deschide o pagină web care arată exact cum va
echo arăta site-ul pe GitHub Pages.
echo.
echo Apasă CTRL+C pentru a opri server-ul când ai terminat.
echo.
call npm run preview

echo.
echo Preview terminat.
echo.
echo Pentru a face modificări:
echo 1. Editează fișierele din src/ sau public/
echo 2. Rulează din nou build + preview pentru a vedea schimbările
echo.
echo Pentru a publica pe GitHub Pages:
echo 1. Rulează auto-commit.bat
echo 2. Rulează publish-github-pages.bat
echo.
echo Apasă orice tastă pentru a închide...
pause >nul
