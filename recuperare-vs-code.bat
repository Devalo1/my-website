@echo off
echo *** RECUPERARE DUPĂ DESCHIDERE PREMATURĂ VS CODE ***
echo.
echo Acest script va rezolva problema deschiderii VS Code
echo înainte de finalizarea completă a procesului de reparare.
echo.
echo IMPORTANT: Închide TOATE instanțele VS Code acum!
echo Apasă orice tastă după ce ai închis VS Code...
pause >nul

echo.
echo 1. Verificare dacă VS Code este închis...
tasklist | find "Code.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo [EROARE] VS Code încă rulează! Te rog să închizi toate ferestrele VS Code.
    echo Apasă orice tastă pentru a încerca din nou...
    pause >nul
    taskkill /F /IM Code.exe >nul 2>&1
    timeout /t 2 >nul
)

echo.
echo 2. Curățare fișiere de lock...
del /F /Q .git\index.lock 2>nul
del /F /Q .git\HEAD.lock 2>nul
echo Fișiere de lock șterse.

echo.
echo 3. Verificare stare HEAD...
git symbolic-ref HEAD >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AVERTISMENT] HEAD nu este o referință simbolică validă! Se repară...
    echo ref: refs/heads/main > .git\HEAD
    echo HEAD reparat.
) else (
    echo HEAD este configurat corect.
)

echo.
echo 4. Verificare stare repository...
git status

echo.
echo 5. Verificare dacă este nevoie de reparații suplimentare...
git commit --allow-empty -m "Test commit" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AVERTISMENT] Nu se pot face commit-uri! Este nevoie de remediere completă.
    echo.
    echo Se recomandă să rulezi:
    echo fix-git-head.bat
    echo.
    echo cu drepturi de administrator pentru o remediere completă.
) else (
    echo Git funcționează corect! Se șterge commit-ul de test...
    git reset --hard HEAD~1 >nul 2>&1
    echo.
    echo 6. RECOMANDĂRI PENTRU URMĂTORII PAȘI:
    echo.
    echo - Folosește auto-commit.bat pentru a face commit-uri
    echo - Folosește publish-github-pages.bat pentru a publica pe GitHub
    echo - Deschide VS Code cu comanda: code . --disable-extension ms-vscode.git
    echo   pentru a evita problemele cu extensia Git
)

echo.
echo *** Proces de recuperare finalizat! ***
echo.
echo Apasă orice tastă pentru a închide...
pause >nul
