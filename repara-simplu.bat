@echo off
echo === SCRIPT DE URGENȚĂ PENTRU REPARARE GIT ===
echo.
echo Acest script va repara eroarea:
echo "cannot lock ref 'HEAD': is at [hash] but expected [hash]"
echo.

REM Oprire VS Code
echo 1. Închidere VS Code și procese Git...
taskkill /F /IM Code.exe >nul 2>&1
taskkill /F /IM git.exe >nul 2>&1
timeout /t 2 >nul

REM Backup rapid
echo 2. Creare backup al fișierelor importante...
set "BACKUP=%TEMP%\site_backup_%RANDOM%"
mkdir "%BACKUP%" 2>nul
xcopy * "%BACKUP%\" /E /H /I /Y /EXCLUDE:.git\* >nul 2>&1
echo   Backup creat în: %BACKUP%

REM Ștergere .git complet
echo 3. Resetare completă Git...
attrib -h .git 2>nul
rmdir /S /Q .git
if exist .git (
  echo   EROARE: Nu s-a putut șterge directorul .git!
  echo   Închide toate programele și încearcă din nou.
  goto :eof
)

REM Recreare repository
echo 4. Inițializare repository nou...
git init
git checkout -b main

echo 5. Adaugă toate fișierele...
git add .

echo 6. Creare commit inițial...
git commit -m "Resetare completă repository"

echo 7. Configurare remote GitHub...
git remote add origin https://github.com/DEVALO1/my-website.git

echo.
echo === REZOLVARE COMPLETĂ! ===
echo.
echo Acum rulează:
echo    git push -f origin main
echo.
echo Apoi deschide VS Code cu:
echo    code . --disable-extension ms-vscode.git
echo.
echo Apasă orice tastă pentru a închide...
pause >nul
