import { useState, useEffect } from 'react';
import { 
  collection, query, where, orderBy, limit, 
  startAfter, getDocs, DocumentData, QueryDocumentSnapshot,
  Timestamp, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Order, OrderStatus, OrderFilters } from '../types';

const ORDERS_PER_PAGE = 10;

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  refresh: () => void;
}

/**
 * Hook pentru interogarea și afișarea comenzilor cu paginare și filtrare
 * @param filters Filtrele aplicate pentru comenzi
 * @returns Comenzile, statusul încărcării, controlul paginării
 */
export function useOrders(filters?: OrderFilters): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const buildQuery = (startAfterDoc?: QueryDocumentSnapshot<DocumentData>) => {
    // Inițiem colecția orders
    let ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    // Adăugăm filtrele
    if (filters) {
      if (filters.status) {
        ordersQuery = query(ordersQuery, where('status', '==', filters.status));
      }
      
      if (filters.userId) {
        ordersQuery = query(ordersQuery, where('userId', '==', filters.userId));
      }
      
      if (filters.startDate) {
        const startTimestamp = Timestamp.fromDate(filters.startDate);
        ordersQuery = query(ordersQuery, where('createdAt', '>=', startTimestamp));
      }
      
      if (filters.endDate) {
        const endTimestamp = Timestamp.fromDate(filters.endDate);
        ordersQuery = query(ordersQuery, where('createdAt', '<=', endTimestamp));
      }
    }
    
    // Adăugăm limitarea și punctul de start pentru paginare
    if (startAfterDoc) {
      return query(ordersQuery, startAfter(startAfterDoc), limit(ORDERS_PER_PAGE));
    }
    
    return query(ordersQuery, limit(ORDERS_PER_PAGE));
  };

  const loadOrders = async (isRefresh = false) => {
    try {
      setLoading(true);
      
      // Construim interogarea
      const q = buildQuery(isRefresh ? null : lastDoc);
      
      // Obținem comenzile
      const querySnapshot = await getDocs(q);
      
      // Transformăm documentele în obiecte Order
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Order;
      });
      
      // Actualizăm starea
      if (isRefresh) {
        setOrders(fetchedOrders);
      } else {
        setOrders((prev) => [...prev, ...fetchedOrders]);
      }
      
      // Actualizăm last document pentru paginare
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible || null);
      
      // Verificăm dacă mai sunt rezultate
      setHasMore(querySnapshot.docs.length === ORDERS_PER_PAGE);
      
      setLoading(false);
    } catch (err) {
      console.error("Eroare la încărcarea comenzilor:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    await loadOrders();
  };

  const refresh = () => {
    setOrders([]);
    setLastDoc(null);
    setHasMore(true);
    loadOrders(true);
  };

  // Încărcăm comenzile inițial și la schimbarea filtrelor
  useEffect(() => {
    refresh();
  }, [filters?.status, filters?.userId, filters?.startDate, filters?.endDate]);

  // Timp real updates
  useEffect(() => {
    // Construim interogarea de bază
    let baseQuery = buildQuery();
    
    // Subscribem la schimbări
    const unsubscribe = onSnapshot(baseQuery, (snapshot) => {
      // Detectăm schimbările
      const changedOrders = snapshot.docChanges().map(change => {
        const data = change.doc.data();
        const order = {
          id: change.doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Order;
        
        return { type: change.type, order };
      });
      
      // Actualizam starea în funcție de schimbări
      setOrders(current => {
        const newOrders = [...current];
        
        changedOrders.forEach(change => {
          if (change.type === 'added') {
            // Verificăm dacă nu este deja în listă
            const existingIndex = newOrders.findIndex(o => o.id === change.order.id);
            if (existingIndex === -1) {
              // Adăugăm la început pentru a menține ordinea descrescătoare după createdAt
              newOrders.unshift(change.order);
            }
          } else if (change.type === 'modified') {
            // Actualizăm comanda existentă
            const index = newOrders.findIndex(o => o.id === change.order.id);
            if (index !== -1) {
              newOrders[index] = change.order;
            }
          } else if (change.type === 'removed') {
            // Ștergem comanda
            const index = newOrders.findIndex(o => o.id === change.order.id);
            if (index !== -1) {
              newOrders.splice(index, 1);
            }
          }
        });
        
        return newOrders;
      });
    }, (err) => {
      console.error("Eroare la subscriberea la comenzi:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    });
    
    // Cleanup la dezabonare
    return () => unsubscribe();
  }, []);

  return { 
    orders, 
    loading, 
    error, 
    lastDoc, 
    loadMore, 
    hasMore,
    refresh
  };
}
