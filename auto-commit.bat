@echo off
echo *** AUTO-COMMIT CU MESAJ PRE-DEFINIT ***
echo.
echo Acest script face commit cu un mesaj predefinit, evitând
echo interfața VS Code care poate cauza mesaje de commit goale.
echo.

REM Verifică dacă există modificări
git status --porcelain > temp.txt
set /p modificari=<temp.txt
del temp.txt
if "%modificari%"=="" (
    echo Nu există modificări care să necesite commit.
    goto :eof
)

REM Adaugă toate modificările
echo Adăugare modificări în staging...
git add .

REM Generează un mesaj de commit cu timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
set data=%datetime:~0,8%
set ora=%datetime:~8,6%
set mesaj=Actualizare proiect %data:~6,2%-%data:~4,2%-%data:~0,4% %ora:~0,2%:%ora:~2,2%

echo.
echo Pregătire commit cu mesajul: "%mesaj%"
echo.

REM Face commit direct din linia de comandă cu mesajul generat
git commit -m "%mesaj%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo A apărut o eroare la commit. Se încearcă o abordare alternativă...
    
    REM Șterge fișierele de lock dacă există
    del /F /Q .git\index.lock 2>nul
    del /F /Q .git\HEAD.lock 2>nul
    
    REM Forțează referința HEAD dacă e necesar
    echo ref: refs/heads/main > .git\HEAD
    
    REM Încearcă din nou commit-ul
    git commit -m "%mesaj%"
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Commit-ul a eșuat și după încercarea de reparare.
        echo Rulează fix-git-head.bat pentru a rezolva problemele.
    ) else (
        echo.
        echo Commit creat cu succes după reparare!
    )
) else (
    echo.
    echo Commit creat cu succes!
)

echo.
echo Status Git după commit:
git status

echo.
echo Pentru a publica modificările pe GitHub, rulează:
echo  git push origin main
echo.
echo Sau folosește script-ul:
echo  publish-github-pages.bat
echo.
