import { 
  collection, addDoc, doc, updateDoc, deleteDoc, getDoc,
  Timestamp, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Order, OrderStatus } from '../types';

/**
 * Serviciu pentru gestionarea comenzilor în Firestore
 */
export const orderService = {
  /**
   * Adaugă o nouă comandă în baza de date
   * @param order Comanda de adăugat (fără id)
   * @returns ID-ul noii comenzi create
   */
  async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Verificăm dacă toate câmpurile necesare sunt prezente
      if (!order.userId || !order.items || order.items.length === 0) {
        throw new Error('Comanda trebuie să conțină userId și cel puțin un produs');
      }

      // Adăugăm timestamp-urile
      const orderWithTimestamps = {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Adăugăm comanda în Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamps);
      
      // Actualizăm stocul produselor
      for (const item of order.items) {
        const productRef = doc(db, 'products', item.productId);
        await updateDoc(productRef, {
          stock: increment(-item.qty),
          updatedAt: serverTimestamp()
        });
      }
      
      console.log(`Comandă nouă creată cu ID: ${docRef.id}`);
      
      return docRef.id;
    } catch (error) {
      console.error('Eroare la adăugarea comenzii:', error);
      throw error;
    }
  },

  /**
   * Actualizează statusul unei comenzi
   * @param orderId ID-ul comenzii
   * @param status Noul status
   * @returns Promise void
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      // Verificăm dacă comanda există
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        throw new Error(`Comanda cu ID-ul ${orderId} nu există`);
      }
      
      // Actualizăm statusul comenzii
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Status actualizat pentru comanda ${orderId}: ${status}`);
    } catch (error) {
      console.error('Eroare la actualizarea statusului comenzii:', error);
      throw error;
    }
  },

  /**
   * Anulează o comandă și restaurează stocul
   * @param orderId ID-ul comenzii
   * @returns Promise void
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      // Obținem comanda
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        throw new Error(`Comanda cu ID-ul ${orderId} nu există`);
      }
      
      const orderData = orderSnap.data() as Order;
      
      // Verificăm dacă comanda nu este deja anulată
      if (orderData.status === 'cancelled') {
        throw new Error('Comanda este deja anulată');
      }
      
      // Restaurăm stocul produselor
      for (const item of orderData.items) {
        const productRef = doc(db, 'products', item.productId);
        await updateDoc(productRef, {
          stock: increment(item.qty),
          updatedAt: serverTimestamp()
        });
      }
      
      // Actualizăm statusul comenzii
      await updateDoc(orderRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
      
      console.log(`Comanda ${orderId} a fost anulată`);
    } catch (error) {
      console.error('Eroare la anularea comenzii:', error);
      throw error;
    }
  },

  /**
   * Șterge o comandă (doar pentru testing/admin)
   * @param orderId ID-ul comenzii
   * @returns Promise void
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      // Verificăm dacă comanda există
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        throw new Error(`Comanda cu ID-ul ${orderId} nu există`);
      }
      
      // Ștergem comanda
      await deleteDoc(orderRef);
      
      console.log(`Comanda ${orderId} a fost ștearsă`);
    } catch (error) {
      console.error('Eroare la ștergerea comenzii:', error);
      throw error;
    }
  }
};
