import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useInventoryStore } from '@/stores/inventory-store';
import { useOrderStore } from '@/stores/order-store';
import { useAuthStore } from '@/stores/auth-store';
import { AlertTriangle, TrendingDown, Clock, Package, Activity, Calendar } from 'lucide-react-native';
import AlertItem from '@/components/AlertItem';
import TransactionItem from '@/components/TransactionItem';
import Button from '@/components/Button';
import { StockAlert } from '@/types/inventory';
import { translations } from '@/constants/localization';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [greeting, setGreeting] = useState('');
  
  const { 
    alerts, 
    getLowStockItems, 
    getExpiringItems,
    getRecentTransactions,
    markAlertAsRead
  } = useInventoryStore();
  
  const { getPendingOrders } = useOrderStore();
  
  const lowStockItems = getLowStockItems();
  const expiringItems = getExpiringItems(30); // Items expiring in 30 days
  const recentTransactions = getRecentTransactions(5);
  const pendingOrders = getPendingOrders();
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(translations.dashboard.greeting.morning);
    } else if (hour < 18) {
      setGreeting(translations.dashboard.greeting.afternoon);
    } else {
      setGreeting(translations.dashboard.greeting.evening);
    }
  }, []);
  
  const handleAlertPress = (alert: StockAlert) => {
    markAlertAsRead(alert.id);
    router.push(`/inventory/${alert.itemId}`);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.name}>{user?.name || 'Benutzer'}</Text>
        <Text style={styles.role}>{user?.department || 'Abteilung'}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Pressable 
          style={[styles.statCard, { backgroundColor: `${colors.error}15` }]}
          onPress={() => router.push('/inventory?filter=low')}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.error}25` }]}>
            <TrendingDown size={20} color={colors.error} />
          </View>
          <Text style={styles.statValue}>{lowStockItems.length}</Text>
          <Text style={styles.statLabel}>{translations.dashboard.stats.lowStock}</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.statCard, { backgroundColor: `${colors.warning}15` }]}
          onPress={() => router.push('/inventory?filter=expiring')}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}25` }]}>
            <Clock size={20} color={colors.warning} />
          </View>
          <Text style={styles.statValue}>{expiringItems.length}</Text>
          <Text style={styles.statLabel}>{translations.dashboard.stats.expiringSoon}</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.statCard, { backgroundColor: `${colors.info}15` }]}
          onPress={() => router.push('/orders?filter=pending')}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.info}25` }]}>
            <Package size={20} color={colors.info} />
          </View>
          <Text style={styles.statValue}>{pendingOrders.length}</Text>
          <Text style={styles.statLabel}>{translations.dashboard.stats.pendingOrders}</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{translations.dashboard.alerts}</Text>
          {alerts.length > 0 && (
            <Pressable onPress={() => router.push('/alerts')}>
              <Text style={styles.seeAll}>{translations.common.seeAll}</Text>
            </Pressable>
          )}
        </View>
        
        {alerts.length > 0 ? (
          <View>
            {alerts.slice(0, 3).map(alert => (
              <AlertItem 
                key={alert.id} 
                alert={alert} 
                onPress={handleAlertPress} 
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AlertTriangle size={24} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>{translations.dashboard.noAlerts}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{translations.dashboard.recentActivity}</Text>
          <Pressable onPress={() => router.push('/transactions')}>
            <Text style={styles.seeAll}>{translations.common.seeAll}</Text>
          </Pressable>
        </View>
        
        {recentTransactions.length > 0 ? (
          <View style={styles.transactionsContainer}>
            {recentTransactions.map(transaction => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Activity size={24} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>{translations.dashboard.noActivity}</Text>
          </View>
        )}
      </View>
      
      {expiringItems.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bald ablaufende Artikel</Text>
            <Pressable onPress={() => router.push('/inventory?filter=expiring')}>
              <Text style={styles.seeAll}>{translations.common.seeAll}</Text>
            </Pressable>
          </View>
          
          <View style={styles.expiringItemsContainer}>
            {expiringItems.slice(0, 3).map(item => (
              <Pressable 
                key={item.id}
                style={styles.expiringItem}
                onPress={() => router.push(`/inventory/${item.id}`)}
              >
                <View style={styles.expiringItemContent}>
                  <Text style={styles.expiringItemName}>{item.name}</Text>
                  <View style={styles.expiryDateContainer}>
                    <Calendar size={14} color={colors.warning} />
                    <Text style={styles.expiryDate}>
                      {formatDate(item.expiryDate)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.expiringItemStock}>
                  {item.currentStock} {item.unit}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <Button
          title={translations.dashboard.scanItem}
          onPress={() => router.push('/scan')}
          icon={<Scan size={18} color="white" />}
          fullWidth
        />
        
        <Button
          title={translations.dashboard.newOrder}
          onPress={() => router.push('/orders/new')}
          variant="outline"
          icon={<Package size={18} color={colors.primary} />}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

import { Scan } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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
  },
  transactionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  expiringItemsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  expiringItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  expiringItemContent: {
    flex: 1,
  },
  expiringItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  expiryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryDate: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  expiringItemStock: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
});