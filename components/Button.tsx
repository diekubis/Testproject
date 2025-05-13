import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View, 
  TouchableOpacityProps 
} from 'react-native';
import { useColors } from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  ...props
}) => {
  const colors = useColors();
  
  // Define button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          borderColor: colors.error,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
    }
  };

  // Define text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return {
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          color: colors.primary,
        };
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };

  // Define button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
    }
  };

  // Define text size
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      case 'medium':
        return {
          fontSize: 16,
        };
      case 'large':
        return {
          fontSize: 18,
        };
      default:
        return {
          fontSize: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : '#FFFFFF'} 
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default Button;