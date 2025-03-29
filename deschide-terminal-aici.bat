@echo off
echo *** DESCHIDERE TERMINAL ÎN DIRECTORUL PROIECTULUI ***
echo.
echo Acest script deschide Command Prompt direct în directorul proiectului.
echo.

REM Salvează directorul curent
set "PROIECT_DIR=%~dp0"

REM Îndepărtează backslash-ul final
set "PROIECT_DIR=%PROIECT_DIR:~0,-1%"

echo Director proiect: %PROIECT_DIR%
echo.
echo Se deschide Command Prompt în directorul proiectului...

REM Deschide CMD în directorul proiectului
start cmd.exe /K "cd /d "%PROIECT_DIR%" && echo Terminal deschis în directorul proiectului && echo. && echo Acum poți rula scripturile direct, de exemplu: && echo auto-commit.bat && echo. && dir *.bat"

echo.
echo CMD a fost deschis. Poți închide această fereastră.
echo.
echo Instrucțiuni rapide:
echo 1. În fereastra CMD nou deschisă, poți rula scripturile direct
echo    tastând numele lor, de exemplu:
echo    auto-commit.bat
echo.
echo 2. Pentru a repara problemele Git, rulează:
echo    fix-git-head.bat
echo.
pause
