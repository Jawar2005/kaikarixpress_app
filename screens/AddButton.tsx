// components/AddButton.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from './CartContext';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../screens/constants';
import { Feather } from '@expo/vector-icons';

export const AddButton = ({ item }: { item: any }) => {
  const { getItemCount, addToCart, updateQuantity } = useCart();
  const count = getItemCount(item.id);

  if (count === 0) {
    return (
      <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.iconBtn}>
        <Feather name="minus" size={14} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.countText}>{count}</Text>
      <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.iconBtn}>
        <Feather name="plus" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addText: {
    color: PRIMARY_COLOR,
    fontWeight: '800',
    fontSize: 13,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    width: 80,
  },
  countText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconBtn: {
    padding: 2,
  }
});