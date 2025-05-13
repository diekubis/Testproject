import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert,
  Pressable
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useInventoryStore } from '@/stores/inventory-store';
import { useOrderStore } from '@/stores/order-store';
import { useAuthStore } from '@/stores/auth-store';
import { InventoryItem } from '@/types/inventory';
import Button from '@/components/Button';
import SearchBar from '@/components/SearchBar';
import StockAdjuster from '@/components/StockAdjuster';
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingCart, 
  X, 
  ChevronRight,
  Building,
  Calendar
} from 'lucide-react-native';
import { translations } from '@/constants/localization';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  expiryDate?: string;
};

export default function NewOrderScreen() {
  const router = useRouter();
  const { items } = useInventoryStore();
  const { submitOrder } = useOrderStore();
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState<'select' | 'review'>('select');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  const filteredItems = searchQuery
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;
  
  const handleAddItem = (item: InventoryItem) => {
    // Check if item already exists in the order
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      // Add new item to the order
      setSelectedItems([
        ...selectedItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          unit: item.unit,
          expiryDate: item.expiryDate,
        },
      ]);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    const updatedItems = selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setSelectedItems(updatedItems);
  };
  
  const handleSubmitOrder = () => {
    if (!user) {
      Alert.alert(translations.common.error, "Benutzer nicht authentifiziert");
      return;
    }
    
    if (selectedItems.length === 0) {
      Alert.alert(translations.common.error, translations.orders.new.noItemsSelected);
      return;
    }
    
    submitOrder({
      items: selectedItems,
      notes,
      createdBy: user.name,
      createdById: user.id,
      supplier: selectedSupplier,
    });
    
    Alert.alert(
      translations.common.success,
      translations.orders.new.orderCreated,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/orders'),
        },
      ]
    );
  };
  
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };
  
  const isExpiring = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  };
  
  const suppliers = [
    "MedSupply GmbH",
    "PharmaPlus AG",
    "MediTech Solutions",
    "HealthCare Logistics",
    "Klinik Bedarf GmbH"
  ];
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: translations.orders.new.title,
          headerBackTitle: translations.orders.title,
        }}
      />
      
      <View style={styles.container}>
        {currentStep === 'select' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.orders.new.selectSupplier}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suppliersContainer}
              >
                {suppliers.map((supplier, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.supplierButton,
                      selectedSupplier === supplier && styles.selectedSupplier
                    ]}
                    onPress={() => setSelectedSupplier(supplier)}
                  >
                    <Building 
                      size={16} 
                      color={selectedSupplier === supplier ? 'white' : colors.primary} 
                    />
                    <Text 
                      style={[
                        styles.supplierText,
                        selectedSupplier === supplier && styles.selectedSupplierText
                      ]}
                    >
                      {supplier}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.orders.new.selectItems}</Text>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={translations.orders.new.searchItems}
              />
              
              <ScrollView style={styles.itemsList}>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <Pressable
                      key={item.id}
                      style={styles.itemCard}
                      onPress={() => handleAddItem(item)}
                    >
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemSku}>{item.sku}</Text>
                        {isExpiring(item.expiryDate) && item.expiryDate && (
                          <View style={styles.expiryContainer}>
                            <Calendar size={12} color={colors.warning} />
                            <Text style={styles.expiryDate}>
                              {formatDate(item.expiryDate)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.itemActions}>
                        <Text style={styles.itemPrice}>{item.price.toFixed(2)} €</Text>
                        <View style={styles.addButton}>
                          <Plus size={16} color="white" />
                        </View>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Package size={32} color={colors.textSecondary} />
                    <Text style={styles.emptyStateText}>{translations.orders.new.noItemsFound}</Text>
                  </View>
                )}
              </ScrollView>
            </View>
            
            <View style={styles.selectedItemsContainer}>
              <View style={styles.selectedItemsHeader}>
                <Text style={styles.selectedItemsTitle}>
                  {translations.orders.new.selectedItems} ({selectedItems.length})
                </Text>
                {selectedItems.length > 0 && (
                  <Text 
                    style={styles.viewAll}
                    onPress={() => setCurrentStep('review')}
                  >
                    {translations.common.seeAll} <ChevronRight size={14} color={colors.primary} />
                  </Text>
                )}
              </View>
              
              {selectedItems.length > 0 ? (
                <View style={styles.selectedItemsList}>
                  {selectedItems.slice(0, 2).map(item => (
                    <View key={item.id} style={styles.selectedItemCard}>
                      <View style={styles.selectedItemInfo}>
                        <Text style={styles.selectedItemName}>{item.name}</Text>
                        <Text style={styles.selectedItemQuantity}>
                          {item.quantity} {item.unit} × {item.price.toFixed(2)} €
                        </Text>
                        {isExpiring(item.expiryDate) && item.expiryDate && (
                          <View style={styles.expiryContainer}>
                            <Calendar size={12} color={colors.warning} />
                            <Text style={styles.expiryDate}>
                              {formatDate(item.expiryDate)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.selectedItemTotal}>
                        {(item.quantity * item.price).toFixed(2)} €
                      </Text>
                    </View>
                  ))}
                  
                  {selectedItems.length > 2 && (
                    <Text style={styles.moreItems}>
                      +{selectedItems.length - 2} {translations.common.more}...
                    </Text>
                  )}
                  
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{translations.orders.order.total}</Text>
                    <Text style={styles.totalValue}>{calculateTotal().toFixed(2)} €</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptySelectedItems}>
                  <ShoppingCart size={24} color={colors.textSecondary} />
                  <Text style={styles.emptySelectedItemsText}>
                    {translations.orders.new.noItemsSelected}
                  </Text>
                </View>
              )}
              
              <Button
                title={translations.common.next}
                onPress={() => setCurrentStep('review')}
                disabled={selectedItems.length === 0 || !selectedSupplier}
                fullWidth
              />
            </View>
          </>
        ) : (
          <>
            <ScrollView style={styles.reviewContainer}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{translations.orders.new.orderSummary}</Text>
                  <Pressable
                    style={styles.backButton}
                    onPress={() => setCurrentStep('select')}
                  >
                    <Text style={styles.backButtonText}>{translations.common.edit}</Text>
                  </Pressable>
                </View>
                
                <View style={styles.supplierInfo}>
                  <Building size={16} color={colors.primary} />
                  <Text style={styles.supplierName}>
                    {translations.orders.new.supplier}: {selectedSupplier}
                  </Text>
                </View>
                
                {selectedItems.map(item => (
                  <View key={item.id} style={styles.reviewItemCard}>
                    <View style={styles.reviewItemHeader}>
                      <Text style={styles.reviewItemName}>{item.name}</Text>
                      <Pressable
                        style={styles.removeButton}
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        <X size={16} color={colors.error} />
                      </Pressable>
                    </View>
                    
                    {isExpiring(item.expiryDate) && item.expiryDate && (
                      <View style={styles.expiryContainer}>
                        <Calendar size={12} color={colors.warning} />
                        <Text style={styles.expiryDate}>
                          {formatDate(item.expiryDate)}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.reviewItemDetails}>
                      <Text style={styles.reviewItemPrice}>
                        {item.price.toFixed(2)} € {translations.inventory.item.per} {item.unit}
                      </Text>
                      
                      {/* Replace manual quantity control with StockAdjuster */}
                      <StockAdjuster
                        currentStock={item.quantity}
                        onChange={(newQuantity) => handleUpdateQuantity(item.id, newQuantity)}
                        unit={item.unit}
                      />
                      
                      <Text style={styles.reviewItemTotal}>
                        {(item.quantity * item.price).toFixed(2)} €
                      </Text>
                    </View>
                  </View>
                ))}
                
                <View style={styles.reviewTotalContainer}>
                  <Text style={styles.reviewTotalLabel}>{translations.orders.order.total}</Text>
                  <Text style={styles.reviewTotalValue}>{calculateTotal().toFixed(2)} €</Text>
                </View>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{translations.orders.new.orderNotes}</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder={translations.orders.new.orderNotes}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
            
            <View style={styles.submitContainer}>
              <Button
                title={translations.orders.new.submitOrder}
                onPress={handleSubmitOrder}
                icon={<ShoppingCart size={18} color="white" />}
                fullWidth
              />
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  suppliersContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  supplierButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 6,
  },
  selectedSupplier: {
    backgroundColor: colors.primary,
  },
  supplierText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  selectedSupplierText: {
    color: 'white',
  },
  itemsList: {
    maxHeight: 300,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  itemSku: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryDate: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedItemsContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemsList: {
    marginBottom: 16,
  },
  selectedItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  selectedItemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  selectedItemTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  moreItems: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  emptySelectedItems: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    marginBottom: 16,
  },
  emptySelectedItemsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reviewContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
  },
  supplierName: {
    fontSize: 15,
    color: colors.text,
  },
  reviewItemCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  removeButton: {
    padding: 4,
  },
  reviewItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewItemPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    width: '30%',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  reviewItemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    width: '20%',
    textAlign: 'right',
  },
  reviewTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reviewTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  reviewTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});