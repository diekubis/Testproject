import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { useInventoryStore } from '@/stores/inventory-store';
import { useAuthStore } from '@/stores/auth-store';
import Button from '@/components/Button';
import StockAdjuster from '@/components/StockAdjuster';
import TransactionItem from '@/components/TransactionItem';
import { 
  Package, 
  MapPin, 
  Tag, 
  Calendar, 
  DollarSign,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Clock,
  Hash,
  Info,
  User,
  Barcode
} from 'lucide-react-native';
import { translations } from '@/constants/localization';

export default function InventoryItemScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getItemById, updateItemStock, transactions } = useInventoryStore();
  
  const item = getItemById(id as string);
  const itemTransactions = transactions.filter(t => t.itemId === id).slice(0, 5);
  
  const [newStock, setNewStock] = useState(item?.currentStock || 0);
  const [transactionType, setTransactionType] = useState<'withdrawal' | 'restock' | 'return'>('withdrawal');
  const [notes, setNotes] = useState('');
  
  if (!item) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>{translations.inventory.item.notFound}</Text>
        <Button 
          title={translations.common.back}
          onPress={() => router.back()} 
          variant="outline"
        />
      </View>
    );
  }
  
  const handleUpdateStock = () => {
    if (!user) return;
    
    const stockDifference = Math.abs(newStock - item.currentStock);
    if (stockDifference === 0) {
      Alert.alert(translations.inventory.item.noChange, translations.inventory.item.noChange);
      return;
    }
    
    updateItemStock(
      item.id,
      newStock,
      transactionType,
      user.id,
      user.name,
      notes
    );
    
    Alert.alert(
      translations.inventory.item.stockUpdated,
      `${item.name} ${transactionType === 'withdrawal' ? 'wurde reduziert um' : 'wurde erhöht um'} ${stockDifference} ${item.unit}`
    );
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };
  
  const isLowStock = item.currentStock < item.minStock;
  const isExpiring = item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: item.name,
          headerBackTitle: translations.inventory.title,
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=200&auto=format&fit=crop' }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sku}>{item.sku}</Text>
          
          <View style={styles.statusContainer}>
            {isLowStock && (
              <View style={[styles.statusBadge, { backgroundColor: `${colors.error}15` }]}>
                <ArrowDown size={14} color={colors.error} />
                <Text style={[styles.statusText, { color: colors.error }]}>{translations.inventory.item.lowStock}</Text>
              </View>
            )}
            
            {isExpiring && (
              <View style={[styles.statusBadge, { backgroundColor: `${colors.warning}15` }]}>
                <Clock size={14} color={colors.warning} />
                <Text style={[styles.statusText, { color: colors.warning }]}>{translations.inventory.item.expiringSoon}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Package size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.category}:</Text>
            <Text style={styles.infoValue}>
              {item.category === 'medication' ? 'Medikament' : 
               item.category === 'disposable' ? 'Verbrauchsmaterial' :
               item.category === 'equipment' ? 'Ausrüstung' :
               item.category === 'emergency' ? 'Notfall' :
               item.category === 'laboratory' ? 'Labor' : item.category}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MapPin size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.storageLocation}:</Text>
            <Text style={styles.infoValue}>{item.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <User size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.manufacturer}:</Text>
            <Text style={styles.infoValue}>{item.manufacturer || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Hash size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.manufacturerNumber}:</Text>
            <Text style={styles.infoValue}>{item.manufacturerNumber || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Barcode size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>Barcode/EAN:</Text>
            <Text style={styles.infoValue}>{item.barcode || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Hash size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.batch}:</Text>
            <Text style={styles.infoValue}>{item.batch || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Tag size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.minStock}:</Text>
            <Text style={styles.infoValue}>{item.minStock} {item.unit}</Text>
          </View>
          
          {item.expiryDate && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Calendar size={18} color={colors.primary} />
              </View>
              <Text style={styles.infoLabel}>{translations.inventory.item.expiryDate}:</Text>
              <Text style={[
                styles.infoValue,
                isExpiring && styles.expiringText
              ]}>
                {formatDate(item.expiryDate)}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <DollarSign size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.inventory.item.price}:</Text>
            <Text style={styles.infoValue}>{item.price.toFixed(2)} € {translations.inventory.item.per} {item.unit}</Text>
          </View>
        </View>
        
        {item.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.inventory.item.description}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.inventory.item.stockManagement}</Text>
          
          <View style={styles.stockContainer}>
            <View style={styles.currentStockRow}>
              <Text style={styles.currentStock}>
                {translations.inventory.item.currentStock}: <Text style={[
                  styles.stockValue,
                  isLowStock && styles.lowStockText
                ]}>
                  {item.currentStock} {item.unit}
                </Text>
              </Text>
              
              <TouchableOpacity 
                style={styles.infoButton}
                onPress={() => Alert.alert(
                  translations.inventory.item.tapToEdit,
                  "Tippen Sie auf den Wert, um die Menge manuell einzugeben."
                )}
              >
                <Info size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.stockActions}>
              <View style={styles.actionButtons}>
                <Button
                  title={translations.inventory.item.withdraw}
                  onPress={() => {
                    setTransactionType('withdrawal');
                    setNewStock(Math.max(0, item.currentStock - 1));
                  }}
                  variant={transactionType === 'withdrawal' ? 'primary' : 'outline'}
                  size="small"
                  icon={<ArrowUp size={16} color={transactionType === 'withdrawal' ? 'white' : colors.primary} />}
                />
                
                <Button
                  title={translations.inventory.item.restock}
                  onPress={() => {
                    setTransactionType('restock');
                    setNewStock(item.currentStock + 1);
                  }}
                  variant={transactionType === 'restock' ? 'primary' : 'outline'}
                  size="small"
                  icon={<ArrowDown size={16} color={transactionType === 'restock' ? 'white' : colors.primary} />}
                />
                
                <Button
                  title={translations.inventory.item.return}
                  onPress={() => {
                    setTransactionType('return');
                    setNewStock(item.currentStock + 1);
                  }}
                  variant={transactionType === 'return' ? 'primary' : 'outline'}
                  size="small"
                  icon={<RotateCcw size={16} color={transactionType === 'return' ? 'white' : colors.primary} />}
                />
              </View>
              
              <StockAdjuster
                currentStock={newStock}
                onChange={setNewStock}
                unit={item.unit}
              />
              
              <TextInput
                style={styles.notesInput}
                placeholder={translations.inventory.item.transactionNotes}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
              
              <Button
                title={translations.inventory.item.updateStock}
                onPress={handleUpdateStock}
                fullWidth
              />
            </View>
          </View>
        </View>
        
        {itemTransactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.inventory.item.recentTransactions}</Text>
            
            <View style={styles.transactionsContainer}>
              {itemTransactions.map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                />
              ))}
              
              {itemTransactions.length > 0 && (
                <Button
                  title={translations.inventory.item.viewAllTransactions}
                  onPress={() => router.push(`/transactions?itemId=${item.id}`)}
                  variant="outline"
                  size="small"
                  fullWidth
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sku: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  expiringText: {
    color: colors.warning,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  stockContainer: {
    gap: 16,
  },
  currentStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentStock: {
    fontSize: 16,
    color: colors.text,
  },
  infoButton: {
    padding: 4,
  },
  stockValue: {
    fontWeight: '600',
  },
  lowStockText: {
    color: colors.error,
  },
  stockActions: {
    gap: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 80,
  },
  transactionsContainer: {
    gap: 8,
  },
});