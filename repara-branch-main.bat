@echo off
echo *** REPARARE BRANCH MAIN CU SPAȚII NEDORITE ***
echo.
echo Acest script va repara eroarea "fatal: bad revision 'refs/heads/main '"
echo prin recrearea corectă a branch-ului main fără spații suplimentare.
echo.

REM Verifică dacă rulează ca administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ATENȚIE: Este recomandat să rulezi acest script ca administrator!
    echo Continuăm oricum, dar dacă apar probleme, rulează-l ca administrator.
    echo.
    echo Apasă orice tastă pentru a continua...
    pause >nul
)

echo Închidere VS Code dacă este deschis...
taskkill /F /IM Code.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo === PASUL 1: Verificare stare actuală ===
echo.
echo Verificare branch-uri:
git branch -a
echo.

echo Verificare referințe:
git show-ref
echo.

echo === PASUL 2: Reparare referință HEAD ===
echo.
echo Curățare referință HEAD...
echo ref: refs/heads/main> .git\HEAD
echo Referința HEAD a fost setată corect.

echo.
echo === PASUL 3: Verificare și reparare referințe în .git\refs ===
echo.
echo Verificare director refs...
if exist .git\refs\heads (
    echo Director refs/heads găsit.
    if exist ".git\refs\heads\main " (
        echo PROBLEMĂ DETECTATĂ: Branch cu spații nedorite găsit!
        echo Ștergere branch incorect...
        del ".git\refs\heads\main " >nul 2>&1
        echo Branch incorect șters.
    )
    
    if not exist .git\refs\heads\main (
        echo Branch main lipsește, creare branch nou...
        echo.
        echo Crearea unui commit inițial pentru noul branch main...
        git add .
        git commit --allow-empty -m "Reparare branch main"
        
        if %ERRORLEVEL% NEQ 0 (
            echo EROARE la crearea commit-ului! Încercare de reparare completă...
            echo.
            echo === REPARARE COMPLETĂ A REPOSITORY-ULUI ===
            echo.
            echo Ștergere directory .git...
            rmdir /S /Q .git
            echo Inițializare repository nou...
            git init
            echo Creare branch main...
            git checkout -b main
            echo Adăugare fișiere...
            git add .
            echo Creare commit inițial...
            git commit -m "Inițializare repository - reparare branch main"
            echo Configurare remote...
            git remote add origin https://github.com/DEVALO1/my-website.git
        ) else (
            echo Branch main creat cu succes!
        )
    ) else (
        echo Branch main există și pare corect.
    )
) else (
    echo EROARE: Director refs/heads lipsește! Se va face o reparare completă...
    echo.
    echo === REPARARE COMPLETĂ A REPOSITORY-ULUI ===
    echo.
    echo Ștergere directory .git...
    rmdir /S /Q .git
    echo Inițializare repository nou...
    git init
    echo Creare branch main...
    git checkout -b main
    echo Adăugare fișiere...
    git add .
    echo Creare commit inițial...
    git commit -m "Inițializare repository - reparare branch main"
    echo Configurare remote...
    git remote add origin https://github.com/DEVALO1/my-website.git
)

echo.
echo === PASUL 4: Verificare finală ===
echo.
echo Listare branch-uri:
git branch -a
echo.
echo Verificare status:
git status
echo.

echo === RECOMANDĂRI FINALE ===
echo.
echo 1. Folosește auto-commit.bat pentru a face commit-uri
echo 2. Folosește publish-github-pages.bat pentru a publica pe GitHub
echo 3. Deschide VS Code cu: code . --disable-extension ms-vscode.git
echo.
echo Apasă orice tastă pentru a închide...
pause >nul
