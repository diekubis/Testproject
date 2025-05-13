import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/stores/order-store';
import { Order, OrderStatus } from '@/types/inventory';
import OrderCard from '@/components/OrderCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { Package, Plus } from 'lucide-react-native';
import { translations } from '@/constants/localization';

export default function OrdersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { orders } = useOrderStore();
  
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>(
    params.filter === 'pending' ? 'pending' : 'all'
  );
  
  const handleOrderPress = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };
  
  const handleNewOrder = () => {
    router.push('/orders/new');
  };
  
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);
  
  const statusOptions: Array<{ value: OrderStatus | 'all', label: string }> = [
    { value: 'all', label: translations.orders.status.all },
    { value: 'pending', label: translations.orders.status.pending },
    { value: 'approved', label: translations.orders.status.approved },
    { value: 'ordered', label: translations.orders.status.ordered },
    { value: 'shipped', label: translations.orders.status.shipped },
    { value: 'delivered', label: translations.orders.status.delivered },
    { value: 'cancelled', label: translations.orders.status.cancelled },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{translations.orders.title}</Text>
        <Button
          title={translations.orders.newOrder}
          onPress={handleNewOrder}
          size="small"
          icon={<Plus size={16} color="white" />}
        />
      </View>
      
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {statusOptions.map(option => (
            <Pressable
              key={option.value}
              style={[
                styles.filterButton,
                statusFilter === option.value && styles.activeFilter
              ]}
              onPress={() => setStatusFilter(option.value)}
            >
              <Text 
                style={[
                  styles.filterText,
                  statusFilter === option.value && styles.activeFilterText
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={handleOrderPress} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title={translations.orders.noOrders}
            message={
              statusFilter !== 'all'
                ? `${translations.orders.noOrdersWithFilter} ${statusOptions.find(o => o.value === statusFilter)?.label}`
                : translations.orders.noOrders
            }
            icon={<Package size={32} color={colors.textSecondary} />}
            actionLabel={translations.orders.createOrder}
            onAction={handleNewOrder}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  filterWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
});