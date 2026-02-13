import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';
import { MaterialIcons } from '@expo/vector-icons';

const OrdersHistoryScreen = () => {
  const { orders } = useCart();

  const renderOrder = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.itemsText}>
          {item.items.map((i: any) => i.name).join(', ')}
        </Text>
        <Text style={styles.total}>Total: ₹{item.totalAmount}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No past orders found.</Text>
        </View>
      )}
    </View>
  );
};

export default OrdersHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  date: { color: '#888' },
  body: { marginBottom: 12 },
  itemsText: { color: '#555', marginBottom: 4 },
  total: { fontWeight: 'bold', color: '#22C55E' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end' },
  statusBadge: { backgroundColor: '#ECFDF3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#22C55E', fontWeight: 'bold', fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 }  
});