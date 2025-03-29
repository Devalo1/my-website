@echo off
color 0A
cls
echo =====================================================
echo    ASISTENT INTERACTIV PENTRU COMENZI GIT
echo =====================================================
echo.
echo Acest script te va ajuta să execuți pașii necesari 
echo pentru a rezolva problemele Git și a publica site-ul.
echo.
echo Alege o opțiune din lista de mai jos:
echo.
echo [1] Verificare stare repository
echo [2] Reparare interfață commit
echo [3] Commit automat cu timestamp
echo [4] Commit cu mesaj personalizat
echo [5] Publicare pe GitHub Pages
echo [6] Reparare probleme HEAD (în caz de erori)
echo [7] Resetare completă repository (ultimă soluție)
echo [0] Ieșire
echo.

:menu
set /p alegere="Introdu numărul opțiunii: "

if "%alegere%"=="1" (
    cls
    echo Executare verificare-git-final.bat...
    echo.
    call verificare-git-final.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="2" (
    cls
    echo Executare reparare-commit-ui.bat...
    echo.
    call reparare-commit-ui.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="3" (
    cls
    echo Executare auto-commit.bat...
    echo.
    call auto-commit.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="4" (
    cls
    echo Executare commit-sigur.bat...
    echo.
    call commit-sigur.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="5" (
    cls
    echo Executare publish-github-pages.bat...
    echo.
    call publish-github-pages.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="6" (
    cls
    echo Executare fix-git-head.bat...
    echo ATENȚIE: Acest script va repara referințele HEAD, dar poate necesita drepturi de administrator!
    echo.
    call fix-git-head.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="7" (
    cls
    echo Executare reset-total-git.bat...
    echo ATENȚIE: Acest script va reseta complet repository-ul Git!
    echo.
    call reset-total-git.bat
    echo.
    echo Apasă orice tastă pentru a reveni la meniu...
    pause >nul
    goto start
)

if "%alegere%"=="0" (
    cls
    echo La revedere!
    echo.
    exit /b 0
)

echo.
echo Opțiune invalidă! Te rog să alegi din nou.
echo.
goto menu

:start
cls
echo =====================================================
echo    ASISTENT INTERACTIV PENTRU COMENZI GIT
echo =====================================================
echo.
echo Alege o opțiune din lista de mai jos:
echo.
echo [1] Verificare stare repository
echo [2] Reparare interfață commit
echo [3] Commit automat cu timestamp
echo [4] Commit cu mesaj personalizat
echo [5] Publicare pe GitHub Pages
echo [6] Reparare probleme HEAD (în caz de erori)
echo [7] Resetare completă repository (ultimă soluție)
echo [0] Ieșire
echo.
goto menu
