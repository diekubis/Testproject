import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryItem, StockAlert, StockTransaction } from '@/types/inventory';
import { mockInventoryItems, mockAlerts, mockTransactions } from '@/mocks/inventory';

interface InventoryState {
  items: InventoryItem[];
  alerts: StockAlert[];
  transactions: StockTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Item actions
  getItemById: (id: string) => InventoryItem | undefined;
  getItemByBarcode: (barcode: string) => InventoryItem | undefined;
  updateItemStock: (id: string, newStock: number, transactionType: 'withdrawal' | 'restock' | 'return' | 'adjustment', userId: string, userName: string, notes?: string) => void;
  
  // Alert actions
  markAlertAsRead: (id: string) => void;
  getUnreadAlertsCount: () => number;
  
  // Filter actions
  getItemsByCategory: (category: string) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
  getExpiringItems: (daysThreshold: number) => InventoryItem[];
  
  // Transaction actions
  getRecentTransactions: (limit?: number) => StockTransaction[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: mockInventoryItems,
      alerts: mockAlerts,
      transactions: mockTransactions,
      isLoading: false,
      error: null,
      
      getItemById: (id: string) => {
        return get().items.find(item => item.id === id);
      },
      
      getItemByBarcode: (barcode: string) => {
        console.log("Looking for barcode:", barcode);
        console.log("Available items:", get().items.map(item => ({ id: item.id, name: item.name, barcode: item.barcode })));
        
        if (!barcode) return undefined;
        
        // Normalize the barcode by removing any non-numeric characters
        const normalizedBarcode = barcode.replace(/\D/g, '');
        
        // First try exact match
        const exactMatch = get().items.find(item => item.barcode === barcode);
        if (exactMatch) {
          console.log("Found exact match:", exactMatch.name);
          return exactMatch;
        }
        
        // Then try normalized match
        const normalizedMatch = get().items.find(item => {
          if (!item.barcode) return false;
          return item.barcode.replace(/\D/g, '') === normalizedBarcode;
        });
        
        if (normalizedMatch) {
          console.log("Found normalized match:", normalizedMatch.name);
          return normalizedMatch;
        }
        
        console.log("No match found for barcode:", barcode);
        return undefined;
      },
      
      updateItemStock: (id: string, newStock: number, transactionType, userId, userName, notes) => {
        const { items, transactions } = get();
        const item = items.find(item => item.id === id);
        
        if (!item) {
          set({ error: 'Artikel nicht gefunden' });
          return;
        }
        
        // Calculate quantity change
        const quantityChange = Math.abs(newStock - item.currentStock);
        
        // Update item stock
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, currentStock: newStock } : item
        );
        
        // Create transaction record
        const newTransaction: StockTransaction = {
          id: `trans${transactions.length + 1}`,
          itemId: id,
          itemName: item.name,
          quantity: quantityChange,
          type: transactionType,
          timestamp: new Date().toISOString(),
          userId,
          userName,
          notes
        };
        
        // Check if we need to create a low stock alert
        let updatedAlerts = [...get().alerts];
        if (newStock < item.minStock) {
          // Check if we already have an alert for this item
          const existingAlert = updatedAlerts.find(
            alert => alert.itemId === id && alert.type === 'low_stock'
          );
          
          if (!existingAlert) {
            const newAlert: StockAlert = {
              id: `alert${updatedAlerts.length + 1}`,
              itemId: id,
              itemName: item.name,
              type: 'low_stock',
              message: `Bestand unter Mindestmenge (${newStock}/${item.minStock})`,
              createdAt: new Date().toISOString(),
              isRead: false,
              priority: 'high'
            };
            updatedAlerts.push(newAlert);
          }
        }
        
        set({
          items: updatedItems,
          transactions: [newTransaction, ...transactions],
          alerts: updatedAlerts
        });
      },
      
      markAlertAsRead: (id: string) => {
        const { alerts } = get();
        const updatedAlerts = alerts.map(alert => 
          alert.id === id ? { ...alert, isRead: true } : alert
        );
        set({ alerts: updatedAlerts });
      },
      
      getUnreadAlertsCount: () => {
        return get().alerts.filter(alert => !alert.isRead).length;
      },
      
      getItemsByCategory: (category: string) => {
        return get().items.filter(item => item.category === category);
      },
      
      getLowStockItems: () => {
        return get().items.filter(item => item.currentStock < item.minStock);
      },
      
      getExpiringItems: (daysThreshold: number) => {
        const today = new Date();
        const thresholdDate = new Date();
        thresholdDate.setDate(today.getDate() + daysThreshold);
        
        return get().items.filter(item => {
          if (!item.expiryDate) return false;
          const expiryDate = new Date(item.expiryDate);
          return expiryDate <= thresholdDate;
        });
      },
      
      getRecentTransactions: (limit = 10) => {
        return get().transactions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
      }
    }),
    {
      name: 'inventory-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);