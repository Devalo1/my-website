# Cum să folosești scripturile pentru Git

## Explicație simplă

Toate scripturile pentru Git sunt fișiere `.bat` care trebuie rulate în terminal (Command Prompt).

## Pași pentru a rula un script:

### Metoda 1: Din Windows Explorer (Cea mai simplă)
1. Deschide folderul proiectului (`c:\Proiect\my-website`) în Windows Explorer
2. Fă dublu-click pe scriptul dorit (ex: `auto-commit.bat`)
3. Se va deschide o fereastră neagră de terminal și scriptul va rula

### Metoda 2: Din Command Prompt (CMD)
1. Apasă `Windows + R` pe tastatură
2. Scrie `cmd` și apasă Enter
3. În fereastra neagră care apare, navighează la directorul proiectului:
   ```
   cd c:\Proiect\my-website
   ```
4. Rulează scriptul scriind numele lui și apăsând Enter:
   ```
   auto-commit.bat
   ```

### Metoda 3: Din PowerShell
1. Apasă `Windows + R` pe tastatură
2. Scrie `powershell` și apasă Enter
3. În fereastra albastră care apare, navighează la directorul proiectului:
   ```
   cd c:\Proiect\my-website
   ```
4. Rulează scriptul adăugând `.\` înainte de numele lui:
   ```
   .\auto-commit.bat
   ```

## Ce script să folosesc?

1. **Pentru a face commit la modificări**:
   - Folosește `auto-commit.bat` (cel mai simplu)

2. **Pentru a publica pe GitHub**:
   - Folosește `publish-github-pages.bat`

3. **Dacă ai probleme**:
   - Folosește `fix-git-head.bat`

## Exemplu practic:

Să zicem că ai modificat niște fișiere și vrei să faci commit:

1. Fă dublu-click pe `auto-commit.bat` din Windows Explorer
2. Aștepți să termine
3. Apoi fă dublu-click pe `publish-github-pages.bat` pentru a publica

Atât! Este foarte simplu.
