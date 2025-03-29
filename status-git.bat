@echo off
echo *** VERIFICARE RAPIDĂ STATUS GIT ***
echo.

echo Verificare branch curent:
git symbolic-ref HEAD
if %ERRORLEVEL% NEQ 0 (
  echo AVERTISMENT: HEAD nu este o referință simbolică validă!
) else (
  echo HEAD este configurat corect.
)
echo.

echo Verificare status:
git status
echo.

echo Verificare ultimul commit:
git log -n 1 --oneline
echo.

echo Verificare remote:
git remote -v
echo.

echo Verificare modificări nepublicate:
git diff --stat --cached origin/main
echo.

echo *** PAȘI RECOMANDAȚI PENTRU DEPLOYMENT ***
echo.
echo 1. Pentru a face push manual (recomandat):
echo    git push origin main
echo.
echo 2. Pentru a verifica în detaliu repository-ul:
echo    verificare-git-final.bat
echo.
echo *** Verificare finalizată! ***
