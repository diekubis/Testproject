import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, Platform, Modal, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { User, Mail, Building, Shield, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { Pressable } from 'react-native';

type UserFormProps = {
  user?: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    isActive: boolean;
  };
  onSubmit: (user: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
};

export default function UserForm({ user, onSubmit, onCancel, isEdit = false }: UserFormProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [role, setRole] = useState(user?.role || 'nurse');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(user?.isActive !== undefined ? user.isActive : true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  
  const handleSubmit = () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert("Fehler", "Bitte geben Sie einen Namen ein.");
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Fehler", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    
    if (!department.trim()) {
      Alert.alert("Fehler", "Bitte geben Sie eine Abteilung ein.");
      return;
    }
    
    if (!isEdit && (!password.trim() || password.length < 6)) {
      Alert.alert("Fehler", "Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    
    if (!isEdit && password !== confirmPassword) {
      Alert.alert("Fehler", "Die Passwörter stimmen nicht überein.");
      return;
    }
    
    // Create user object
    const userData = {
      ...(user && { id: user.id }),
      name,
      email,
      department,
      role,
      isActive,
      ...(password && { password }), // Include password in the user data for authentication
    };
    
    onSubmit(userData);
  };
  
  // Available roles
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'doctor', name: 'Arzt' },
    { id: 'nurse', name: 'Pfleger' },
    { id: 'pharmacist', name: 'Apotheker' },
    { id: 'logistics', name: 'Logistik' },
  ];
  
  // Available departments
  const departments = [
    'Kardiologie',
    'Neurologie',
    'Orthopädie',
    'Innere Medizin',
    'Chirurgie',
    'Pädiatrie',
    'Gynäkologie',
    'Radiologie',
    'Anästhesie',
    'Notaufnahme',
    'Intensivstation',
    'Pflege',
    'Apotheke',
    'Labor',
    'Verwaltung',
    'IT',
    'Logistik',
    'Einkauf',
  ];
  
  // Handle department selection
  const handleDepartmentSelect = (dept: string) => {
    setDepartment(dept);
    setShowDepartmentPicker(false);
  };
  
  // Handle role selection
  const handleRoleSelect = (roleId: string) => {
    setRole(roleId);
    setShowRolePicker(false);
  };
  
  // Render department picker modal for all platforms
  const renderDepartmentModal = () => {
    return (
      <Modal
        visible={showDepartmentPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDepartmentPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowDepartmentPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Abteilung auswählen</Text>
              <TouchableOpacity onPress={() => setShowDepartmentPicker(false)}>
                <Text style={styles.modalClose}>Schließen</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {departments.map((dept, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalItem,
                    department === dept && styles.modalItemSelected
                  ]}
                  onPress={() => handleDepartmentSelect(dept)}
                >
                  <Text style={[
                    styles.modalItemText,
                    department === dept && styles.modalItemTextSelected
                  ]}>{dept}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  // Render role picker modal for all platforms
  const renderRoleModal = () => {
    return (
      <Modal
        visible={showRolePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRolePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowRolePicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rolle auswählen</Text>
              <TouchableOpacity onPress={() => setShowRolePicker(false)}>
                <Text style={styles.modalClose}>Schließen</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.modalItem,
                    role === r.id && styles.modalItemSelected
                  ]}
                  onPress={() => handleRoleSelect(r.id)}
                >
                  <Text style={[
                    styles.modalItemText,
                    role === r.id && styles.modalItemTextSelected
                  ]}>{r.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <User size={20} color={colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Vollständiger Name"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>E-Mail</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <Mail size={20} color={colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="beispiel@klinik.de"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Abteilung</Text>
        <Pressable 
          style={styles.inputContainer}
          onPress={() => {
            setShowRolePicker(false); // Close other picker if open
            setShowDepartmentPicker(true);
          }}
        >
          <View style={styles.inputIcon}>
            <Building size={20} color={colors.primary} />
          </View>
          <Text style={[styles.input, styles.pickerText]}>
            {department || "Abteilung auswählen"}
          </Text>
        </Pressable>
        {renderDepartmentModal()}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Rolle</Text>
        <Pressable 
          style={styles.inputContainer}
          onPress={() => {
            setShowDepartmentPicker(false); // Close other picker if open
            setShowRolePicker(true);
          }}
        >
          <View style={styles.inputIcon}>
            <Shield size={20} color={colors.primary} />
          </View>
          <Text style={[styles.input, styles.pickerText]}>
            {roles.find(r => r.id === role)?.name || "Rolle auswählen"}
          </Text>
        </Pressable>
        {renderRoleModal()}
      </View>
      
      {!isEdit && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Passwort</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Mindestens 6 Zeichen"
                secureTextEntry={!showPassword}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </Pressable>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Passwort bestätigen</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Passwort wiederholen"
                secureTextEntry={!showConfirmPassword}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </Pressable>
            </View>
          </View>
        </>
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          title="Abbrechen"
          onPress={onCancel}
          variant="outline"
          fullWidth
        />
        
        <Button
          title={isEdit ? "Speichern" : "Benutzer erstellen"}
          onPress={handleSubmit}
          fullWidth
        />
      </View>
    </ScrollView>
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
  formGroup: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 1, // Ensure form groups have proper z-index
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
  },
  inputIcon: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  pickerText: {
    paddingVertical: 12,
    paddingRight: 12,
  },
  eyeIcon: {
    padding: 12,
    height: '100%',
    justifyContent: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure modal appears above everything
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001, // Even higher z-index for the content
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalClose: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemSelected: {
    backgroundColor: `${colors.primary}15`,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
  },
  modalItemTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
});