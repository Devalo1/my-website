/**
 * EXPLICAȚIE: DE CE APAR CONFLICTE ÎNTRE APLICAȚII GIT
 * 
 * Problema de bază constă în felul în care diferite aplicații folosesc Git:
 * 
 * 1. VS Code:
 *    - Folosește extensia Git încorporată
 *    - Monitorizează constant repository-ul în fundal
 *    - Face auto-fetch periodic
 *    - Creează fișiere de blocare temporare (.git/index.lock, .git/HEAD.lock)
 * 
 * 2. GitHub Desktop:
 *    - Folosește propriul client Git
 *    - Creează de asemenea fișiere de blocare când efectuează operațiuni
 * 
 * 3. Linia de comandă (cmd/terminal):
 *    - Utilizează direct Git CLI
 *    - Creează și ea fișiere de blocare
 * 
 * CÂND APARE PROBLEMA:
 * Problema "cannot lock ref 'HEAD'" apare când:
 *   - O aplicație încearcă să modifice HEAD în timp ce alta deja a blocat-o
 *   - O aplicație așteaptă ca HEAD să fie într-o stare, dar alta a modificat-o între timp
 * 
 * CUM SĂ FOLOSEȘTI ÎMPREUNĂ VS CODE ȘI GITHUB DESKTOP:
 * 
 * 1. Opțiunea recomandată: Folosește doar una dintre aplicații pentru operațiunile Git
 *    - VS Code pentru cod + GitHub Desktop doar pentru operațiunile Git
 *    - SAU
 *    - VS Code pentru tot (cod + Git)
 * 
 * 2. Dacă trebuie să folosești ambele:
 *    - Dezactivează auto-fetch în VS Code (Settings > Git > Autofetch)
 *    - Fă commit-uri dintr-o singură aplicație (preferabil GitHub Desktop)
 *    - După operațiuni Git în GitHub Desktop, folosește "Refresh" în VS Code
 * 
 * FLUXUL DE LUCRU RECOMANDAT:
 * 
 * 1. Editează codul în VS Code
 * 2. Când vrei să faci commit:
 *    a) Fie folosește auto-commit.bat (cel mai sigur)
 *    b) Fie comută la GitHub Desktop și fă commit de acolo
 *    c) Fie dezactivează extensia Git din VS Code: code . --disable-extension ms-vscode.git
 */
