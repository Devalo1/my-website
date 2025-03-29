# Instrucțiuni pentru Gestionarea Repository-ului Git

Acest document conține instrucțiuni pentru rezolvarea problemelor Git și pentru gestionarea repository-ului tău.

## Cum să Rulezi Scripturile

### În Command Prompt (CMD) - Metoda Recomandată

1. Apasă tastele `Windows + R` pentru a deschide fereastra Run
2. Tastează `cmd` și apasă Enter
3. În fereastra CMD, navighează la directorul proiectului:
   ```
   cd c:\Proiect\my-website
   ```
4. Rulează scripturile direct introducând numele lor:
   ```
   verificare-git-final.bat
   ```

### În PowerShell

Dacă folosești PowerShell, există două metode:

1. **Metoda cu prefix**:
   ```powershell
   .\verificare-git-final.bat
   ```

2. **Folosind scriptul helper PowerShell**:
   ```powershell
   .\powershell-helper.ps1
   ```
   Acest script va afișa un meniu interactiv și va rula scripturile pentru tine.

## Pași Recomandați

1. **Verifică starea repository-ului**:
   ```
   verificare-git-final.bat
   ```

2. **Repară interfața de commit**:
   ```
   reparare-commit-ui.bat
   ```

3. **Fă commit-uri**:
   - Pentru commit automat cu timestamp:
     ```
     auto-commit.bat
     ```
   - Pentru commit cu mesaj personalizat:
     ```
     commit-sigur.bat
     ```

4. **Publică pe GitHub Pages**:
   ```
   publish-github-pages.bat
   ```

## Rezolvarea Problemelor Comune

- **Erori "cannot lock ref 'HEAD'"**:
  ```
  fix-git-head.bat
  ```

- **Probleme de commit goale**:
  ```
  reparare-commit-ui.bat
  ```

- **Dacă nimic nu funcționează**:
  ```
  reset-total-git.bat
  ```

## Sfaturi pentru Evitarea Problemelor în Viitor

1. Folosește scripturile pentru commit în loc de interfața VS Code
2. Fă commit-uri mici și frecvente
3. Rulează verificare-git-final.bat periodic
4. Evită să ai VS Code și alte aplicații Git deschise simultan

## Resurse Incluse

- `verificare-git-final.bat` - Verifică starea repository-ului
- `reparare-commit-ui.bat` - Repară interfața commit
- `auto-commit.bat` - Commit automat cu timestamp
- `commit-sigur.bat` - Commit cu mesaj personalizat
- `publish-github-pages.bat` - Publică pe GitHub Pages
- `fix-git-head.bat` - Repară probleme HEAD
- `reset-total-git.bat` - Resetare completă repository
- `powershell-helper.ps1` - Asistent pentru PowerShell
- `ajutor-comenzi.bat` - Asistent interactiv pentru CMD
