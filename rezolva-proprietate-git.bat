@echo off
echo *** REZOLVARE CONFLICT DE PROPRIETATE GIT ***
echo.
echo Acest script rezolvă problema:
echo "fatal: detected dubious ownership in repository"
echo.

echo Metoda 1: Adăugare director ca sigur în configurația Git
echo -------------------------------------------------------
echo Rulăm comanda recomandată de Git:
echo.
git config --global --add safe.directory C:/Proiect/my-website
echo.
echo Directorul a fost adăugat în lista de directoare sigure.
echo.

echo Metoda 2: Modificare permisiuni fișiere
echo --------------------------------------
echo Acordarea permisiunilor complete pentru utilizatorul curent...
echo.
icacls .git /grant:r %USERNAME%:(OI)(CI)F /T
echo.
echo Permisiunile pentru directorul .git au fost actualizate.
echo.

echo === VERIFICARE FINALĂ ===
echo.
echo Testăm dacă Git poate acum să acceseze repository-ul:
git rev-parse --show-toplevel
echo.

if %ERRORLEVEL% NEQ 0 (
    echo Încă există probleme de acces.
    echo.
    echo Soluție alternativă:
    echo 1. Închide VS Code
    echo 2. Rulează comenzile individuale de mai jos într-un terminal normal (nu ca administrator):
    echo.
    echo    rmdir /S /Q .git
    echo    git init
    echo    git checkout -b main
    echo    git add .
    echo    git commit -m "Re-inițializare repository"
    echo    git remote add origin https://github.com/DEVALO1/my-website.git
    echo.
    echo Aceste comenzi vor recrea repository-ul cu proprietarul corect.
) else (
    echo Repository-ul Git este acum accesibil!
    echo.
    echo Acum poți continua lucrul normal:
    echo 1. Folosește auto-commit.bat pentru commit-uri
    echo 2. Folosește publish-github-pages.bat pentru publicare
)

echo.
echo Apasă orice tastă pentru a închide...
pause >nul
