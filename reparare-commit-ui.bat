@echo off
echo *** REPARARE INTERFAȚĂ COMMIT VS CODE ***
echo.
echo Acest script rezolvă problema: "Aborting commit due to empty commit message"
echo care apare când folosești interfața VS Code pentru commit.
echo.

echo === Reparare fișier COMMIT_EDITMSG ===
echo.

REM Verifică dacă directorul .git există
if not exist .git (
    echo EROARE: Nu există un repository Git în acest director!
    goto :end
)

REM Creează un fișier COMMIT_EDITMSG template
echo Crearea unui fișier COMMIT_EDITMSG template...
echo # Scrie aici mesajul tău de commit> .git\COMMIT_EDITMSG
echo # Liniile care încep cu '#' vor fi ignorate>> .git\COMMIT_EDITMSG
echo #>> .git\COMMIT_EDITMSG
echo # Modificări în așteptare:>> .git\COMMIT_EDITMSG
echo #>> .git\COMMIT_EDITMSG

REM Listează fișierele modificate în COMMIT_EDITMSG
git status --porcelain | findstr /V "??" | findstr /V ".git" >> .git\COMMIT_EDITMSG

echo Fișier template creat.

REM Configurează Git să folosească VS Code pentru editare
echo.
echo Configurare editor Git...
git config --local core.editor "code --wait"
echo Editor configurat.

echo.
echo === Setare variabile Git locale ===
echo.

REM Verifică și configurează numele și email-ul local dacă nu există
git config --local user.name > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Nume utilizator Git neconfigurat. Configurare...
    set /p nume="Introdu numele tău pentru Git: "
    git config --local user.name "%nume%"
    echo Nume utilizator configurat.
) else (
    echo Nume utilizator Git configurat corect.
)

git config --local user.email > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Email Git neconfigurat. Configurare...
    set /p email="Introdu adresa de email pentru Git: "
    git config --local user.email "%email%"
    echo Email configurat.
) else (
    echo Email Git configurat corect.
)

echo.
echo === Testare commit ===
echo.
echo Se va crea un commit gol de test...
git commit --allow-empty -m "Test commit UI - va fi șters"

if %ERRORLEVEL% NEQ 0 (
    echo EROARE: Nu se pot face commit-uri. Rulează fix-git-head.bat
) else (
    echo Test commit reușit! Se șterge commit-ul de test...
    git reset --hard HEAD~1 >nul 2>&1
    echo Commit test șters.
)

echo.
echo === INSTRUCȚIUNI PENTRU COMMIT-URI VIITOARE ===
echo.
echo După această reparare, ar trebui să poți face commit-uri din VS Code.
echo.
echo Alternativ, poți folosi:
echo 1. auto-commit.bat - pentru commit-uri rapide cu mesaj automat
echo 2. commit-sigur.bat - pentru commit-uri cu mesaj personalizat
echo.
echo IMPORTANT: Dacă întâmpini în continuare probleme cu interfața VS Code,
echo folosește exclusiv script-urile pentru commit și push.
echo.

:end
echo *** Proces finalizat! ***
