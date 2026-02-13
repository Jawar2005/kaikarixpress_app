// screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import StorageService, { UserProfile, Address } from './StorageService';

const PRIMARY_COLOR = '#22C55E';

interface MenuItem {
  id: number;
  icon: string;
  label: string;
  action: string;
}

const ProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const menuItems: MenuItem[] = [
    { id: 1, icon: 'person', label: 'Edit Profile', action: 'EditProfile' },
    { id: 2, icon: 'location-on', label: 'Manage Addresses', action: 'ManageAddresses' },
    { id: 3, icon: 'history', label: 'Past Orders', action: 'PastOrders' },
    { id: 4, icon: 'notifications', label: 'Notifications', action: 'Notifications' },
    { id: 5, icon: 'settings', label: 'Settings', action: 'Settings' },
    { id: 6, icon: 'help', label: 'Help & Support', action: 'Help' },
  ];

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const userProfile = await StorageService.getProfile();
      const userAddresses = await StorageService.getAddresses();

      if (!userProfile) {
        const defaultProfile: UserProfile = {
          id: 'user_1',
          name: 'Jaswanth',
          email: 'jaswanth@email.com',
          phone: '+91 8883254695',
          createdAt: new Date().toISOString()
        };
        await StorageService.saveProfile(defaultProfile);
        setProfile(defaultProfile);
      } else {
        setProfile(userProfile);
      }

      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemPress = (action: string) => {
    if (['EditProfile', 'ManageAddresses'].includes(action)) {
      navigation.navigate(action);
    } else {
      Alert.alert('Coming Soon', `${action} feature coming soon!`);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => { } },
      {
        text: 'Logout',
        onPress: () => {
          navigation.replace('Login');
        },
      },
    ]);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item.action)}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconBox}>
        <MaterialIcons name={item.icon as any} size={20} color={PRIMARY_COLOR} />
      </View>
      <Text style={styles.menuLabel}>{item.label}</Text>
      <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name?.charAt(0).toUpperCase() || 'J'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.name || 'User'}</Text>
            <Text style={styles.userPhone}>{profile?.phone || 'N/A'}</Text>
            <Text style={styles.userEmail}>{profile?.email || 'N/A'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="edit-2" size={18} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        {/* Saved Addresses Section */}
        {addresses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Addresses</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ManageAddresses')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {addresses.slice(0, 2).map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressIconBox}>
                  <MaterialIcons
                    name={
                      address.type === 'home'
                        ? 'home'
                        : address.type === 'work'
                          ? 'business'
                          : 'location-on'
                    }
                    size={18}
                    color={PRIMARY_COLOR}
                  />
                </View>
                <View style={styles.addressContent}>
                  <Text style={styles.addressLabel}>{address.type.toUpperCase()}</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {address.fullAddress}
                  </Text>
                </View>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMenuItem}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.versionText}>KaikariXpress v1.1.0</Text>
          <Text style={styles.copyrightText}>
            © 2024 KaikariXpress. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  userPhone: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  editBtn: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContent: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 11,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
});
