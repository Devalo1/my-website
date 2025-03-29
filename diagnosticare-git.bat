@echo off
echo *** Script de diagnosticare Git ***
echo.

echo === Informații de bază despre repository ===
echo.

echo 1. Verificare existență director .git...
if exist .git (
  echo Director .git EXISTĂ.
) else (
  echo EROARE: Director .git NU EXISTĂ!
  echo Rulează script-ul reset-git-complete.bat pentru a crea un repository nou.
  goto :eof
)
echo.

echo 2. Stare branch-uri Git...
echo.
git branch -a
echo.

echo 3. Stare referințe Git...
echo.
git show-ref
echo.

echo 4. Verificare remote...
echo.
git remote -v
echo.

echo 5. Verificare HEAD...
echo.
git symbolic-ref HEAD
if %ERRORLEVEL% NEQ 0 (
  echo EROARE: HEAD nu este o referință simbolică validă!
  echo Rulează fix-git-repository.bat pentru a repara referințele.
) else (
  echo HEAD este configurat corect.
)
echo.

echo 6. Status Git...
echo.
git status
echo.

echo 7. Verificare configurații Git...
echo.
git config --list
echo.

echo === Recomandări ===
echo.
echo Dacă vezi erori despre blocarea referințelor sau HEAD invalid:
echo 1. Rulează fix-git-repository.bat
echo.
echo Dacă problemele persistă:
echo 2. Rulează reset-git-complete.bat pentru o resetare completă
echo.
echo Dacă ai erori la push sau la conexiunea cu GitHub:
echo 3. Verifică dacă URL-ul remote este corect configurat.
echo   Ar trebui să fie în forma: https://github.com/numeutilizator/my-website.git
echo.
echo *** Diagnosticare completă! ***
