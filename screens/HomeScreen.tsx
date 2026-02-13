import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { PRIMARY_COLOR, SECONDARY_COLOR, PRODUCTS, CATEGORIES } from '../screens/constants';
import { AddButton } from '../screens/AddButton';

const HomeScreen = ({ navigation }: any) => {
  
  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImg} />
      </View>
      <View >
        
        <Text style={styles.timeTag}>10 MINS</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productWeight}>{item.weight}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.oldPrice && <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>}
          </View>
          <AddButton item={item} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 1. Header with Location */}
      <View style={styles.header}>
        <View>
          <Text style={styles.deliveryTitle}>DELIVERY IN <Text style={styles.boldTime}>10 MINS</Text></Text>
          <TouchableOpacity style={styles.locationRow} onPress={() => navigation.navigate('Location')}>
            <Text style={styles.locationText}>Home - Chennai, TN</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
        
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput placeholder='Search "Milk"' style={styles.input} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* 3. Promotional Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View>
              <Text style={styles.bannerTitle}>50% OFF</Text>
              <Text style={styles.bannerSub}>On First Order</Text>
              <TouchableOpacity style={styles.shopNowBtn}><Text style={styles.shopNowText}>Shop Now</Text></TouchableOpacity>
            </View>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png' }} style={styles.bannerImg} />
          </View>
        </View>

        {/* 4. Categories Grid */}
        <Text style={styles.sectionHeader}>Explore By Categories</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryItem} 
              onPress={() => navigation.navigate('Categories', { categoryId: cat.id })}
            >
              <View style={styles.catIconBox}>
                <FontAwesome5 name={cat.icon as any} size={24} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.catText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 5. Horizontal Product Scroll: Best Sellers */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionHeader}>Best Sellers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs',{screen : 'Categories'})} ><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {PRODUCTS.map((item) => renderProductItem({ item }))}
        </ScrollView>
        <View style={styles.listHeader}>
          <Text style={styles.sectionHeader}>listing vegtable</Text></View>
         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {PRODUCTS.map((item) => renderProductItem({ item }))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryTitle: { fontSize: 10, fontWeight: '800', color: PRIMARY_COLOR, letterSpacing: 0.5 },
  boldTime: { fontSize: 12, fontWeight: '900' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 14, fontWeight: '600', color: '#374151', marginRight: 4 },
  profileBtn: { padding: 4 },
  searchContainer: { paddingHorizontal: 16, marginBottom: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 46 },
  input: { flex: 1, marginLeft: 10, fontSize: 14 },
  bannerContainer: { padding: 16 },
  banner: { backgroundColor: '#DCFCE7', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { fontSize: 24, fontWeight: '900', color: '#166534' },
  bannerSub: { fontSize: 14, color: '#15803d', marginBottom: 10 },
  shopNowBtn: { backgroundColor: '#166534', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  shopNowText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  bannerImg: { width: 80, height: 80, resizeMode: 'contain' },
  sectionHeader: { fontSize: 18, fontWeight: '700', paddingHorizontal: 16, color: '#111827', marginBottom: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, marginBottom: 20 },
  categoryItem: { width: '25%', alignItems: 'center', marginBottom: 16 },
  catIconBox: { width: 60, height: 60, backgroundColor: '#F3F4F6', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  catText: { fontSize: 11, fontWeight: '500', color: '#4B5563', textAlign: 'center' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  seeAll: { color: PRIMARY_COLOR, fontWeight: '600', fontSize: 13 },
  horizontalList: { paddingHorizontal: 16, paddingBottom: 20 },
  productCard: { width: 140, marginRight: 12, borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 8, backgroundColor: '#fff' },
  imageContainer: { height: 100, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  productImg: { width: 80, height: 80, resizeMode: 'contain' },
  timeTag: { fontSize: 9, backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, fontWeight: '700', marginBottom: 4 },
  productName: { fontSize: 13, fontWeight: '600', color: '#374151', height: 36, marginBottom: 4 },
  productWeight: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: '700', color: '#111827' },
  oldPrice: { fontSize: 11, color: '#9CA3AF', textDecorationLine: 'line-through' },
});