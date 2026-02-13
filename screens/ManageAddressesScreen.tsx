import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import StorageService, { Address } from './StorageService';
import AddressEditorModal from './AddressEditorModal';
import { PRIMARY_COLOR } from './constants';

const ManageAddressesScreen = ({ navigation }: any) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const loadAddresses = async () => {
    const data = await StorageService.getAddresses();
    setAddresses(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsEditorVisible(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsEditorVisible(true);
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteAddress(id);
            loadAddresses();
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    await StorageService.setDefaultAddress(id);
    loadAddresses();
  };

  const handleSaveAddress = async (address: Address) => {
    if (address.id) {
      await StorageService.updateAddress(address.id, address);
    } else {
      await StorageService.addAddress(address);
    }
    loadAddresses();
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={[styles.addressCard, item.isDefault && styles.defaultCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.typeTag}>
          <MaterialIcons
            name={item.type === 'home' ? 'home' : item.type === 'work' ? 'work' : 'location-on'}
            size={16}
            color={PRIMARY_COLOR}
          />
          <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}
      </View>

      <Text style={styles.addressText}>{item.fullAddress}</Text>
      <Text style={styles.cityText}>
        {item.city}, {item.state} - {item.pincode}
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleEditAddress(item)}
        >
          <Feather name="edit-2" size={16} color="#4B5563" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Feather name="trash-2" size={16} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
        </TouchableOpacity>

        {!item.isDefault && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleSetDefault(item.id)}
            >
              <Text style={[styles.actionText, { color: PRIMARY_COLOR }]}>Set Default</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={handleAddAddress}>
          <Text style={styles.addBtnText}>+ ADD NEW</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No addresses found</Text>
            <Text style={styles.emptySubText}>Add a new address to get started</Text>
          </View>
        }
      />

      <AddressEditorModal
        visible={isEditorVisible}
        address={editingAddress}
        onClose={() => setIsEditorVisible(false)}
        onSave={handleSaveAddress}
      />
    </SafeAreaView>
  );
};

export default ManageAddressesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  addBtnText: { fontSize: 14, fontWeight: '700', color: PRIMARY_COLOR },
  listContent: { padding: 16 },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  defaultCard: { borderColor: PRIMARY_COLOR, borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  typeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontWeight: '700', color: '#166534', marginLeft: 4 },
  defaultBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  defaultText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8' },
  addressText: { fontSize: 15, fontWeight: '600', color: '#374151', lineHeight: 22, marginBottom: 4 },
  cityText: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginLeft: 6 },
  divider: { width: 1, height: 16, backgroundColor: '#E5E7EB' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
});
