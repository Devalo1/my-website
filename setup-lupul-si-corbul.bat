@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul
color 0A
title Configurare "Lupul și Corbul" - by GitHub Copilot

echo ********************************************************
echo *                                                      *
echo *         CONFIGURARE PROIECT LUPUL ȘI CORBUL         *
echo *                                                      *
echo ********************************************************
echo.

REM Obține numele acestui script pentru a-l exclude de la ștergere
set "ACEST_SCRIPT=%~nx0"

echo === PASUL 1: ȘTERGERE FIȘIERE BAT INUTILE ===
echo.
echo Fișiere .bat care vor fi șterse:
echo.

set "totalBatFiles=0"
set "batToKeep=%ACEST_SCRIPT%"

REM Numără toate fișierele .bat
for %%F in (*.bat) do (
    if /i not "%%F"=="%batToKeep%" (
        echo   - %%F
        set /a "totalBatFiles+=1"
    )
)

echo.
echo Total: %totalBatFiles% fișiere .bat vor fi șterse
echo.
set /p confirmare="Confirmi ștergerea acestor fișiere? (d/n): "

if /i "%confirmare%"=="d" (
    echo.
    echo Ștergere fișiere .bat inutile...
    for %%F in (*.bat) do (
        if /i not "%%F"=="%batToKeep%" (
            del /F /Q "%%F"
        )
    )
    echo Fișiere .bat șterse cu succes!
) else (
    echo Operațiunea de ștergere a fost anulată.
)

echo.
echo === PASUL 2: CONFIGURARE VITE PENTRU GITHUB PAGES ===
echo.

REM Ștergere fișiere de configurație redundante
echo Ștergere configurații vechi...
if exist vite.config.js del /F /Q vite.config.js
if exist vite.config.tsx del /F /Q vite.config.tsx
if exist vite.config.tsx.tsx del /F /Q vite.config.tsx.tsx

REM Creează vite.config.ts corect
echo Creare vite.config.ts optimizat pentru GitHub Pages...
(
echo import { defineConfig } from 'vite'
echo import react from '@vitejs/plugin-react'
echo.
echo // https://vitejs.dev/config/
echo export default defineConfig({
echo   plugins: [react()],
echo   base: '/my-website/',  // Necesar pentru GitHub Pages
echo   server: {
echo     // Acest lucru va asigura că în dezvoltare locală, calea de bază este aceeași
echo     base: '/my-website/'
echo   },
echo   define: {
echo     // Definim titlul proiectului ca variabilă globală
echo     __PROJECT_TITLE__: JSON.stringify('Lupul și Corbul')
echo   }
echo })
) > vite.config.ts

echo Configurație Vite creată cu succes!

echo.
echo === PASUL 3: CONFIGURARE PACKAGE.JSON ===
echo.

REM Verifică și actualizează titlul în index.html
echo Verificare titlu în index.html...
powershell -Command "(Get-Content index.html) -replace '<title>.*?</title>', '<title>Lupul și Corbul</title>' | Set-Content index.html"
echo Titlu actualizat: "Lupul și Corbul"

REM Verifică dacă există fișierul package.json
if not exist package.json (
    echo EROARE: package.json nu a fost găsit!
    echo Asigură-te că rulezi acest script în directorul rădăcină al proiectului.
    goto :error
)

REM Verifică și instalează dependențele necesare
echo Verificare dependențe necesare...
call npm list gh-pages --depth=0 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalare pachet gh-pages...
    call npm install gh-pages --save-dev
)

call npm list @vitejs/plugin-react --depth=0 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalare pachet @vitejs/plugin-react...
    call npm install @vitejs/plugin-react --save-dev
)

echo.
echo === PASUL 4: CREARE SCRIPT DE LANSARE RAPID ===
echo.

REM Creează un script rapid pentru lansarea VS Code și a serverului de dezvoltare
echo Creare script de lansare rapidă...
(
echo @echo off
echo color 0A
echo echo ********************************************************
echo echo *                                                      *
echo echo *           LANSARE PROIECT LUPUL ȘI CORBUL           *
echo echo *                                                      *
echo ********************************************************
echo echo.
echo.
echo echo === PORNIRE SERVER DEZVOLTARE ===
echo echo.
echo echo Deschidere VS Code...
echo start "" code .
echo.
echo echo Pornire server dezvoltare Vite...
echo start http://localhost:5173/my-website/ 
echo npm run dev
) > lansare-proiect.bat

REM Crează un script simplificat pentru deployment
echo Creare script de publicare simplificat...
(
echo @echo off
echo color 0A
echo echo ********************************************************
echo echo *                                                      *
echo echo *         PUBLICARE PROIECT LUPUL ȘI CORBUL           *
echo echo *                                                      *
echo ********************************************************
echo echo.
echo.
echo echo === PASUL 1: CONSTRUIRE PROIECT ===
echo echo.
echo call npm run build
echo.
echo if %%ERRORLEVEL%% NEQ 0 (
echo   echo EROARE: Nu s-a putut construi proiectul.
echo   goto :error
echo ^)
echo.
echo echo === PASUL 2: PUBLICARE PE GITHUB PAGES ===
echo echo.
echo call npm run deploy
echo.
echo if %%ERRORLEVEL%% NEQ 0 (
echo   echo EROARE: Publicare eșuată! Încercare metoda alternativă...
echo   call npx gh-pages -d dist
echo   if %%ERRORLEVEL%% NEQ 0 (
echo     echo EROARE CRITICĂ: Nu s-a putut publica pe GitHub Pages!
echo     goto :error
echo   ^)
echo ^)
echo.
echo echo.
echo echo === PUBLICARE FINALIZATĂ CU SUCCES! ===
echo echo.
echo echo Site-ul "Lupul și Corbul" va fi disponibil în curând la:
echo echo https://devalo1.github.io/my-website/
echo echo.
echo echo Notă: Poate dura câteva minute până când GitHub procesează modificările.
echo echo.
echo goto :end
echo.
echo :error
echo echo.
echo echo A apărut o eroare în procesul de publicare.
echo echo Contactează persoana care ți-a configurat proiectul pentru asistență.
echo echo.
echo.
echo :end
echo pause
) > publicare-site.bat

echo.
echo === PASUL 5: INSTRUCȚIUNI SIMPLE ===
echo.

echo Creare fișier README simplificat...
(
echo # Proiect "Lupul și Corbul"
echo.
echo ## Instrucțiuni simple
echo.
echo ### Pentru a lucra la proiect:
echo.
echo 1. Dublu-click pe fișierul `lansare-proiect.bat`
echo 2. Se va deschide VS Code și serverul de dezvoltare
echo 3. Poți edita fișierele în VS Code și vei vedea modificările în timp real
echo.
echo ### Pentru a publica site-ul:
echo.
echo 1. Când ești mulțumit de modificări, închide serverul de dezvoltare ^(Ctrl+C^)
echo 2. Dublu-click pe fișierul `publicare-site.bat`
echo 3. Așteptă până când publicarea este finalizată
echo 4. Site-ul va fi disponibil la: https://devalo1.github.io/my-website/
echo.
echo ## Fișiere importante:
echo.
echo - `src/` - Folderul cu codul sursă
echo - `public/` - Folderul pentru fișiere statice ^(imagini, etc.^)
echo - `vite.config.ts` - Configurația proiectului ^(NU modifica!^)
) > README-SIMPLU.md

echo.
echo === CONFIGURARE FINALIZATĂ CU SUCCES! ===
echo.
echo Proiectul "Lupul și Corbul" a fost configurat și optimizat!
echo.
echo 1. Am șters toate fișierele .bat inutile
echo 2. Am configurat corect Vite pentru GitHub Pages
echo 3. Am creat scripturile simple:
echo    - lansare-proiect.bat - pentru dezvoltare
echo    - publicare-site.bat - pentru publicare
echo.
echo Pentru a începe să lucrezi, execută:
echo   lansare-proiect.bat
echo.
echo Pentru a publica site-ul, execută:
echo   publicare-site.bat
echo.
echo Instrucțiuni detaliate se găsesc în README-SIMPLU.md
echo.
echo Notă: Acest script de configurare poate fi șters după ce ai terminat.
echo.

set /p sterge_script="Dorești să ștergi acest script de configurare? (d/n): "
if /i "%sterge_script%"=="d" (
    echo.
    echo Acest script se va auto-șterge după închidere...
    echo.
    echo Apasă orice tastă pentru a închide și a șterge scriptul...
    pause > nul
    
    REM Creează un script temporar care așteaptă ca procesul curent să se termine și apoi șterge acest script
    echo @echo off > "%TEMP%\delete_me.bat"
    echo ping -n 2 127.0.0.1 ^> nul >> "%TEMP%\delete_me.bat"
    echo del /F /Q "%~f0" >> "%TEMP%\delete_me.bat"
    echo del /F /Q "%%~f0" >> "%TEMP%\delete_me.bat"
    
    REM Pornește scriptul temporar
    start "" /min "%TEMP%\delete_me.bat"
    exit
)

:end
echo Apasă orice tastă pentru a închide...
pause > nul
exit /b 0

:error
echo.
echo A apărut o eroare în timpul configurării.
echo Verifică mesajele de eroare de mai sus.
pause
exit /b 1
