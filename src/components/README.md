# Cum să modifici site-ul

## Structura de fișiere importantă

```
my-website/
├── src/
│   ├── assets/            # Resurse statice (imagini, fonturi, etc.)
│   ├── components/        # Componente reutilizabile
│   │   ├── Header L.js    # Header pentru desktop
│   │   ├── Header M.js    # Header pentru mobil
│   │   ├── MobileProfile/ # Componente pentru profil pe mobil
│   │   └── ultra-fix.js   # Script pentru compatibilitate între pagini
│   ├── pages/             # Paginile site-ului
│   │   ├── Acasa.tsx      # Pagina principală
│   │   ├── Contact.tsx    # Pagina de contact
│   │   ├── Consiliere.tsx # Pagina de consiliere
│   │   ├── LupulSiCorbul.tsx # Pagina de brand
│   │   ├── Psihoterapie.tsx # Pagina de psihoterapie
│   │   └── TerapiaPersonalizata.tsx # Pagina de terapie
│   └── styles/            # Stilurile site-ului
│       ├── global.css     # Stiluri globale
│       └── styles.css     # Stiluri principale
└── public/                # Fișiere publice (accesibile direct)
    └── images/            # Imagini pentru site
        ├── cover.jpeg     # Imagine fundal
        ├── product1.jpg   # Imagine produs 1
        ├── product2.jpg   # Imagine produs 2
        └── product3.jpg   # Imagine produs 3
```

## Pagini disponibile

Site-ul conține următoarele pagini:

1. **Acasă** - Pagina principală
2. **Produse** - Prezentarea produselor disponibile
3. **Făuritorii de Destin** - Pagina despre ONG
4. **Terapie Personalizată** - Servicii de terapie
5. **Contact** - Informații de contact

## Cum să modifici conținutul

Pentru a modifica conținutul unei pagini, localizează fișierul corespunzător în directorul `src/pages/` și editează-l conform nevoilor tale.

## Stilurile site-ului

Stilurile principale se găsesc în `src/styles/styles.css`. Pentru a modifica aspectul întregului site, editează acest fișier.

## Imagini

Toate imaginile trebuie plasate în directorul `public/images/` pentru a fi accesibile pe site.

