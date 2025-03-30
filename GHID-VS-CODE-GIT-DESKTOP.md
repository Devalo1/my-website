# Cum să folosești VS Code și GitHub Desktop împreună

VS Code și GitHub Desktop pot funcționa împreună, dar ai nevoie să folosești câteva practici bune pentru a evita conflictele.

## Configurare recomandată

### În VS Code:

1. **Dezactivează auto-fetch**:
   - Deschide setările (File > Preferences > Settings)
   - Caută "git.autofetch"
   - Dezactivează această opțiune

2. **Opțional: Dezactivează complet extensia Git pentru sesiunea curentă**:
   - Închide VS Code
   - Redeschide cu comanda: `code . --disable-extension ms-vscode.git`
   - Aceasta va dezactiva extensia Git doar pentru sesiunea curentă

### În GitHub Desktop:

1. **Alege repository-ul** din lista de repository-uri
2. **Nu ține GitHub Desktop deschis** în timp ce efectuezi operațiuni Git din VS Code

## Flux de lucru recomandat

### Metoda 1: VS Code pentru cod, GitHub Desktop pentru Git

1. **Editare cod**:
   - Folosește VS Code pentru a edita codul sursă
   - Salvează fișierele

2. **Operațiuni Git**:
   - Deschide GitHub Desktop
   - Verifică modificările
   - Fă commit și push

3. **Revenire la cod**:
   - Continuă lucrul în VS Code
   - Folosește "Pull" din GitHub Desktop când ai nevoie să actualizezi

### Metoda 2: Folosește GitHub Desktop + VS Code cu Git dezactivat

1. **Editare cod**:
   - Deschide VS Code cu Git dezactivat: `code . --disable-extension ms-vscode.git`
   - Editează și salvează codul

2. **Operațiuni Git**:
   - Folosește GitHub Desktop pentru toate operațiunile Git

### Metoda 3: Folosește auto-commit.bat cu VS Code

1. **Editare cod**:
   - Folosește VS Code normal pentru editare

2. **Operațiuni Git**:
   - Închide VS Code complet când vrei să faci commit
   - Rulează `auto-commit.bat` pentru commit
   - Rulează `publish-github-pages.bat` pentru push
   - Redeschide VS Code după operațiunile Git

## Când apar probleme

Dacă întâmpini eroarea "cannot lock ref 'HEAD'":

1. Închide atât VS Code cât și GitHub Desktop
2. Rulează `fix-git-head.bat` ca administrator
3. Redeschide aplicațiile una câte una

## Concluzie

VS Code și GitHub Desktop pot funcționa împreună, dar trebuie să fii atent să nu efectuezi operațiuni Git simultane din ambele aplicații.

Cea mai sigură metodă este să folosești una pentru cod și cealaltă exclusiv pentru Git, sau să folosești scripturile bat furnizate pentru operațiunile Git.
