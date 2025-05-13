import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus } from '@/types/inventory';
import { mockOrders } from '@/mocks/inventory';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  // Order actions
  getOrderById: (id: string) => Order | undefined;
  getAllOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getPendingOrders: () => Order[];
  updateOrderStatus: (id: string, newStatus: OrderStatus, userId: string) => void;
  updateOrderItemQuantity: (orderId: string, itemId: string, newQuantity: number) => void;
  submitOrder: (orderData: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      unit: string;
      expiryDate?: string;
    }>;
    notes?: string;
    createdBy: string;
    createdById: string;
    supplier?: string;
  }) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      isLoading: false,
      error: null,
      
      getOrderById: (id: string) => {
        return get().orders.find(order => order.id === id);
      },
      
      getAllOrders: () => {
        return get().orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      
      getOrdersByStatus: (status: OrderStatus) => {
        return get().orders
          .filter(order => order.status === status)
          .sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },
      
      getPendingOrders: () => {
        return get().orders
          .filter(order => order.status === 'pending')
          .sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },
      
      updateOrderStatus: (id: string, newStatus: OrderStatus, userId: string) => {
        const { orders } = get();
        const order = orders.find(order => order.id === id);
        
        if (!order) {
          set({ error: 'Bestellung nicht gefunden' });
          return;
        }
        
        const updatedOrders = orders.map(order => {
          if (order.id === id) {
            const updatedOrder = { ...order, status: newStatus };
            
            // Add additional data based on status
            if (newStatus === 'approved') {
              updatedOrder.approvedById = userId;
              updatedOrder.approvedBy = userId; // In a real app, we'd get the user's name
              updatedOrder.approvedAt = new Date().toISOString();
            } else if (newStatus === 'delivered') {
              updatedOrder.deliveryDate = new Date().toISOString();
            }
            
            return updatedOrder;
          }
          return order;
        });
        
        set({ orders: updatedOrders });
      },
      
      updateOrderItemQuantity: (orderId: string, itemId: string, newQuantity: number) => {
        const { orders } = get();
        const order = orders.find(order => order.id === orderId);
        
        if (!order) {
          set({ error: 'Bestellung nicht gefunden' });
          return;
        }
        
        // Update the quantity of the specific item
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        
        // Recalculate the total price
        const newTotalPrice = updatedItems.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
        
        // Update the order
        const updatedOrders = orders.map(order => 
          order.id === orderId 
            ? { ...order, items: updatedItems, totalPrice: newTotalPrice } 
            : order
        );
        
        set({ orders: updatedOrders });
      },
      
      submitOrder: (orderData) => {
        const { orders } = get();
        const newOrderId = `order${orders.length + 1}`;
        
        const totalPrice = orderData.items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
        
        const newOrder: Order = {
          id: newOrderId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          createdBy: orderData.createdBy,
          createdById: orderData.createdById,
          items: orderData.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
            expiryDate: item.expiryDate
          })),
          notes: orderData.notes,
          supplier: orderData.supplier,
          totalPrice
        };
        
        set({ orders: [newOrder, ...orders] });
      }
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);