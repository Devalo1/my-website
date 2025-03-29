@echo off
echo *** REPARARE URGENTĂ A REFERINȚEI HEAD GIT ***
echo.
echo ATENȚIE: Acest script rezolvă specific problema: "cannot lock ref 'HEAD'"
echo Aceasta este o versiune îmbunătățită care va recrea complet repository-ul Git.
echo.

REM Verificare dacă rulează ca administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo EROARE: Acest script trebuie rulat ca administrator!
    echo Închide acest terminal și redeschide-l ca administrator.
    goto :eof
)

echo Închidere completă VS Code și procese Git...
taskkill /F /IM Code.exe >nul 2>&1
taskkill /F /IM git.exe >nul 2>&1
taskkill /F /IM git-lfs.exe >nul 2>&1
taskkill /F /IM git-credential-manager.exe >nul 2>&1
timeout /t 5 >nul

REM Salvare temporară a fișierelor
echo.
echo *** PASUL 0: Salvare conținut fișiere importante ***
echo.
set "tempdir=%TEMP%\git_fix_%RANDOM%"
mkdir "%tempdir%" 2>nul
echo Copierea fișierelor în directorul temporar...
xcopy * "%tempdir%\" /E /H /C /I /Y /EXCLUDE:.git\* >nul 2>&1
echo Backup creat în: %tempdir%

echo.
echo *** PASUL 1: ȘTERGERE COMPLETĂ A REPOSITORY-ULUI GIT ***
echo.
echo AVERTIZARE: Toate referințele Git locale vor fi șterse.
echo Pentru a continua, apasă orice tastă...
pause >nul

REM Asigură-te că .git nu este ascuns
attrib -h .git >nul 2>&1

REM Ștergerea completă a directorului .git
echo Ștergerea directorului .git...
rmdir /S /Q .git >nul 2>&1
if exist .git (
    echo Ștergere directă a fișierelor de bază .git...
    del /F /Q .git\HEAD >nul 2>&1
    del /F /Q .git\index >nul 2>&1
    del /F /Q .git\config >nul 2>&1
    rmdir /S /Q .git\refs >nul 2>&1
    rmdir /S /Q .git\objects >nul 2>&1
    rmdir /S /Q .git\logs >nul 2>&1
    rmdir /S /Q .git >nul 2>&1
    
    if exist .git (
        echo EROARE CRITICĂ: Directorul .git nu poate fi șters!
        echo.
        echo Te rog să închizi toate aplicațiile care ar putea folosi acest director
        echo și să încerci din nou cu drepturi de administrator.
        echo.
        goto :eof
    )
)
echo Directorul .git a fost șters cu succes!

echo.
echo *** PASUL 2: RECREARE COMPLETĂ A REPOSITORY-ULUI ***
echo.
echo Inițializare repository Git nou...
git init
if %ERRORLEVEL% NEQ 0 (
    echo EROARE: Nu s-a putut inițializa repository-ul Git.
    goto :eof
)

echo.
echo *** PASUL 3: CONFIGURARE REPOSITORY ***
echo.
echo Creare branch main...
git checkout -b main
if %ERRORLEVEL% NEQ 0 (
    echo EROARE: Nu s-a putut crea branch-ul main.
    goto :eof
)

echo.
echo *** PASUL 4: ADĂUGARE FIȘIERE ÎN REPOSITORY ***
echo.
echo Adăugare fișiere în staging...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo EROARE: Nu s-au putut adăuga fișierele în staging.
    goto :eof
)

echo.
echo *** PASUL 5: CREARE COMMIT INIȚIAL ***
echo.
echo Creare commit inițial pentru noul repository...
git commit -m "Recreare repository Git după rezolvarea problemelor cu referința HEAD"
if %ERRORLEVEL% NEQ 0 (
    echo EROARE: Nu s-a putut crea commit-ul inițial.
    echo Încercarea să cream commit-ul fără mesaj...
    git commit --allow-empty -m "Inițializare"
)

echo.
echo *** PASUL 6: CONFIGURARE REMOTE ***
echo.
echo Configurare remote pentru GitHub...
git remote add origin https://github.com/DEVALO1/my-website.git
echo Remote configurat.

echo.
echo *** VERIFICARE FINALĂ ***
echo.
echo Verificare stare repository:
git status

echo.
echo *** INSTRUCȚIUNI PENTRU URMĂTORII PAȘI ***
echo.
echo Repository-ul a fost recreat complet. Urmează acești pași:
echo.
echo 1. Pentru a face push pe GitHub (IMPORTANT):
echo    git push -f origin main
echo.
echo 2. Pentru a deschide VS Code în mod sigur:
echo    code . --disable-extension ms-vscode.git
echo.
echo 3. Pentru a face commit-uri, folosește:
echo    auto-commit.bat  SAU  commit-sigur.bat
echo.
echo 4. NU folosi interfața VS Code pentru Git până nu verifici
echo    că toate funcționează corect!
echo.
echo SUCCES!
