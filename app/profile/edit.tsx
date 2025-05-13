import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, Camera, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import Button from '@/components/Button';
import { translations } from '@/constants/localization';

export default function EditProfileScreen() {
  const { user, updateUserProfile } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    // Validate form
    if (!formData.name.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Namen ein.');
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user profile in auth store
      await updateUserProfile({
        ...user,
        ...formData
      });
      
      Alert.alert(
        translations.common.success,
        'Ihr Profil wurde erfolgreich aktualisiert.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        translations.common.error,
        'Beim Speichern Ihres Profils ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    Alert.alert(
      'Änderungen verwerfen?',
      'Möchten Sie die Bearbeitung abbrechen? Alle nicht gespeicherten Änderungen gehen verloren.',
      [
        { text: 'Weiter bearbeiten', style: 'cancel' },
        { text: 'Verwerfen', onPress: () => router.back(), style: 'destructive' }
      ]
    );
  };
  
  const handleAvatarChange = () => {
    // In a real app, this would open an image picker
    Alert.alert(
      'Profilbild ändern',
      'Wählen Sie eine Option',
      [
        { text: 'Kamera', onPress: () => console.log('Camera selected') },
        { text: 'Galerie', onPress: () => console.log('Gallery selected') },
        { text: 'Abbrechen', style: 'cancel' }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Profil bearbeiten',
        headerBackTitle: translations.common.back
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: formData.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <Pressable style={styles.avatarEditButton} onPress={handleAvatarChange}>
              <Camera size={20} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.avatarHint}>Tippen Sie auf das Kamerasymbol, um Ihr Profilbild zu ändern</Text>
        </View>
        
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
            />
            {formData.name ? (
              <Pressable 
                style={styles.clearButton} 
                onPress={() => handleChange('name', '')}
              >
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="E-Mail"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {formData.email ? (
              <Pressable 
                style={styles.clearButton} 
                onPress={() => handleChange('email', '')}
              >
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Phone size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Telefonnummer"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              keyboardType="phone-pad"
            />
            {formData.phone ? (
              <Pressable 
                style={styles.clearButton} 
                onPress={() => handleChange('phone', '')}
              >
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
            />
            {formData.address ? (
              <Pressable 
                style={styles.clearButton} 
                onPress={() => handleChange('address', '')}
              >
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Berufliche Informationen</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Abteilung</Text>
            <Text style={styles.infoValue}>{user?.department || 'Nicht angegeben'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Position</Text>
            <Text style={styles.infoValue}>{user?.role === 'admin' ? 'Administrator' : 
              user?.role === 'doctor' ? 'Arzt' : 
              user?.role === 'nurse' ? 'Pfleger' : 
              user?.role === 'pharmacist' ? 'Apotheker' : 
              user?.role === 'logistics' ? 'Logistik' : 
              'Nicht angegeben'}</Text>
          </View>
          
          <Text style={styles.infoNote}>
            Berufliche Informationen können nur von der Personalabteilung geändert werden.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Speichern"
            onPress={handleSave}
            variant="primary"
            isLoading={isLoading}
            fullWidth
          />
          
          <Button
            title="Abbrechen"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
            fullWidth
          />
        </View>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.border,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 4,
  },
  clearButton: {
    padding: 4,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  infoNote: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginBottom: 32,
  },
  cancelButton: {
    marginTop: 12,
  },
});