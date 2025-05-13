export type UserRole = 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'logistics';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  expiryDate?: string;
  supplier?: string;
  manufacturer?: string;
  manufacturerNumber?: string;
  lastUpdated: string;
  updatedBy: string;
  barcode?: string;
  image?: string;
  batch?: string;
  sku?: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'withdrawal' | 'restock' | 'return' | 'adjustment';
  quantity: number;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'approved' | 'ordered' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  deliveryDate?: string;
  items: OrderItem[];
  supplier?: string;
  notes?: string;
  totalPrice: number;
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate?: string;
}

export interface StockAlert {
  id: string;
  type: 'low_stock' | 'expiring_soon' | 'order_status' | 'system';
  itemId?: string;
  itemName?: string;
  orderId?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  head?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}