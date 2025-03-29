# Verificare Căi Resurse pentru GitHub Pages

Pentru ca site-ul să arate identic local și pe GitHub Pages, verifică următoarele:

## 1. Toate resursele trebuie să înceapă cu `/my-website/`

### Imagini:
```jsx
// CORECT ✅
<img src="/my-website/images/logo.png" alt="Logo" />

// GREȘIT ❌
<img src="/images/logo.png" alt="Logo" />
```

### CSS Backgrounds:
```css
/* CORECT ✅ */
background-image: url('/my-website/images/background.jpg');

/* GREȘIT ❌ */
background-image: url('/images/background.jpg');
```

### Link-uri:
```jsx
// CORECT ✅
<a href="/my-website/about">About</a>

// GREȘIT ❌
<a href="/about">About</a>
```

## 2. Verifică structura directorului `public`

Toate resursele statice trebuie să fie în directorul `public`:

