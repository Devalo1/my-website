import { Timestamp } from 'firebase/firestore';

// Tipuri pentru utilizatori
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'client';
  createdAt: Timestamp;
}

// Tipuri pentru produse
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  ingredients?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipuri pentru comenzi
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  qty: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: {
    street: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
  };
  paymentMethod: 'card' | 'cash' | 'transfer';
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipuri pentru analitice
export interface SalesData {
  date: string;
  sales: number;
}

export interface ProductStockData {
  productName: string;
  stock: number;
}

// Tipuri pentru filtrare
export interface OrderFilters {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  searchTerm?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchTerm?: string;
}
