// screens/CartScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useCart } from './CartContext';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../screens/constants';
import { AddButton } from '../screens/AddButton';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const CartScreen = ({ navigation }: any) => {
  const { cartItems, cartTotal, placeOrder, cartCount } = useCart();
  
  const DELIVERY_FEE = cartTotal > 200 ? 0 : 30;
  const HANDLING_CHARGE = 5;
  const TO_PAY = cartTotal + DELIVERY_FEE + HANDLING_CHARGE;

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png' }} style={styles.emptyImg} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add items to start a cart</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.shopBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
         <Image source={{ uri: item.image }} style={styles.itemImg} />
         <View style={{marginLeft: 12}}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemWeight}>{item.weight}</Text>
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
         </View>
      </View>
      <AddButton item={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({cartCount} Items)</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Items List */}
        <View style={styles.section}>
          <FlatList
             data={cartItems}
             renderItem={renderItem}
             keyExtractor={item => String(item.id)}
             scrollEnabled={false}
          />
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policyBox}>
           <MaterialIcons name="info-outline" size={16} color="#6B7280" />
           <Text style={styles.policyText}>Orders cannot be cancelled once packed.</Text>
        </View>

        {/* Bill Details */}
        <Text style={styles.sectionHeader}>Bill Details</Text>
        <View style={styles.billCard}>
          <View style={styles.billRow}>
             <Text style={styles.billLabel}>Item Total</Text>
             <Text style={styles.billValue}>₹{cartTotal}</Text>
          </View>
          <View style={styles.billRow}>
             <Text style={styles.billLabel}>Delivery Fee</Text>
             <Text style={[styles.billValue, { color: DELIVERY_FEE === 0 ? PRIMARY_COLOR : '#111' }]}>
                {DELIVERY_FEE === 0 ? 'FREE' : `₹${DELIVERY_FEE}`}
             </Text>
          </View>
          <View style={styles.billRow}>
             <Text style={styles.billLabel}>Handling Charge</Text>
             <Text style={styles.billValue}>₹{HANDLING_CHARGE}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
             <Text style={styles.totalLabel}>To Pay</Text>
             <Text style={styles.totalValue}>₹{TO_PAY}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Checkout Button */}
      <View style={styles.footer}>
         <View>
            <Text style={styles.footerTotal}>₹{TO_PAY}</Text>
            <Text style={styles.footerSub}>TOTAL</Text>
         </View>
         <TouchableOpacity 
            style={styles.checkoutBtn} 
            onPress={() => navigation.navigate('Checkout', { total: TO_PAY })}
         >
           <Text style={styles.checkoutText}>Proceed to Pay</Text>
           <Feather name="chevron-right" size={18} color="#fff" />
         </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyImg: { width: 150, height: 150, marginBottom: 20, opacity: 0.5 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#374151' },
  emptySub: { color: '#9CA3AF', marginTop: 8 },
  shopBtn: { marginTop: 20, backgroundColor: PRIMARY_COLOR, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  shopBtnText: { color: '#fff', fontWeight: 'bold' },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  itemInfo: { flexDirection: 'row', alignItems: 'center' },
  itemImg: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#F3F4F6' },
  itemName: { fontWeight: '600', fontSize: 14, color: '#374151' },
  itemWeight: { fontSize: 12, color: '#9CA3AF' },
  itemPrice: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  policyBox: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 12, marginHorizontal: 16, borderRadius: 8, alignItems: 'center', gap: 8, marginBottom: 20 },
  policyText: { color: '#6B7280', fontSize: 12, flex: 1 },
  sectionHeader: { fontSize: 16, fontWeight: '700', marginLeft: 16, marginBottom: 8, color: '#374151' },
  billCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 20 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { color: '#4B5563', fontSize: 13 },
  billValue: { fontWeight: '600', fontSize: 13 },
  totalRow: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontWeight: '700', fontSize: 16 },
  totalValue: { fontWeight: '700', fontSize: 16 },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#E5E7EB' },
  footerTotal: { fontSize: 18, fontWeight: '700', color: '#111827' },
  footerSub: { fontSize: 10, color: PRIMARY_COLOR, fontWeight: '700' },
  checkoutBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  checkoutText: { color: '#fff', fontWeight: '700', marginRight: 4 }
});