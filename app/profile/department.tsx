import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Building, Users, Phone, Mail, MapPin, ChevronRight, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/localization';
import { useAuthStore } from '@/stores/auth-store';

// Mock department data
const departmentData = {
  name: 'Kardiologie',
  description: 'Abteilung für Herz-Kreislauf-Erkrankungen',
  location: 'Gebäude A, 3. Stock',
  phone: '+49 123 456789',
  email: 'kardiologie@klinik.de',
  head: {
    name: 'Prof. Dr. Michael Weber',
    position: 'Chefarzt',
    email: 'michael.weber@klinik.de',
    phone: '+49 123 456789-1',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop'
  },
  staff: [
    {
      id: '1',
      name: 'Dr. Sarah Schmidt',
      position: 'Oberärztin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Dr. Thomas Müller',
      position: 'Assistenzarzt',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Maria Schneider',
      position: 'Stationsleitung',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '4',
      name: 'Jan Becker',
      position: 'Pfleger',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '5',
      name: 'Lisa Wagner',
      position: 'Pflegerin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
    }
  ],
  inventory: {
    totalItems: 342,
    lowStockItems: 12,
    expiringItems: 8,
    pendingOrders: 3
  }
};

// Mock department for other roles
const pharmacyDepartment = {
  name: 'Apotheke',
  description: 'Zentrale Krankenhausapotheke',
  location: 'Gebäude B, Erdgeschoss',
  phone: '+49 123 456789-2',
  email: 'apotheke@klinik.de',
  head: {
    name: 'Dr. Julia Hoffmann',
    position: 'Leitende Apothekerin',
    email: 'julia.hoffmann@klinik.de',
    phone: '+49 123 456789-3',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop'
  },
  staff: [
    {
      id: '6',
      name: 'Markus Schneider',
      position: 'Apotheker',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '7',
      name: 'Anna Bauer',
      position: 'Apothekerin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '8',
      name: 'Stefan Klein',
      position: 'PTA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    }
  ],
  inventory: {
    totalItems: 1245,
    lowStockItems: 32,
    expiringItems: 18,
    pendingOrders: 7
  }
};

// Mock department for logistics
const logisticsDepartment = {
  name: 'Logistik',
  description: 'Zentrale Logistikabteilung',
  location: 'Gebäude C, Untergeschoss',
  phone: '+49 123 456789-4',
  email: 'logistik@klinik.de',
  head: {
    name: 'Tobias Fischer',
    position: 'Leiter Logistik',
    email: 'tobias.fischer@klinik.de',
    phone: '+49 123 456789-5',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  staff: [
    {
      id: '9',
      name: 'Laura Schmidt',
      position: 'Logistikerin',
      avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: '10',
      name: 'Peter Wolf',
      position: 'Lagerist',
      avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=200&auto=format&fit=crop'
    }
  ],
  inventory: {
    totalItems: 2156,
    lowStockItems: 45,
    expiringItems: 23,
    pendingOrders: 12
  }
};

export default function DepartmentInfoScreen() {
  const { user } = useAuthStore();
  const [department, setDepartment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch department data
    const fetchDepartment = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set department data based on user's department
        if (user?.department?.includes('Apotheke') || user?.role === 'pharmacist') {
          setDepartment(pharmacyDepartment);
        } else if (user?.department?.includes('Logistik') || user?.role === 'logistics') {
          setDepartment(logisticsDepartment);
        } else {
          setDepartment(departmentData);
        }
      } catch (error) {
        console.error('Error fetching department data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartment();
  }, [user]);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Abteilungsinformationen werden geladen...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ 
        title: translations.profile.departmentInfo,
        headerBackTitle: translations.common.back
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Building size={40} color={colors.primary} />
          <Text style={styles.departmentName}>{department?.name}</Text>
          <Text style={styles.departmentDescription}>{department?.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontaktinformationen</Text>
          
          <View style={styles.infoRow}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.infoText}>{department?.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Phone size={20} color={colors.primary} />
            <Text style={styles.infoText}>{department?.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Mail size={20} color={colors.primary} />
            <Text style={styles.infoText}>{department?.email}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abteilungsleitung</Text>
          
          <View style={styles.headContainer}>
            <Image
              source={{ uri: department?.head.avatar }}
              style={styles.headAvatar}
              contentFit="cover"
            />
            
            <View style={styles.headInfo}>
              <Text style={styles.headName}>{department?.head.name}</Text>
              <Text style={styles.headPosition}>{department?.head.position}</Text>
              
              <View style={styles.headContactRow}>
                <Mail size={16} color={colors.primary} />
                <Text style={styles.headContactText}>{department?.head.email}</Text>
              </View>
              
              <View style={styles.headContactRow}>
                <Phone size={16} color={colors.primary} />
                <Text style={styles.headContactText}>{department?.head.phone}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mitarbeiter</Text>
            <Text style={styles.staffCount}>{department?.staff.length} Mitarbeiter</Text>
          </View>
          
          <View style={styles.staffList}>
            {department?.staff.map((staffMember: any) => (
              <Pressable 
                key={staffMember.id}
                style={({ pressed }) => [
                  styles.staffItem,
                  pressed && styles.staffItemPressed
                ]}
              >
                <Image
                  source={{ uri: staffMember.avatar }}
                  style={styles.staffAvatar}
                  contentFit="cover"
                />
                
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staffMember.name}</Text>
                  <Text style={styles.staffPosition}>{staffMember.position}</Text>
                </View>
                
                <ChevronRight size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventarübersicht</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{department?.inventory.totalItems}</Text>
              <Text style={styles.statLabel}>Artikel gesamt</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statWarning]}>{department?.inventory.lowStockItems}</Text>
              <Text style={styles.statLabel}>Niedriger Bestand</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statDanger]}>{department?.inventory.expiringItems}</Text>
              <Text style={styles.statLabel}>Bald ablaufend</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statInfo]}>{department?.inventory.pendingOrders}</Text>
              <Text style={styles.statLabel}>Offene Bestellungen</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
  },
  departmentName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  departmentDescription: {
    fontSize: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  staffCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headInfo: {
    flex: 1,
  },
  headName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  headPosition: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  headContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headContactText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  staffList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  staffItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  staffItemPressed: {
    backgroundColor: `${colors.primary}10`,
  },
  staffAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  staffPosition: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statWarning: {
    color: colors.warning,
  },
  statDanger: {
    color: colors.error,
  },
  statInfo: {
    color: colors.info,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    marginTop: 8,
    marginBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});