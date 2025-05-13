import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import Button from '@/components/Button';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { translations } from '@/constants/localization';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihren Benutzernamen ein.');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihr Passwort ein.');
      return;
    }
    
    try {
      await login(username, password);
      
      // Check if login was successful by checking if error is null
      if (!useAuthStore.getState().error) {
        router.replace('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  // Demo login credentials
  const demoCredentials = [
    { role: 'Admin', username: 'Markus Schneider', password: '1234' },
    { role: 'Arzt', username: 'Dr. Sarah Schmidt', password: '1234' },
    { role: 'Pfleger', username: 'Thomas Müller', password: '1234' },
  ];
  
  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    
    try {
      await login(demoUsername, demoPassword);
      
      // Check if login was successful by checking if error is null
      if (!useAuthStore.getState().error) {
        router.replace('/');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200&auto=format&fit=crop' }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      
      <Text style={styles.title}>Medizinisches Inventar</Text>
      <Text style={styles.subtitle}>Anmelden, um fortzufahren</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Benutzername oder E-Mail"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={20} color={colors.textSecondary} />
          ) : (
            <Eye size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Passwort vergessen?</Text>
      </TouchableOpacity>
      
      <Button
        title="Anmelden"
        onPress={handleLogin}
        disabled={isLoading}
        fullWidth
      />
      
      {isLoading && <ActivityIndicator style={styles.loader} color={colors.primary} />}
      
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>Demo-Zugänge</Text>
        
        <View style={styles.demoCards}>
          {demoCredentials.map((demo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.demoCard}
              onPress={() => handleDemoLogin(demo.username, demo.password)}
            >
              <Text style={styles.demoRole}>{demo.role}</Text>
              <Text style={styles.demoUsername}>{demo.username}</Text>
              <Text style={styles.demoPassword}>Passwort: {demo.password}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: `${colors.error}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loader: {
    marginTop: 16,
  },
  demoSection: {
    marginTop: 40,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  demoCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoRole: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  demoUsername: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 4,
  },
  demoPassword: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});