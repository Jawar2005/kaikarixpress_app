// screens/CategoryScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, PRODUCTS, PRIMARY_COLOR } from '../screens/constants';
import { AddButton } from '../screens/AddButton';
import { Feather } from '@expo/vector-icons';

const CategoryScreen = ({ route, navigation }: any) => {
  const [selectedCatId, setSelectedCatId] = useState(route.params?.categoryId || CATEGORIES[0].id);

  // Filter products based on selected category on the left
  const displayProducts = PRODUCTS.filter(p => p.category === selectedCatId);

  const renderSideBarItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.sidebarItem, selectedCatId === item.id && styles.sidebarItemActive]}
      onPress={() => setSelectedCatId(item.id)}
    >
      <View style={[styles.sidebarIcon, selectedCatId === item.id && styles.sidebarIconActive]}>
        <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: selectedCatId === item.id ? '#DCFCE7' : '#eee' }} />
      </View>
      <Text style={[styles.sidebarText, selectedCatId === item.id && styles.sidebarTextActive]}>
        {item.name}
      </Text>
      {selectedCatId === item.id && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <View style={styles.imgWrapper}>
        <Image source={{ uri: item.image }} style={styles.productImg} />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.weight}>{item.weight}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <AddButton item={item} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Feather name="search" size={20} color="#666" />
        <Text style={styles.headerSearchText}>Search for products...</Text>
      </View>

      <View style={styles.content}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderSideBarItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Right Content */}
        <View style={styles.mainList}>
          <Text style={styles.catHeader}>{CATEGORIES.find(c => c.id === selectedCatId)?.name} ({displayProducts.length})</Text>
          <FlatList
            data={displayProducts}
            renderItem={renderProductItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, margin: 12, backgroundColor: '#F3F4F6', borderRadius: 10, gap: 10 },
  headerSearchText: { color: '#9CA3AF' },
  content: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 85, backgroundColor: '#F8F9FA', borderRightWidth: 1, borderColor: '#E5E7EB' },
  sidebarItem: { paddingVertical: 16, alignItems: 'center', position: 'relative' },
  sidebarItemActive: { backgroundColor: '#fff' },
  sidebarIcon: { marginBottom: 6 },
  sidebarIconActive: { transform: [{ scale: 1.1 }] },
  sidebarText: { fontSize: 10, textAlign: 'center', color: '#6B7280' },
  sidebarTextActive: { fontWeight: '700', color: PRIMARY_COLOR },
  activeIndicator: { position: 'absolute', right: 0, top: 10, bottom: 10, width: 4, backgroundColor: PRIMARY_COLOR, borderRadius: 2 },
  mainList: { flex: 1, padding: 16, backgroundColor: '#fff' },
  catHeader: { fontSize: 16, fontWeight: '700', marginBottom: 16, color: '#111827' },
  productCard: { flexDirection: 'row', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  imgWrapper: { width: 80, height: 80, marginRight: 12, backgroundColor: '#F9FAFB', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  productImg: { width: 60, height: 60, resizeMode: 'contain' },
  infoWrapper: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  weight: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 15, fontWeight: '700', color: '#111827' },
});