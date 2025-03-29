@echo off
echo *** COMMIT SIGUR - EVITĂ PROBLEMELE DE REFERINȚE ***
echo.

REM Verifică starea Git
git status
echo.

REM Verifică HEAD-ul
echo Verificare HEAD...
git symbolic-ref HEAD >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo AVERTISMENT: HEAD nu este o referință validă, se repară...
    echo ref: refs/heads/main > .git\HEAD
    echo HEAD a fost reparat.
) else (
    echo HEAD pare să fie ok.
)
echo.

REM Adaugă toate fișierele
echo Adăugare fișiere în staging...
git add .
echo.

REM Cere un mesaj de commit
set /p "mesaj=Introdu mesajul pentru commit: "
if "%mesaj%"=="" set "mesaj=Actualizare proiect"

REM Încearcă commit-ul
echo.
echo Creare commit...
git commit -m "%mesaj%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo A apărut o eroare la commit, încerc o abordare alternativă...
    
    REM Șterge fișierele de lock
    del /F .git\index.lock 2>nul
    del /F .git\HEAD.lock 2>nul
    
    REM Încearcă să facă commit din nou
    echo.
    echo Încercare commit din nou...
    git commit -m "%mesaj%"
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Commit-ul a eșuat. Rulează verificare-git-final.bat pentru diagnosticare.
    ) else (
        echo.
        echo Commit creat cu succes la a doua încercare!
    )
) else (
    echo.
    echo Commit creat cu succes!
)

echo.
echo Status actual:
git status
echo.
echo Pentru a face push: git push origin main
echo.
