@echo off
setlocal enabledelayedexpansion

echo *** RESET TOTAL REPOSITORY GIT ***
echo.
echo ATENȚIE: Acest script:
echo 1. Va închide VS Code
echo 2. Va șterge cache-ul git din VS Code
echo 3. Va șterge total directorul .git
echo 4. Va reinițializa repository-ul de la zero
echo.
echo Toate datele locale Git vor fi pierdute definitiv!
echo.
echo Apasă CTRL+C pentru a anula sau orice altă tastă pentru a continua...
pause >nul

echo.
echo 1. Închidere VS Code...
taskkill /F /IM Code.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo 2. Închidere procese Git...
taskkill /F /IM git.exe >nul 2>&1
taskkill /F /IM git-lfs.exe >nul 2>&1
taskkill /F /IM git-credential-manager.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo 3. Ștergere cache VS Code pentru acest proiect...
if exist "%APPDATA%\Code\User\workspaceStorage" (
    echo Curățare storage workspace VS Code...
    rd /s /q "%APPDATA%\Code\User\workspaceStorage" >nul 2>&1
)

echo.
echo 4. Salvare fișiere de proiect importante (non-git)...
set "BACKUP_DIR=%TEMP%\git_reset_backup_%RANDOM%"
mkdir "%BACKUP_DIR%" >nul 2>&1
xcopy /E /Y /EXCLUDE:.git\* . "%BACKUP_DIR%\" >nul
echo Backup creat în: %BACKUP_DIR%

echo.
echo 5. Ștergere forțată a directorului .git...
attrib -h .git
rmdir /s /q .git >nul 2>&1
if exist .git (
    echo Încercare ștergere forțată a fișierelor blocate...
    del /f /s /q .git\* >nul 2>&1
    rmdir /s /q .git >nul 2>&1
    
    if exist .git (
        echo EROARE: Nu se poate șterge directorul .git
        echo Încearcă să ștergi manual directorul .git, apoi rulează din nou acest script.
        goto :eof
    )
)
echo Director .git șters cu succes.

echo.
echo 6. Inițializare repository Git nou...
git init
if !ERRORLEVEL! NEQ 0 (
    echo EROARE: Nu s-a putut inițializa repository-ul Git.
    goto :eof
)

echo.
echo 7. Configurare Git...
git config --local user.name "Numele Tău"
git config --local user.email "emailul-tau@example.com"
echo Configurare Git completă.

echo.
echo 8. Creare .gitignore bază...
echo node_modules> .gitignore
echo .DS_Store>> .gitignore
echo .env>> .gitignore
echo .env.local>> .gitignore
echo dist>> .gitignore
echo build>> .gitignore
echo Fișier .gitignore creat.

echo.
echo 9. Creare branch main...
git checkout -b main
if !ERRORLEVEL! NEQ 0 (
    echo EROARE: Nu s-a putut crea branch-ul main.
    goto :eof
)

echo.
echo 10. Adăugare fișiere în staging...
git add .
if !ERRORLEVEL! NEQ 0 (
    echo EROARE: Nu s-au putut adăuga fișierele în staging.
    goto :eof
)

echo.
echo 11. Creare commit inițial...
git commit -m "Inițializare proiect cu repository Git nou"
if !ERRORLEVEL! NEQ 0 (
    echo EROARE: Nu s-a putut crea commit-ul inițial.
    goto :eof
)

echo.
echo 12. Configurare remote pentru GitHub...
git remote add origin https://github.com/DEVALO1/my-website.git
echo Remote configurat.

echo.
echo === RESETARE COMPLETĂ ===
echo.
echo Repository-ul Git a fost recreat complet.
echo.
echo PENTRU A FACE PUSH PE GITHUB:
echo git push -f origin main
echo.
echo NOTĂ IMPORTANTĂ: Înainte de a redeschide VS Code, rulează:
echo code --disable-extension ms-vscode.git
echo.
echo Aceasta va deschide VS Code fără extensia Git integrată, iar 
echo apoi poți reinstala extensia manual, dacă dorești.
echo.
echo Proces finalizat!

endlocal
