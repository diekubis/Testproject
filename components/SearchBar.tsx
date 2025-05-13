import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Suchen...' 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Search size={18} color={colors.textSecondary} />
      </View>
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      
      {value.length > 0 && (
        <Pressable 
          style={styles.clearButton}
          onPress={() => onChangeText('')}
        >
          <X size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
});