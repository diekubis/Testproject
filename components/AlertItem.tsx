import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { StockAlert } from '@/types/inventory';
import { AlertTriangle, Clock } from 'lucide-react-native';

interface AlertItemProps {
  alert: StockAlert;
  onPress: (alert: StockAlert) => void;
}

export default function AlertItem({ alert, onPress }: AlertItemProps) {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'low_stock':
        return <AlertTriangle size={20} color={colors.warning} />;
      case 'expiry':
        return <Clock size={20} color={colors.warning} />;
      case 'overstock':
        return <AlertTriangle size={20} color={colors.info} />;
      default:
        return <AlertTriangle size={20} color={colors.warning} />;
    }
  };

  const getPriorityColor = () => {
    switch (alert.priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        !alert.isRead && styles.unread,
        pressed && styles.pressed
      ]}
      onPress={() => onPress(alert)}
    >
      <View style={styles.iconContainer}>
        {getAlertIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.itemName} numberOfLines={1}>{alert.itemName}</Text>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
        </View>
        
        <Text style={styles.message}>{alert.message}</Text>
        
        <Text style={styles.date}>{formatDate(alert.createdAt)}</Text>
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
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: `${colors.primary}05`,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});