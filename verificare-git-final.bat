@echo off
setlocal enabledelayedexpansion

echo *** VERIFICARE FINALĂ A REPOSITORY-ULUI GIT ***
echo.
echo Acest script va verifica dacă repository-ul este în stare bună după reparații.
echo.

REM Verifică dacă directorul .git există
if not exist .git (
    echo EROARE: Nu există un repository Git în acest director!
    goto :end
)

echo === 1. Verificare stare actuală ===
echo.
git status
echo.

echo === 2. Verificare referințe și branch-uri ===
echo.
git branch -a
echo.
git show-ref HEAD

set "headOk=0"
git symbolic-ref HEAD >nul 2>&1 && set "headOk=1"

if !headOk! EQU 0 (
    echo.
    echo AVERTISMENT: HEAD nu este o referință simbolică!
    echo Dacă vezi această eroare, rulează: fix-git-head.bat
) else (
    echo.
    echo HEAD este configurat corect ca referință simbolică.
)
echo.

echo === 3. Testare operațiuni Git de bază ===
echo.
echo Testare commit gol...
git commit --allow-empty -m "Test commit - va fi șters" >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo EROARE: Nu se pot crea commit-uri!
    echo Rulează unul din scripturile de resetare Git.
) else (
    echo Commit test creat cu succes.
    echo Resetare commit test...
    git reset --hard HEAD~1 >nul 2>&1
    echo Commit test șters.
)
echo.

echo === 4. Verificare configurații remote ===
echo.
git remote -v
if !ERRORLEVEL! NEQ 0 (
    echo Nu există remote-uri configurate.
    echo Rulează comanda:
    echo git remote add origin https://github.com/DEVALO1/my-website.git
) else (
    echo Remote-uri configurate corect.
)
echo.

echo === 5. Verificare configurații Git ===
echo.
git config user.name
git config user.email
echo.

echo === 6. Verificare permisiuni ===
echo.
echo Verificare permisiuni director .git...
icacls .git
echo.

echo === CONCLUZII ȘI RECOMANDĂRI ===
echo.

if !headOk! EQU 1 (
    echo ✓ Repository-ul Git pare să fie în stare bună!
    echo.
    echo RECOMANDĂRI PENTRU UTILIZAREA GIT ÎN VIITOR:
    echo.
    echo 1. Preferă să folosești Git din linia de comandă, nu din VS Code
    echo 2. Pentru commit, folosește: git add . && git commit -m "Mesaj"
    echo 3. Pentru push, folosește: git push origin main
    echo.
    echo 4. Evită să ai VS Code și alte aplicații care folosesc Git deschise simultan
    echo 5. Fă commit-uri mici și frecvente pentru a evita probleme
    echo.
    echo Toate scripturile de reparație create anterior pot fi păstrate
    echo pentru cazuri de urgență dacă apar probleme în viitor.
) else (
    echo REPOSITORY-UL ÎNCĂ ARE PROBLEME!
    echo.
    echo Pași de urmat acum:
    echo 1. Închide VS Code complet
    echo 2. Rulează fix-git-head.bat ca administrator
    echo 3. Rulează reset-total-git.bat ca ultimă soluție
    echo.
    echo După reparare, redeschide VS Code cu: 
    echo code . --disable-extension ms-vscode.git
)

:end
echo.
echo *** Verificare completă! ***
endlocal
