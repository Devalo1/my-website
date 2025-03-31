// Script pentru încărcarea produselor din fișierul JSON în Firebase Firestore

import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "my-website-xxxxx.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "my-website-xxxxx",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "my-website-xxxxx.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "xxxxxxxxxxxx",
  appId: process.env.FIREBASE_APP_ID || "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadProducts() {
  try {
    // Citire fișier JSON local
    const jsonPath = 'data/products.json';
    const fileData = readFileSync(jsonPath, 'utf8');
    const products = JSON.parse(fileData);
    
    console.log(`Încărcare ${products.length} produse în Firestore...`);
    
    // Trimitere produse către Firestore
    const batch = [];
    for (const product of products) {
      const productId = product.id;
      const productRef = doc(db, 'products', productId);
      
      // Excludem ID-ul din obiectul care va fi salvat
      const { id, ...productData } = product;
      
      batch.push(setDoc(productRef, productData));
      console.log(`Pregătit pentru încărcare: ${product.name}`);
    }
    
    // Executăm toate operațiunile
    await Promise.all(batch);
    
    console.log('Toate produsele au fost încărcate cu succes!');
  } catch (error) {
    console.error('Eroare la încărcarea produselor:', error);
  }
}

// Executăm funcția de încărcare
uploadProducts().then(() => {
  console.log('Script finalizat.');
  process.exit(0);
}).catch(err => {
  console.error('Eroare în script:', err);
  process.exit(1);
});
