import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import Button from '@/components/Button';
import { translations } from '@/constants/localization';

export default function PersonalInfoScreen() {
  const { user, updateUserProfile } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
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
        'Ihre persönlichen Informationen wurden aktualisiert.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        translations.common.error,
        'Beim Speichern Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadPhoto = () => {
    Alert.alert(
      'Profilbild ändern',
      'Diese Funktion ist in der Demo-Version nicht verfügbar.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: translations.profile.personalInfo,
        headerBackTitle: translations.common.back
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.photoEditButton}>
              <Button
                icon={<Camera size={18} color={colors.white} />}
                variant="primary"
                size="icon"
                onPress={handleUploadPhoto}
              />
            </View>
          </View>
          <Text style={styles.photoHint}>Tippen Sie auf das Symbol, um Ihr Profilbild zu ändern</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Persönliche Daten</Text>
          
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
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Berufliche Informationen</Text>
          
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
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mitarbeiter-ID</Text>
            <Text style={styles.infoValue}>{user?.id || 'Nicht angegeben'}</Text>
          </View>
          
          <Text style={styles.hint}>
            Berufliche Informationen können nur von der Personalabteilung geändert werden.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Änderungen speichern"
            onPress={handleSave}
            variant="primary"
            isLoading={isLoading}
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.border,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  photoHint: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
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
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
});