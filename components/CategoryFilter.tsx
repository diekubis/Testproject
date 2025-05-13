import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/localization';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const categories = [
    { id: null, name: translations.common.all },
    { id: 'medications', name: translations.inventory.categories.medications },
    { id: 'disposables', name: translations.inventory.categories.disposables },
    { id: 'equipment', name: translations.inventory.categories.equipment },
    { id: 'emergency', name: translations.inventory.categories.emergency },
    { id: 'laboratory', name: translations.inventory.categories.laboratory },
  ];
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id || 'all'}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedCategoryText: {
    color: 'white',
  },
});