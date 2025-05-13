import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useInventoryStore } from '@/stores/inventory-store';
import { InventoryItem } from '@/types/inventory';
import InventoryCard from '@/components/InventoryCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import { Package } from 'lucide-react-native';
import { translations } from '@/constants/localization';

export default function InventoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { items, getLowStockItems, getExpiringItems } = useInventoryStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Handle filter from URL params
  useEffect(() => {
    if (params.filter === 'low') {
      // No need to set category, we'll filter items directly
    } else if (params.filter === 'expiring') {
      // No need to set category, we'll filter items directly
    }
  }, [params]);
  
  const handleItemPress = (item: InventoryItem) => {
    router.push(`/inventory/${item.id}`);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  // Get filtered items based on URL params and user selections
  let filteredItems = items;
  
  if (params.filter === 'low') {
    filteredItems = getLowStockItems();
  } else if (params.filter === 'expiring') {
    filteredItems = getExpiringItems(30);
  } else {
    filteredItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.barcode && item.barcode.includes(searchQuery)) ||
                           (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }
  
  return (
    <View style={styles.container}>
      <SearchBar 
        placeholder={translations.inventory.search}
        onSearch={handleSearch}
        value={searchQuery}
      />
      
      <View style={styles.filterWrapper}>
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </View>
      
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InventoryCard item={item} onPress={handleItemPress} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title={translations.inventory.noItems}
            message={translations.inventory.adjustFilters}
            icon={<Package size={32} color={colors.textSecondary} />}
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
  filterWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  listContent: {
    padding: 16,
  },
});