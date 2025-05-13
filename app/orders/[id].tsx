import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/stores/order-store';
import { useAuthStore } from '@/stores/auth-store';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import StockAdjuster from '@/components/StockAdjuster';
import { 
  Package, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  Truck,
  ShoppingCart
} from 'lucide-react-native';
import { translations } from '@/constants/localization';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getOrderById, updateOrderStatus, updateOrderItemQuantity } = useOrderStore();
  const { user } = useAuthStore();
  
  const order = getOrderById(id as string);
  const [isEditing, setIsEditing] = useState(false);
  
  if (!order) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>{translations.orders.order.notFound}</Text>
        <Button 
          title={translations.common.back}
          onPress={() => router.back()} 
          variant="outline"
        />
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE') + ' ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };
  
  const isExpiring = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  };
  
  const handleUpdateStatus = (newStatus: typeof order.status) => {
    if (!user) return;
    
    Alert.alert(
      translations.orders.order.updateStatus,
      `${translations.orders.order.updateStatus} ${translations.orders.status[newStatus]}?`,
      [
        {
          text: translations.common.cancel,
          style: 'cancel',
        },
        {
          text: translations.common.confirm,
          onPress: () => {
            updateOrderStatus(order.id, newStatus, user.id);
            Alert.alert(translations.orders.order.statusUpdated, `${translations.orders.status[newStatus]}`);
          },
        },
      ]
    );
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        translations.common.error,
        "Die Menge muss größer als 0 sein.",
        [{ text: "OK" }]
      );
      return;
    }
    
    updateOrderItemQuantity(order.id, itemId, newQuantity);
  };
  
  const getStatusActions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <View style={styles.actionButtons}>
            <Button
              title={translations.orders.order.approve}
              onPress={() => handleUpdateStatus('approved')}
              variant="primary"
              icon={<CheckCircle size={18} color="white" />}
            />
            <Button
              title={translations.orders.order.cancel}
              onPress={() => handleUpdateStatus('cancelled')}
              variant="outline"
              icon={<XCircle size={18} color={colors.primary} />}
            />
          </View>
        );
      case 'approved':
        return (
          <Button
            title={translations.orders.order.markAsOrdered}
            onPress={() => handleUpdateStatus('ordered')}
            variant="primary"
            icon={<ShoppingCart size={18} color="white" />}
            fullWidth
          />
        );
      case 'ordered':
        return (
          <Button
            title={translations.orders.order.markAsShipped}
            onPress={() => handleUpdateStatus('shipped')}
            variant="primary"
            icon={<Truck size={18} color="white" />}
            fullWidth
          />
        );
      case 'shipped':
        return (
          <Button
            title={translations.orders.order.markAsDelivered}
            onPress={() => handleUpdateStatus('delivered')}
            variant="primary"
            icon={<CheckCircle size={18} color="white" />}
            fullWidth
          />
        );
      default:
        return null;
    }
  };
  
  // Only allow editing for pending and approved orders
  const canEdit = ['pending', 'approved'].includes(order.status);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: `${translations.orders.title} #${order.id.replace('order', '')}`,
          headerBackTitle: translations.orders.title,
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.orderId}>{translations.orders.title} #{order.id.replace('order', '')}</Text>
            <StatusBadge status={order.status} size="large" />
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Calendar size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.orders.order.created}:</Text>
            <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <User size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>{translations.orders.order.createdBy}:</Text>
            <Text style={styles.infoValue}>{order.createdBy}</Text>
          </View>
          
          {order.approvedBy && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <CheckCircle size={18} color={colors.primary} />
              </View>
              <Text style={styles.infoLabel}>{translations.orders.order.approvedBy}:</Text>
              <Text style={styles.infoValue}>{order.approvedBy}</Text>
            </View>
          )}
          
          {order.deliveryDate && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Truck size={18} color={colors.primary} />
              </View>
              <Text style={styles.infoLabel}>{translations.orders.order.delivered}:</Text>
              <Text style={styles.infoValue}>{formatDate(order.deliveryDate)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{translations.orders.order.items}</Text>
            {canEdit && (
              <Button
                title={isEditing ? translations.common.save : translations.common.edit}
                onPress={() => setIsEditing(!isEditing)}
                variant="outline"
                size="small"
              />
            )}
          </View>
          
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
              
              {item.expiryDate && isExpiring(item.expiryDate) && (
                <View style={styles.expiryContainer}>
                  <Calendar size={14} color={colors.warning} />
                  <Text style={styles.expiryDate}>
                    {new Date(item.expiryDate).toLocaleDateString('de-DE')}
                  </Text>
                </View>
              )}
              
              <View style={styles.itemDetails}>
                {isEditing ? (
                  <StockAdjuster
                    currentStock={item.quantity}
                    onChange={(newQuantity) => handleUpdateQuantity(item.id, newQuantity)}
                    unit={item.unit}
                  />
                ) : (
                  <Text style={styles.itemQuantity}>
                    {item.quantity} {item.unit}
                  </Text>
                )}
                <Text style={styles.itemTotal}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{translations.orders.order.total}:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalPrice)}</Text>
          </View>
        </View>
        
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.orders.order.notes}</Text>
            <Text style={styles.notes}>{order.notes}</Text>
          </View>
        )}
        
        {getStatusActions() && (
          <View style={styles.actionsContainer}>
            {getStatusActions()}
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
  header: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
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
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  itemCard: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  expiryDate: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  notes: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});