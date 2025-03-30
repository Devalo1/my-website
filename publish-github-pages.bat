@echo off
echo *** PUBLICARE PE GITHUB PAGES ***
echo.
echo Acest script va pregăti și publica site-ul tău pe GitHub Pages.
echo.

REM Verifică dacă există configurația vite.config.ts corectă
if not exist vite.config.ts (
  echo Configurația vite.config.ts lipsește! Se rulează scriptul de curățare...
  call npm run clean-config
)

REM Verifică dacă avem modificări necommise
git status --porcelain > temp.txt
set /p status=<temp.txt
del temp.txt

if "%status%"=="" (
  echo Repository-ul este curat, nu există modificări necommise.
) else (
  echo Există modificări care nu au fost salvate.
  echo.
  set /p continua="Dorești să faci commit la aceste modificări? (d/n): "
  if /i "%continua%"=="d" (
    set /p mesaj="Introdu mesajul de commit (lasă gol pentru mesaj automat): "
    if "%mesaj%"=="" (
      for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
      set data=%%datetime:~0,8%%
      set ora=%%datetime:~8,6%%
      set mesaj=Actualizare site %%data:~6,2%%-%%data:~4,2%%-%%data:~0,4%% %%ora:~0,2%%:%%ora:~2,2%%
    )
    
    git add .
    git commit -m "%mesaj%"
    
    if %ERRORLEVEL% NEQ 0 (
      echo Eroare la commit. Încercare alternativă...
      del /F /Q .git\index.lock 2>nul
      del /F /Q .git\HEAD.lock 2>nul
      git commit -m "%mesaj%"
      
      if %ERRORLEVEL% NEQ 0 (
        echo Eroare persistentă la commit. Se abandonează operațiunea.
        goto :eof
      )
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
  git remote add origin https://github.com/Devalo1/my-website.git
  echo Remote configurat.
)

REM Construiește proiectul
echo Construirea proiectului pentru producție...
call npm run build

if %ERRORLEVEL% NEQ 0 (
  echo Eroare la construirea proiectului!
  goto :eof
)

REM Publicare pe GitHub Pages
echo.
echo Publicare pe GitHub Pages...
call npm run deploy

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Eroare la publicare! Încercare alternativă...
  REM Încercare de publicare manuală
  git push origin main
  
  if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Eroare persistentă la publicare! Încearcă următoarele:
    echo 1. Verifică dacă ai acces la repository
    echo 2. Asigură-te că ai configurat corect autentificarea GitHub
    echo 3. Încearcă să rulezi fix-git-head.bat și apoi încearcă din nou
  ) else (
    echo.
    echo Codul sursă a fost publicat pe GitHub. 
    echo Pentru a finaliza publicarea site-ului, urmează acești pași:
    echo 1. Deschide https://github.com/Devalo1/my-website/settings/pages
    echo 2. Selectează branch-ul gh-pages pentru Source
    echo 3. Apasă Save
  )
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
pause
