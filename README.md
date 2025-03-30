# My Website

## Dezvoltare

Pentru a dezvolta site-ul local:

```bash
# Instalează dependențele
npm install

# Pornește serverul de dezvoltare
npm run dev
```

Accesează site-ul la http://localhost:5173/my-website/

## Structura proiectului

- `src/` - Codul sursă React
- `public/` - Fișiere statice (imagini, fonturi, etc.)
- `.github/workflows/` - Configurație GitHub Actions pentru deploy

## Workflow pentru modificări

1. Dezvoltare locală:
   - Modifică fișierele din `src/`
   - Testează modificările local

2. Commit:
   - Rulează `auto-commit.bat` pentru a face commit la modificări

3. Publicare:
   - Rulează `publish-github-pages.bat` pentru a publica pe GitHub Pages

## Verificare site publicat

Site-ul este publicat automat la: https://devalo1.github.io/my-website/

## Scripturi utile

- `fix-local-dev.bat` - Ghid interactiv pentru dezvoltare
- `auto-commit.bat` - Salvează modificările în Git
- `publish-github-pages.bat` - Publică site-ul pe GitHub Pages
