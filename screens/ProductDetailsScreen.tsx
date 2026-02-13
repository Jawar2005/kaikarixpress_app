import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useCart } from './CartContext';
import { PRIMARY_COLOR } from './constants';

const ProductDetailsScreen = ({ navigation, route }: any) => {
  const { addToCart } = useCart();
  const { product } = route.params || {};
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || { size: '500g', price: product?.price });
  const [showVariantModal, setShowVariantModal] = useState(false);

  const item = product || {
    id: 99,
    name: 'Unknown',
    price: 0,
    weight: 'N/A',
    image: 'https://via.placeholder.com/300',
    description: 'No details available',
    variants: [
      { size: '500g', price: 0 },
    ]
  };

  // Mock variants for demo
  const variants = [
    { size: '250g', price: item.price - 30 },
    { size: '500g', price: item.price },
    { size: '1kg', price: item.price + 50 },
  ];

  const handleAddToCart = () => {
    const cartItem = { ...item, quantity, selectedSize: selectedVariant.size };
    addToCart(cartItem);
    // Show toast or navigate to cart
    navigation.navigate('Cart');
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = selectedVariant.price * quantity;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* Product Image Section */}
        <View style={styles.imageSection}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>⏱ 10 MINS</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.priceSection}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.weight}>{item.weight}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{selectedVariant.price}</Text>
            {item.oldPrice && <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>}
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>Save 20%</Text>
            </View>
          </View>

          {/* Variant Selection */}
          <TouchableOpacity
            style={styles.variantSelector}
            onPress={() => setShowVariantModal(true)}
          >
            <View style={styles.variantContent}>
              <Text style={styles.variantLabel}>Size</Text>
              <Text style={styles.variantValue}>{selectedVariant.size}</Text>
            </View>
            <Feather name="chevron-down" size={18} color={PRIMARY_COLOR} />
          </TouchableOpacity>

          {/* Product Highlights */}
          <View style={styles.highlightsContainer}>
            <View style={styles.highlightItem}>
              <MaterialIcons name="local-florist" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.highlightText}>100% Organic</Text>
            </View>
            <View style={styles.highlightItem}>
              <MaterialIcons name="agriculture" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.highlightText}>Farm Fresh</Text>
            </View>
            <View style={styles.highlightItem}>
              <MaterialIcons name="verified" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.highlightText}>Quality Check</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              Fresh, organic, and hand-picked {item.name}. Directly from the farm to your doorstep. Rich in vitamins and perfect for your daily cooking needs. Sourced from local farmers in Tamil Nadu.
            </Text>
          </View>

          {/* Nutritional Info */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Nutritional Info</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>45</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>2g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>0.3g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>10g</Text>
              </View>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerContainer}>
            <View style={styles.sellerIcon}>
              <Feather name="shop" size={20} color={PRIMARY_COLOR} />
            </View>
            <View>
              <Text style={styles.sellerName}>KaikariXpress Store</Text>
              <Text style={styles.sellerRating}>★ 4.8 (2.3k reviews)</Text>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <Feather name="truck" size={18} color={PRIMARY_COLOR} />
              <View>
                <Text style={styles.deliveryLabel}>Free Delivery</Text>
                <Text style={styles.deliveryValue}>On orders above ₹50</Text>
              </View>
            </View>
            <View style={styles.deliveryItem}>
              <Feather name="shield" size={18} color={PRIMARY_COLOR} />
              <View>
                <Text style={styles.deliveryLabel}>Guarantee</Text>
                <Text style={styles.deliveryValue}>Fresh or money back</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Floating Bar with Quantity & Add to Cart */}
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={handleQuantityDecrease}
          >
            <Feather name="minus" size={18} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={handleQuantityIncrease}
          >
            <Feather name="plus" size={18} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.addBtnText}>
            Add to Cart - ₹{totalPrice}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Variant Selection Modal */}
      <Modal
        visible={showVariantModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVariantModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Size</Text>
              <TouchableOpacity onPress={() => setShowVariantModal(false)}>
                <Feather name="x" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            {variants.map((variant) => (
              <TouchableOpacity
                key={variant.size}
                style={[
                  styles.variantOption,
                  selectedVariant.size === variant.size && styles.variantOptionSelected,
                ]}
                onPress={() => {
                  setSelectedVariant(variant);
                  setShowVariantModal(false);
                }}
              >
                <View style={styles.variantOptionLeft}>
                  <Text style={styles.variantOptionSize}>{variant.size}</Text>
                </View>
                <View style={styles.variantOptionRight}>
                  <Text style={styles.variantOptionPrice}>₹{variant.price}</Text>
                  <View
                    style={[
                      styles.radioButton,
                      selectedVariant.size === variant.size && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedVariant.size === variant.size && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  scrollContent: { flex: 1 },

  // Image Section
  imageSection: { position: 'relative', width: '100%', height: 300, backgroundColor: '#F9FAFB' },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  timeBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  timeBadgeText: { fontSize: 12, fontWeight: '700', color: '#374151' },

  // Product Info
  content: { padding: 20 },
  priceSection: { marginBottom: 12 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  weight: { fontSize: 14, color: '#9CA3AF' },

  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  price: { fontSize: 24, fontWeight: 'bold', color: PRIMARY_COLOR },
  oldPrice: { fontSize: 16, color: '#9CA3AF', textDecorationLine: 'line-through' },
  offerBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  offerText: { fontSize: 12, fontWeight: '600', color: '#DC2626' },

  // Variant Selector
  variantSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  variantContent: {},
  variantLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 },
  variantValue: { fontSize: 16, fontWeight: '600', color: '#111827' },

  // Highlights
  highlightsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24, justifyContent: 'space-around' },
  highlightItem: { alignItems: 'center', gap: 8 },
  highlightText: { fontSize: 12, fontWeight: '500', color: '#374151', textAlign: 'center' },

  // Sections
  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  description: { fontSize: 14, color: '#555', lineHeight: 22, color: '#6B7280' },

  // Nutrition Grid
  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  nutritionItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  nutritionLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  nutritionValue: { fontSize: 16, fontWeight: '700', color: '#111827' },

  // Seller Info
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  sellerIcon: { width: 40, height: 40, backgroundColor: PRIMARY_COLOR, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  sellerName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  sellerRating: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

  // Delivery Info
  deliveryInfo: { gap: 12, marginBottom: 20 },
  deliveryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10, gap: 12 },
  deliveryLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },
  deliveryValue: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityBtn: { padding: 6 },
  quantityValue: { fontSize: 16, fontWeight: '600', color: '#111827', minWidth: 24, textAlign: 'center' },

  addBtn: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingBottom: 30 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    paddingBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },

  variantOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  variantOptionSelected: { backgroundColor: '#F0FDF4' },
  variantOptionLeft: {},
  variantOptionRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  variantOptionSize: { fontSize: 16, fontWeight: '600', color: '#111827' },
  variantOptionPrice: { fontSize: 16, fontWeight: '700', color: PRIMARY_COLOR },

  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: { borderColor: PRIMARY_COLOR, backgroundColor: PRIMARY_COLOR },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});