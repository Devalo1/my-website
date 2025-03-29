# Script pentru PowerShell care ajută la rularea scripturilor bat

function Show-Menu {
    Clear-Host
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host "    ASISTENT POWERSHELL PENTRU COMENZI GIT" -ForegroundColor Cyan
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host
    Write-Host "Acest script te va ajuta să execuți comenzile necesare" -ForegroundColor White
    Write-Host "pentru repararea problemelor Git și publicarea site-ului." -ForegroundColor White
    Write-Host
    Write-Host "Alege o opțiune din lista de mai jos:" -ForegroundColor Yellow
    Write-Host
    Write-Host "[1] Verificare stare repository" -ForegroundColor Green
    Write-Host "[2] Reparare interfață commit" -ForegroundColor Green
    Write-Host "[3] Commit automat cu timestamp" -ForegroundColor Green
    Write-Host "[4] Commit cu mesaj personalizat" -ForegroundColor Green
    Write-Host "[5] Publicare pe GitHub Pages" -ForegroundColor Green
    Write-Host "[6] Reparare probleme HEAD (în caz de erori)" -ForegroundColor Green
    Write-Host "[7] Resetare completă repository (ultimă soluție)" -ForegroundColor Green
    Write-Host "[8] Deschide Command Prompt (recomandat)" -ForegroundColor Magenta
    Write-Host "[0] Ieșire" -ForegroundColor Red
    Write-Host
}

# Funcție redenumită folosind un verb aprobat: "Invoke" în loc de "Execute"
function Invoke-BatchScript {
    param (
        [string]$scriptName,
        [string]$description
    )
    
    Clear-Host
    Write-Host "Executare $scriptName..." -ForegroundColor Yellow
    Write-Host $description -ForegroundColor Cyan
    Write-Host
    
    # Verifică dacă fișierul există
    if (Test-Path $scriptName) {
        # Execută scriptul cu prefix '.\'
        & ".\$scriptName"
    } else {
        Write-Host "EROARE: Fișierul $scriptName nu a fost găsit!" -ForegroundColor Red
    }
    
    Write-Host
    Write-Host "Apasă orice tastă pentru a reveni la meniu..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Open-CMD {
    Start-Process cmd.exe -ArgumentList "/K CD $PWD"
    Write-Host
    Write-Host "Command Prompt a fost deschis în directorul curent." -ForegroundColor Green
    Write-Host "Acum poți executa scripturile direct folosind numele lor." -ForegroundColor Green
    Write-Host
    Write-Host "Apasă orice tastă pentru a reveni la meniu..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Bucla principală a meniului
do {
    Show-Menu
    $choice = Read-Host "Introdu numărul opțiunii"
    
    switch ($choice) {
        "1" { Invoke-BatchScript "verificare-git-final.bat" "Acest script va verifica starea repository-ului și va identifica probleme." }
        "2" { Invoke-BatchScript "reparare-commit-ui.bat" "Acest script va repara problema cu mesajele de commit goale." }
        "3" { Invoke-BatchScript "auto-commit.bat" "Acest script va face commit automat cu timestamp." }
        "4" { Invoke-BatchScript "commit-sigur.bat" "Acest script te va ghida să faci un commit cu mesaj personalizat." }
        "5" { Invoke-BatchScript "publish-github-pages.bat" "Acest script va publica site-ul pe GitHub Pages." }
        "6" { Invoke-BatchScript "fix-git-head.bat" "Acest script va repara problemele cu referința HEAD." }
        "7" { Invoke-BatchScript "reset-total-git.bat" "Acest script va reseta complet repository-ul Git." }
        "8" { Open-CMD }
        "0" { 
            Clear-Host
            Write-Host "La revedere!" -ForegroundColor Cyan
            exit 
        }
        default { 
            Write-Host "Opțiune invalidă! Te rog să alegi din nou." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
} while ($true)
