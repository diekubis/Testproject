import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { OrderStatus } from '@/types/inventory';
import { translations } from '@/constants/localization';

interface StatusBadgeProps {
  status: OrderStatus | 'low_stock' | 'expiry' | 'overstock';
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'delivered':
      case 'approved':
        return colors.success;
      case 'pending':
      case 'ordered':
      case 'overstock':
        return colors.info;
      case 'shipped':
        return colors.primary;
      case 'low_stock':
      case 'expiry':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return translations.orders.status.pending;
      case 'approved':
        return translations.orders.status.approved;
      case 'ordered':
        return translations.orders.status.ordered;
      case 'shipped':
        return translations.orders.status.shipped;
      case 'delivered':
        return translations.orders.status.delivered;
      case 'cancelled':
        return translations.orders.status.cancelled;
      case 'low_stock':
        return translations.inventory.item.lowStock;
      case 'expiry':
        return translations.inventory.item.expiringSoon;
      case 'overstock':
        return "Überbestand";
      default:
        return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 2, paddingHorizontal: 6 },
          text: { fontSize: 10 }
        };
      case 'large':
        return {
          container: { paddingVertical: 6, paddingHorizontal: 12 },
          text: { fontSize: 14 }
        };
      default:
        return {
          container: { paddingVertical: 4, paddingHorizontal: 8 },
          text: { fontSize: 12 }
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const backgroundColor = `${getStatusColor()}20`; // 20% opacity
  const borderColor = getStatusColor();
  const textColor = getStatusColor();

  return (
    <View 
      style={[
        styles.container, 
        sizeStyles.container,
        { backgroundColor, borderColor }
      ]}
    >
      <Text style={[styles.text, sizeStyles.text, { color: textColor }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  }
});