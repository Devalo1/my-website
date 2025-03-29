@echo off
setlocal enabledelayedexpansion
color 0A

echo *** GHID PAȘI PENTRU REPARAREA ȘI UTILIZAREA GIT ***
echo.
echo Acest script te va ghida prin pașii necesari pentru a repara
echo și utiliza Git corect cu proiectul tău.
echo.
echo ------------------------------------------------------
echo.
echo PASUL 1: Verificare stare actuală repository
echo.
echo Acesta va verifica starea actuală a repository-ului Git
echo și va identifica orice probleme existente.
echo.
echo Pentru a rula verificarea, introdu: verificare-git-final.bat
echo.
set /p "p1=Apasă ENTER după ce ai executat verificarea..."
echo.
echo ------------------------------------------------------
echo.

echo PASUL 2: Reparare interfață commit VS Code
echo.
echo Acest pas va rezolva problema cu mesajele de commit goale
echo care apare când folosești interfața VS Code.
echo.
echo Pentru a repara interfața, introdu: reparare-commit-ui.bat
echo.
set /p "p2=Apasă ENTER după ce ai executat repararea..."
echo.
echo ------------------------------------------------------
echo.

echo PASUL 3: Cum să faci commit-uri
echo.
echo Pentru commit-uri, ai două opțiuni:
echo.
echo OPȚIUNEA A: Commit automat cu timestamp
echo - Rulează: auto-commit.bat
echo - Va genera automat un mesaj de commit cu data și ora curentă
echo.
echo OPȚIUNEA B: Commit cu mesaj personalizat
echo - Rulează: commit-sigur.bat
echo - Îți va permite să introduci un mesaj personalizat pentru commit
echo.
echo IMPORTANT: Evită să folosești interfața VS Code pentru commit!
echo Folosește întotdeauna unul dintre aceste scripturi.
echo.
echo ------------------------------------------------------
echo.

echo PASUL 4: Publicare pe GitHub Pages
echo.
echo După ce ai făcut commit la modificările tale, poți publica
echo site-ul pe GitHub Pages folosind:
echo.
echo Pentru publicare, rulează: publish-github-pages.bat
echo.
echo Acest script va face push la repository pe GitHub și va
echo pregăti site-ul pentru a fi disponibil online.
echo.
echo ------------------------------------------------------
echo.

echo GHID DE REFERINȚĂ RAPIDĂ:
echo.
echo 1. VERIFICARE:       verificare-git-final.bat
echo 2. REPARARE:         reparare-commit-ui.bat
echo 3. COMMIT AUTOMAT:   auto-commit.bat
echo 4. COMMIT MANUAL:    commit-sigur.bat
echo 5. PUBLICARE:        publish-github-pages.bat
echo.
echo În caz de probleme grave:
echo - REPARARE HEAD:     fix-git-head.bat
echo - RESETARE TOTALĂ:   reset-total-git.bat
echo.

echo NOTĂ FINALĂ:
echo Toate aceste scripturi trebuie rulate în Command Prompt (CMD)
echo sau PowerShell din directorul proiectului tău.
echo.
echo Descrie aici pașii pentru deschiderea CMD în directorul proiectului:
echo 1. Apasă tastele Windows + R pentru a deschide Run
echo 2. Tastează "cmd" și apasă Enter
echo 3. În fereastra CMD, navighează la directorul proiectului cu:
echo    cd c:\Proiect\my-website
echo 4. Acum poți rula scripturile folosind numele lor
echo.
echo *** SUCCES CU PROIECTUL TĂU! ***

pause
endlocal
