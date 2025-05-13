import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Order } from '@/types/inventory';
import StatusBadge from './StatusBadge';
import { Package } from 'lucide-react-native';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };

  const getItemsText = () => {
    const itemCount = order.items.length;
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return `${itemCount} ${itemCount === 1 ? 'Artikel' : 'Artikel'} (${totalQuantity} Einheiten)`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={() => onPress(order)}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Package size={20} color={colors.primary} />
        </View>
        <Text style={styles.orderId}>Bestellung #{order.id.replace('order', '')}</Text>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Datum:</Text>
          <Text style={styles.value}>{formatDate(order.createdAt)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Artikel:</Text>
          <Text style={styles.value}>{getItemsText()}</Text>
        </View>

        {order.deliveryDate && (
          <View style={styles.row}>
            <Text style={styles.label}>Geliefert:</Text>
            <Text style={styles.value}>{formatDate(order.deliveryDate)}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Gesamt:</Text>
        <Text style={styles.totalValue}>{formatCurrency(order.totalPrice)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: `${colors.primary}05`,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  content: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    alignItems: 'center',
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
    marginLeft: 'auto',
  },
});