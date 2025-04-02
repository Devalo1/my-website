import { 
  collection, addDoc, doc, updateDoc, deleteDoc, getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Product } from '../types';

/**
 * Serviciu pentru gestionarea produselor în Firestore și Storage
 */
export const productService = {
  /**
   * Adaugă un nou produs în baza de date
   * @param product Produsul de adăugat (fără id)
   * @param imageFile Fișierul imagine pentru produs
   * @returns ID-ul noului produs creat
   */
  async addProduct(
    product: Omit<Product, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'>, 
    imageFile: File
  ): Promise<string> {
    try {
      // Încărcăm imaginea în Storage
      const timestamp = Date.now();
      const imagePath = `products/${timestamp}_${imageFile.name}`;
      const imageRef = ref(storage, imagePath);
      
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      
      // Adăugăm timestamp-urile și URL-ul imaginii
      const productWithMetadata = {
        ...product,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Adăugăm produsul în Firestore
      const docRef = await addDoc(collection(db, 'products'), productWithMetadata);
      
      console.log(`Produs nou creat cu ID: ${docRef.id}`);
      
      return docRef.id;
    } catch (error) {
      console.error('Eroare la adăugarea produsului:', error);
      throw error;
    }
  },

  /**
   * Actualizează un produs existent
   * @param productId ID-ul produsului
   * @param product Datele actualizate ale produsului
   * @param imageFile Opțional: Noul fișier imagine
   * @returns Promise void
   */
  async updateProduct(
    productId: string, 
    product: Partial<Omit<Product, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'>>, 
    imageFile?: File
  ): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      
      // Verificăm dacă produsul există
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error(`Produsul cu ID-ul ${productId} nu există`);
      }
      
      const updateData: any = {
        ...product,
        updatedAt: serverTimestamp()
      };
      
      // Dacă avem o imagine nouă, o încărcăm și actualizăm URL-ul
      if (imageFile) {
        // Ștergem imaginea veche
        const oldProduct = productSnap.data() as Product;
        if (oldProduct.imageUrl) {
          // Extragem path-ul din URL
          const oldImagePath = decodeURIComponent(
            oldProduct.imageUrl.split('?')[0].split('/o/')[1]
          );
          
          try {
            const oldImageRef = ref(storage, oldImagePath);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.warn('Nu s-a putut șterge imaginea veche:', err);
          }
        }
        
        // Încărcăm imaginea nouă
        const timestamp = Date.now();
        const imagePath = `products/${timestamp}_${imageFile.name}`;
        const imageRef = ref(storage, imagePath);
        
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        
        updateData.imageUrl = imageUrl;
      }
      
      // Actualizăm produsul
      await updateDoc(productRef, updateData);
      
      console.log(`Produsul ${productId} a fost actualizat`);
    } catch (error) {
      console.error('Eroare la actualizarea produsului:', error);
      throw error;
    }
  },

  /**
   * Șterge un produs și imaginea asociată
   * @param productId ID-ul produsului
   * @returns Promise void
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      
      // Verificăm dacă produsul există
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error(`Produsul cu ID-ul ${productId} nu există`);
      }
      
      // Ștergem imaginea asociată
      const product = productSnap.data() as Product;
      if (product.imageUrl) {
        // Extragem path-ul din URL
        const imagePath = decodeURIComponent(
          product.imageUrl.split('?')[0].split('/o/')[1]
        );
        
        try {
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn('Nu s-a putut șterge imaginea produsului:', err);
        }
      }
      
      // Ștergem produsul
      await deleteDoc(productRef);
      
      console.log(`Produsul ${productId} a fost șters`);
    } catch (error) {
      console.error('Eroare la ștergerea produsului:', error);
      throw error;
    }
  }
};
