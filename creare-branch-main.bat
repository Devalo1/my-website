@echo off
echo *** CREARE BRANCH MAIN ***
echo.
echo Acest script va rezolva eroarea "No such branch: main"
echo prin crearea corectă a branch-ului main.
echo.

echo Închidere VS Code dacă este deschis...
taskkill /F /IM Code.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo === PASUL 1: Verificare stare repository ===
echo.
git status
echo.

echo === PASUL 2: Verificare branch-uri existente ===
echo.
echo Branch-uri existente:
git branch -a
echo.

echo === PASUL 3: Creare branch main ===
echo.

REM Verifică dacă suntem pe un branch
git symbolic-ref HEAD >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo HEAD nu este o referință simbolică, creăm branch main...
    
    REM Creează branch main
    git checkout -b main
    
    if %ERRORLEVEL% NEQ 0 (
        echo Eroare la crearea branch-ului main.
        echo Încercăm o abordare alternativă...
        
        echo Resetare HEAD...
        git update-ref -d HEAD
        
        echo Setare referință HEAD la main...
        echo ref: refs/heads/main > .git\HEAD
        
        echo Crearea unui commit inițial...
        git add .
        git commit --allow-empty -m "Inițializare branch main"
    ) else (
        echo Branch main creat cu succes!
    )
) else (
    echo Verificare branch curent...
    for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%a
    echo Branch curent: %CURRENT_BRANCH%
    
    if not "%CURRENT_BRANCH%" == "main" (
        echo Crearea și comutarea la branch-ul main...
        git checkout -b main
        if %ERRORLEVEL% NEQ 0 (
            echo A apărut o eroare. Încercăm o abordare radicală...
            
            echo Ștergere completă repository...
            rmdir /S /Q .git
            
            echo Creare repository nou...
            git init
            
            echo Creare branch main...
            git checkout -b main
            
            echo Adăugare fișiere...
            git add .
            
            echo Creare commit inițial...
            git commit -m "Inițializare repository cu branch main"
            
            echo Configurare remote...
            git remote add origin https://github.com/DEVALO1/my-website.git
        )
    ) else (
        echo Deja te afli pe branch-ul main!
    )
)

echo.
echo === PASUL 4: Verificare branch main ===
echo.
git branch -a
echo.

echo === PASUL 5: Verificare Git status ===
echo.
git status
echo.

echo === PASUL 6: Adăugare fișiere și commit (dacă este necesar) ===
echo.
git add .
git commit --allow-empty -m "Reparare branch main"
echo.

echo === RECOMANDĂRI PENTRU URMĂTORII PAȘI ===
echo.
echo 1. Pentru a face push la branch-ul main:
echo    git push -f origin main
echo.
echo 2. Deschide VS Code fără extensia Git:
echo    code . --disable-extension ms-vscode.git
echo.
echo 3. Pentru operațiuni viitoare de commit, folosește:
echo    auto-commit.bat
echo.
echo Apasă orice tastă pentru a închide...
pause >nul
