import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { StockTransaction } from '@/types/inventory';
import { ArrowDown, ArrowUp, RotateCcw, Edit } from 'lucide-react-native';
import { translations } from '@/constants/localization';

interface TransactionItemProps {
  transaction: StockTransaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + 
           ' · ' + date.toLocaleDateString('de-DE');
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'withdrawal':
        return <ArrowUp size={16} color={colors.error} />;
      case 'restock':
        return <ArrowDown size={16} color={colors.success} />;
      case 'return':
        return <RotateCcw size={16} color={colors.info} />;
      case 'adjustment':
        return <Edit size={16} color={colors.warning} />;
      default:
        return null;
    }
  };

  const getTransactionTypeText = () => {
    switch (transaction.type) {
      case 'withdrawal':
        return translations.transactions.withdrawal;
      case 'restock':
        return translations.transactions.restock;
      case 'return':
        return translations.transactions.return;
      case 'adjustment':
        return translations.transactions.adjustment;
      default:
        return transaction.type;
    }
  };

  const getQuantityText = () => {
    const prefix = transaction.type === 'withdrawal' ? '-' : '+';
    return `${prefix}${transaction.quantity}`;
  };

  const getQuantityColor = () => {
    switch (transaction.type) {
      case 'withdrawal':
        return colors.error;
      case 'restock':
      case 'return':
        return colors.success;
      default:
        return colors.warning;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getTransactionIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.itemName} numberOfLines={1}>{transaction.itemName}</Text>
          <Text style={[styles.quantity, { color: getQuantityColor() }]}>
            {getQuantityText()}
          </Text>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.type}>{getTransactionTypeText()}</Text>
          <Text style={styles.user}>{transaction.userName}</Text>
        </View>
        
        <Text style={styles.timestamp}>{formatDate(transaction.timestamp)}</Text>
        
        {transaction.notes && (
          <Text style={styles.notes}>{transaction.notes}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  type: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
  },
  user: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notes: {
    fontSize: 13,
    color: colors.text,
    fontStyle: 'italic',
    marginTop: 4,
  },
});