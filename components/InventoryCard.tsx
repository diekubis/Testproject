import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { InventoryItem } from '@/types/inventory';
import StatusBadge from './StatusBadge';
import { Calendar, User, Barcode } from 'lucide-react-native';

interface InventoryCardProps {
  item: InventoryItem;
  onPress: (item: InventoryItem) => void;
}

export default function InventoryCard({ item, onPress }: InventoryCardProps) {
  const isLowStock = item.currentStock < item.minStock;
  const isExpiring = item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={() => onPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=200&auto=format&fit=crop' }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.sku}>{item.sku}</Text>
        
        {item.manufacturer && (
          <View style={styles.manufacturerContainer}>
            <User size={12} color={colors.textSecondary} />
            <Text style={styles.manufacturer} numberOfLines={1}>
              {item.manufacturer}
            </Text>
          </View>
        )}
        
        {item.barcode && (
          <View style={styles.barcodeContainer}>
            <Barcode size={12} color={colors.textSecondary} />
            <Text style={styles.barcode} numberOfLines={1}>
              {item.barcode}
            </Text>
          </View>
        )}
        
        <View style={styles.stockContainer}>
          <Text style={styles.stockLabel}>Bestand:</Text>
          <Text style={[
            styles.stockValue,
            isLowStock && styles.lowStock
          ]}>
            {item.currentStock} {item.unit}
          </Text>
          {isLowStock && (
            <StatusBadge status="low_stock" size="small" />
          )}
        </View>
        
        {isExpiring && item.expiryDate && (
          <View style={styles.expiryContainer}>
            <Calendar size={12} color={colors.warning} />
            <Text style={styles.expiryDate}>
              {formatDate(item.expiryDate)}
            </Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: `${colors.primary}05`,
  },
  imageContainer: {
    width: 80,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  sku: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  manufacturerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  manufacturer: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  barcode: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  stockLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 6,
  },
  lowStock: {
    color: colors.error,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  expiryDate: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});