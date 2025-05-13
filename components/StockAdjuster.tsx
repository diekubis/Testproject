import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { colors } from '@/constants/colors';
import { Minus, Plus } from 'lucide-react-native';

interface StockAdjusterProps {
  currentStock: number;
  onChange: (newValue: number) => void;
  unit: string;
}

export default function StockAdjuster({ 
  currentStock, 
  onChange, 
  unit 
}: StockAdjusterProps) {
  const [value, setValue] = useState(currentStock);
  const [inputValue, setInputValue] = useState(currentStock.toString());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(currentStock);
    setInputValue(currentStock.toString());
  }, [currentStock]);

  const increment = () => {
    const newValue = value + 1;
    setValue(newValue);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const decrement = () => {
    if (value > 0) {
      const newValue = value - 1;
      setValue(newValue);
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  const handleInputChange = (text: string) => {
    // Allow only numbers
    if (/^\d*$/.test(text)) {
      setInputValue(text);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    
    // Convert to number and validate
    let newValue = parseInt(inputValue, 10);
    
    // Handle empty input or NaN
    if (isNaN(newValue)) {
      newValue = 0;
    }
    
    // Ensure non-negative value
    newValue = Math.max(0, newValue);
    
    setValue(newValue);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={decrement}
        disabled={value <= 0}
      >
        <Minus 
          size={16} 
          color={value <= 0 ? colors.textSecondary : colors.text} 
        />
      </Pressable>
      
      <Pressable 
        style={styles.valueContainer}
        onPress={() => setIsEditing(true)}
      >
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            keyboardType="numeric"
            selectTextOnFocus
            autoFocus
            maxLength={5}
          />
        ) : (
          <>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.unit}>{unit}</Text>
          </>
        )}
      </Pressable>
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={increment}
      >
        <Plus size={16} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    height: 40,
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  buttonPressed: {
    backgroundColor: colors.border,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: '100%',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
});