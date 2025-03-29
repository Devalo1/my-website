# Ghid de Troubleshooting pentru Deploy

Dacă site-ul tău local (http://localhost:5173/my-website/) arată diferit față de versiunea publicată pe GitHub Pages (https://devalo1.github.io/my-website/), verifică aceste aspecte:

## 1. Verifică fișierele din directorul /public

Imaginile și alte resurse statice trebuie să fie în directorul `/public` al proiectului. Când folosești aceste resurse în cod, utilizează path-uri relative la baza site-ului:

```jsx
// Corect - Funcționează local și pe GitHub Pages
<img src="/my-website/images/poza.jpg" alt="Descriere" />

// Incorect - Funcționează doar local
<img src="/images/poza.jpg" alt="Descriere" />
```

## 2. Verifică referințele de imagini și resurse

Asigură-te că toate referințele la imagini și alte resurse includ base path-ul `/my-website/`:

```jsx
// În fișierele CSS
background-image: url('/my-website/images/fundal.jpg');

// În atributele style inline
style={{ backgroundImage: `url('/my-website/images/fundal.jpg')` }}
```

## 3. Verifică workflow-ul GitHub Actions

Workflow-ul de GitHub Actions trebuie să construiască și să publice site-ul corect. Verifică fișierul `.github/workflows/deploy.yml` și asigură-te că:
- Instalează dependențele corect
- Rulează comanda de build cu base path configurat
- Publică conținutul directorului `dist`

## 4. Forțează o rebuild completă

Uneori, cache-ul poate cauza probleme. Încearcă să forțezi o rebuild completă:

1. Șterge directoarele `node_modules` și `dist` local
2. Rulează `npm install` 
3. Rulează `npm run build`
4. Fă un commit și push
5. Verifică acțiunea GitHub din tab-ul Actions

## 5. Verifică conținutul directorului dist după build

După ce rulezi `npm run build` local, verifică directorul `dist` pentru a te asigura că toate resursele tale sunt incluse corect.

## 6. Verifică configurația Vite

Confirmă că `vite.config.tsx` include corect baza:

```js
export default defineConfig({
  plugins: [react()],
  base: '/my-website/',
});
```
