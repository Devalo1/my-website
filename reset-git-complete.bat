@echo off
setlocal enabledelayedexpansion

echo *** Script de resetare completă a repository-ului Git ***
echo.

echo ATENȚIE: Acest script va șterge .git complet și va crea un repository nou.
echo Toate istoricul local va fi pierdut definitiv.
echo.
echo Apasă CTRL+C acum pentru a anula sau orice altă tastă pentru a continua...
pause >nul

echo.
echo 0. Oprire procese Git care ar putea bloca fișierele...
taskkill /F /IM git.exe 2>nul
taskkill /F /IM git-lfs.exe 2>nul
taskkill /F /IM git-credential-manager.exe 2>nul

echo.
echo 1. Salvare temporară a fișierelor importante...
mkdir .git_backup 2>nul
if exist .git\config copy .git\config .git_backup\config
if exist .git\hooks mkdir .git_backup\hooks && xcopy /s /y .git\hooks .git_backup\hooks\ >nul

echo.
echo 2. Ștergere completă a directorului .git...
attrib -h .git
rmdir /S /Q .git
if exist .git (
  echo EROARE: Nu s-a putut șterge .git, încearcă închiderea completă a VS Code și a altor programe.
  echo Încercare ștergere forțată a fișierelor .git\index.lock și .git\HEAD.lock...
  del /F /Q .git\index.lock 2>nul
  del /F /Q .git\HEAD.lock 2>nul
  rmdir /S /Q .git
  if exist .git (
    echo EROARE CRITICĂ: Nu s-a putut șterge .git. Te rugăm să închizi toate aplicațiile și să ștergi manual directorul.
    goto :cleanup
  )
)
echo Director .git șters cu succes.

echo.
echo 3. Inițializare repository nou...
git init
if !ERRORLEVEL! NEQ 0 (
  echo EROARE: Nu s-a putut inițializa repository-ul Git.
  goto :cleanup
)
echo Repository nou inițializat cu succes.

echo.
echo 4. Restaurare configurații salvate...
if exist .git_backup\config (
  copy .git_backup\config .git\config
  echo Configurații restaurate.
)
if exist .git_backup\hooks (
  xcopy /s /y .git_backup\hooks .git\hooks\ >nul
  echo Hook-uri restaurate.
)

echo.
echo 5. Configurare branch main...
git checkout -b main
if !ERRORLEVEL! NEQ 0 (
  echo EROARE: Nu s-a putut crea branch-ul main.
  goto :cleanup
)
echo Branch main creat cu succes.

echo.
echo 6. Adăugare fișiere în staging...
git add .
if !ERRORLEVEL! NEQ 0 (
  echo EROARE: Nu s-au putut adăuga fișierele în staging.
  goto :cleanup
)
echo Fișiere adăugate în staging.

echo.
echo 7. Creare commit inițial...
git commit -m "Inițializare proiect - resetare repository"
if !ERRORLEVEL! NEQ 0 (
  echo EROARE: Nu s-a putut crea commit-ul inițial.
  goto :cleanup
)
echo Commit inițial creat cu succes.

echo.
echo 8. Verificare status...
git status
echo.

echo 9. Instrucțiuni pentru GitHub Pages:
echo.
echo - Pentru a conecta la repository-ul existent pe GitHub:
echo   git remote add origin https://github.com/DEVALO1/my-website.git
echo   git push -f origin main
echo.
echo NOTĂ: Comanda push folosește -f (force) și va suprascrie istoricul remote.
echo Dacă ai modificări importante pe GitHub care nu sunt locale, fă un backup înainte.
echo.

:cleanup
echo.
echo 10. Curățare fișiere temporare...
rmdir /S /Q .git_backup 2>nul
echo.
echo *** Resetare completă terminată! ***

endlocal
