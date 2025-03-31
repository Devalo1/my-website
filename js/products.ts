import { db } from './firebase-config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  fullDescription: string;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specifications: Record<string, string>;
  variants: string[];
  category: string;
  freeShipping: boolean;
}

/**
 * Încarcă toate produsele sau din cache dacă sunt disponibile
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Încearcă mai întâi să obțină produsele din cache
    const cachedProducts = sessionStorage.getItem('products');
    if (cachedProducts) {
      return JSON.parse(cachedProducts);
    }
    
    // Dacă nu sunt în cache, încarcă din Firestore
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    
    const products = productsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as Product;
    });
    
    // Salvează în cache pentru utilizare ulterioară
    sessionStorage.setItem('products', JSON.stringify(products));
    
    return products;
  } catch (error) {
    console.error('Eroare la încărcarea produselor:', error);
    
    // Încearcă să încarce din fișierul JSON local ca backup
    try {
      const response = await fetch('/data/products.json');
      const products = await response.json();
      return products;
    } catch (jsonError) {
      console.error('Eroare la încărcarea produselor din JSON:', jsonError);
      return [];
    }
  }
}

/**
 * Obține un produs după ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    // Încearcă mai întâi din cache
    const cachedProducts = sessionStorage.getItem('products');
    if (cachedProducts) {
      const products = JSON.parse(cachedProducts) as Product[];
      const product = products.find(p => p.id === productId);
      if (product) return product;
    }
    
    // Dacă nu este în cache, încearcă din Firestore
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data()
      } as Product;
    }
    
    // Dacă nu există în Firestore, încearcă din JSON local
    const response = await fetch('/data/products.json');
    const products = await response.json() as Product[];
    return products.find(p => p.id === productId) || null;
    
  } catch (error) {
    console.error(`Eroare la obținerea produsului cu ID ${productId}:`, error);
    return null;
  }
}

/**
 * Filtrează produsele după categorie
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await getAllProducts();
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error(`Eroare la filtrarea produselor după categoria ${category}:`, error);
    return [];
  }
}

/**
 * Caută produse după cuvinte cheie
 */
export async function searchProducts(keyword: string): Promise<Product[]> {
  try {
    const products = await getAllProducts();
    const searchTerm = keyword.toLowerCase();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error(`Eroare la căutarea produselor după termenul ${keyword}:`, error);
    return [];
  }
}

/**
 * Sortează produsele după diferite criterii
 */
export function sortProducts(products: Product[], sortType: string): Product[] {
  switch (sortType) {
    case 'price-low':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-high':
      return [...products].sort((a, b) => b.price - a.price);
    case 'name-asc':
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}
