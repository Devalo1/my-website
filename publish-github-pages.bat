@echo off
echo *** PUBLICARE PE GITHUB PAGES ***
echo.
echo Acest script va pregăti și publica site-ul tău pe GitHub Pages.
echo.

REM Verifică dacă avem modificări necommise
git status --porcelain > nul
if %ERRORLEVEL% EQU 0 (
  echo Repository-ul este curat, nu există modificări necommise.
) else (
  echo Există modificări care nu au fost salvate.
  echo.
  set /p continua="Dorești să faci commit la aceste modificări? (d/n): "
  if /i "%continua%"=="d" (
    set /p mesaj="Introdu mesajul de commit: "
    if "%mesaj%"=="" set "mesaj=Actualizare site"
    
    git add .
    git commit -m "%mesaj%"
    
    if %ERRORLEVEL% NEQ 0 (
      echo Eroare la commit. Folosește script-ul commit-sigur.bat
      goto :eof
    )
  ) else (
    echo Operațiune anulată.
    goto :eof
  )
)

echo.
echo Pregătire pentru publicare pe GitHub Pages...
echo.

REM Asigură-te că remote este configurat corect
git remote -v | find "origin" > nul
if %ERRORLEVEL% NEQ 0 (
  echo Configurare remote...
  git remote add origin https://github.com/DEVALO1/my-website.git
  echo Remote configurat.
)

REM Verifică dacă branch-ul există pe remote
git ls-remote --heads origin main > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Branch-ul main nu există încă pe GitHub.
  echo Se va crea acum.
) else (
  echo Branch-ul main există pe GitHub.
)

echo.
echo Publicare pe GitHub...
git push -f origin main

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Eroare la publicare! Încearcă următoarele:
  echo 1. Verifică dacă ai acces la repository
  echo 2. Asigură-te că ai configurat corect autentificarea GitHub
  echo 3. Încearcă să rulezi fix-git-head.bat și apoi încearcă din nou
) else (
  echo.
  echo Site-ul a fost publicat cu succes pe GitHub Pages!
  echo.
  echo Site-ul tău va fi disponibil în curând la adresa:
  echo https://devalo1.github.io/my-website/
  echo.
  echo Notă: Poate dura câteva minute până când GitHub Pages
  echo       va procesa și afișa schimbările.
)

echo.
echo *** Proces finalizat! ***
