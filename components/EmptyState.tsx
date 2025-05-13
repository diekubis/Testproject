import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 40,
    backgroundColor: `${colors.primary}10`,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionContainer: {
    marginTop: 8,
  },
});