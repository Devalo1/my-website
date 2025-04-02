import { useState, useEffect } from 'react';
import { 
  collection, query, where, orderBy, limit, 
  startAfter, getDocs, DocumentData, QueryDocumentSnapshot,
  onSnapshot, Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, ProductFilters } from '../types';

const PRODUCTS_PER_PAGE = 20;

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  refresh: () => void;
}

/**
 * Hook pentru interogarea și afișarea produselor cu paginare și filtrare
 * @param filters Filtrele aplicate pentru produse
 * @returns Produsele, statusul încărcării, controlul paginării
 */
export function useProducts(filters?: ProductFilters): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const buildQuery = (startAfterDoc?: QueryDocumentSnapshot<DocumentData>) => {
    // Inițiem colecția produselor
    let productsQuery = query(collection(db, 'products'), orderBy('name', 'asc'));

    // Adăugăm filtrele
    if (filters) {
      if (filters.category) {
        productsQuery = query(productsQuery, where('category', '==', filters.category));
      }
      
      if (filters.inStock) {
        productsQuery = query(productsQuery, where('stock', '>', 0));
      }
      
      // Notă: Firestore nu suportă filtrare pentru interval (min-max) într-o singură interogare
      // Acestea vor fi filtrate în client
    }
    
    // Adăugăm limitarea și punctul de start pentru paginare
    if (startAfterDoc) {
      return query(productsQuery, startAfter(startAfterDoc), limit(PRODUCTS_PER_PAGE));
    }
    
    return query(productsQuery, limit(PRODUCTS_PER_PAGE));
  };

  const loadProducts = async (isRefresh = false) => {
    try {
      setLoading(true);
      
      // Construim interogarea
      const q = buildQuery(isRefresh ? null : lastDoc);
      
      // Obținem produsele
      const querySnapshot = await getDocs(q);
      
      // Transformăm documentele în obiecte Product
      let fetchedProducts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Product;
      });
      
      // Filtrare client-side pentru preț
      if (filters) {
        if (filters.minPrice !== undefined) {
          fetchedProducts = fetchedProducts.filter(p => p.price >= (filters.minPrice || 0));
        }
        
        if (filters.maxPrice !== undefined) {
          fetchedProducts = fetchedProducts.filter(p => p.price <= (filters.maxPrice || Infinity));
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          fetchedProducts = fetchedProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.description.toLowerCase().includes(searchLower)
          );
        }
      }
      
      // Actualizăm starea
      if (isRefresh) {
        setProducts(fetchedProducts);
      } else {
        setProducts((prev) => [...prev, ...fetchedProducts]);
      }
      
      // Actualizăm last document pentru paginare
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible || null);
      
      // Verificăm dacă mai sunt rezultate
      setHasMore(querySnapshot.docs.length === PRODUCTS_PER_PAGE);
      
      setLoading(false);
    } catch (err) {
      console.error("Eroare la încărcarea produselor:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    await loadProducts();
  };

  const refresh = () => {
    setProducts([]);
    setLastDoc(null);
    setHasMore(true);
    loadProducts(true);
  };

  // Încărcăm produsele inițial și la schimbarea filtrelor
  useEffect(() => {
    refresh();
  }, [
    filters?.category, 
    filters?.inStock, 
    filters?.minPrice, 
    filters?.maxPrice, 
    filters?.searchTerm
  ]);

  // Timp real updates
  useEffect(() => {
    // Construim interogarea de bază
    let baseQuery = buildQuery();
    
    // Subscribem la schimbări
    const unsubscribe = onSnapshot(baseQuery, (snapshot) => {
      // Detectăm schimbările
      const changedProducts = snapshot.docChanges().map(change => {
        const data = change.doc.data();
        const product = {
          id: change.doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Product;
        
        return { type: change.type, product };
      });
      
      // Actualizam starea în funcție de schimbări
      setProducts(current => {
        const newProducts = [...current];
        
        changedProducts.forEach(change => {
          if (change.type === 'added') {
            // Verificăm dacă este deja în listă
            const existingIndex = newProducts.findIndex(p => p.id === change.product.id);
            if (existingIndex === -1) {
              newProducts.push(change.product);
            }
          } else if (change.type === 'modified') {
            // Actualizăm produsul existent
            const index = newProducts.findIndex(p => p.id === change.product.id);
            if (index !== -1) {
              newProducts[index] = change.product;
            }
          } else if (change.type === 'removed') {
            // Ștergem produsul
            const index = newProducts.findIndex(p => p.id === change.product.id);
            if (index !== -1) {
              newProducts.splice(index, 1);
            }
          }
        });
        
        // Sortăm produsele alphabetic
        newProducts.sort((a, b) => a.name.localeCompare(b.name));
        
        return newProducts;
      });
    }, (err) => {
      console.error("Eroare la subscriberea la produse:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    });
    
    // Cleanup la dezabonare
    return () => unsubscribe();
  }, []);

  return { 
    products, 
    loading, 
    error, 
    lastDoc, 
    loadMore, 
    hasMore,
    refresh
  };
}
