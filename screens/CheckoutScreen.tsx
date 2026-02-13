// screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useCart } from './CartContext';
import PaymentSuccessModal from './PaymentSuccessModal';
import { PRIMARY_COLOR } from './constants';

const CheckoutScreen = ({ navigation, route }: any) => {
  const { total } = route.params || { total: 0 };
  const { placeOrder } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Local state for address, time, and payment
  const [selectedAddress, setSelectedAddress] = useState('Home - Chennai, TN');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10-20 mins');
  const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const addresses = [
    { id: 1, type: 'Home', address: 'Chennai, TN - 600001', fullAddress: '123 Main Street, Home - Chennai, TN - 600001' },
    { id: 2, type: 'Office', address: 'Office, Chennai - Work Address', fullAddress: '456 Business Park, Office - Chennai' },
  ];

  const timeSlots = [
    { id: 1, time: '10-20 mins', available: true },
    { id: 2, time: '20-30 mins', available: true },
    { id: 3, time: '30-40 mins', available: true },
    { id: 4, time: '40-50 mins', available: true },
    { id: 5, time: '50-60 mins', available: true },
  ];

  const paymentOptions = [
    { id: 1, name: 'Cash on Delivery', icon: 'money', color: '#10B981' },
    { id: 2, name: 'UPI', icon: 'credit-card', color: '#F59E0B' },
    { id: 3, name: 'Debit Card', icon: 'credit-card', color: '#3B82F6' },
    { id: 4, name: 'Wallet', icon: 'wallet', color: '#8B5CF6' },
  ];

  const handleConfirmOrder = async () => {
    if (!selectedAddress || !selectedTimeSlot || !selectedPayment) {
      Alert.alert('Error', 'Please select delivery address, time slot, and payment method');
      return;
    }

    const id = await placeOrder(total);
    setOrderId(id);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.replace('OrderTracking', { orderNumber: orderId });
  };

  const deliveryFee = total > 200 ? 0 : 40;
  const finalTotal = total + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <Feather name="home" size={20} color={PRIMARY_COLOR} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressType}>Home</Text>
              <Text style={styles.addressText}>{selectedAddress}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Time Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Time</Text>
            <TouchableOpacity onPress={() => setTimeSlotModalVisible(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeSlotCard}>
            <Feather name="clock" size={20} color={PRIMARY_COLOR} />
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Estimated delivery</Text>
              <Text style={styles.timeValue}>{selectedTimeSlot}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => setPaymentModalVisible(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentCard}>
            <Feather name="credit-card" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.paymentValue}>{selectedPayment}</Text>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{total}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeDelivery]}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee</Text>
            <Text style={styles.summaryValue}>₹5</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount to Pay</Text>
            <Text style={styles.totalAmount}>₹{finalTotal + 5}</Text>
          </View>
        </View>

        {/* Promo Code Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.promoCard}>
            <Feather name="gift" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.promoText}>Add Promo Code</Text>
            <Feather name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Saved Offers Section */}
        <View style={styles.section}>
          <View style={styles.offerBox}>
            <Text style={styles.offerTitle}>💰 Save ₹10</Text>
            <Text style={styles.offerDesc}>Apply code FRESH10 on your first order</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleConfirmOrder}>
          <Text style={styles.btnText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Address Modal */}
      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Feather name="x" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.addressOption,
                  selectedAddress === addr.fullAddress && styles.addressOptionSelected,
                ]}
                onPress={() => {
                  setSelectedAddress(addr.fullAddress);
                  setAddressModalVisible(false);
                }}
              >
                <View style={styles.addressOptionIcon}>
                  <Feather name={addr.type === 'Home' ? 'home' : 'briefcase'} size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.addressOptionContent}>
                  <Text style={styles.addressOptionType}>{addr.type}</Text>
                  <Text style={styles.addressOptionAddress}>{addr.address}</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedAddress === addr.fullAddress && styles.radioButtonSelected,
                  ]}
                >
                  {selectedAddress === addr.fullAddress && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addAddressBtn}>
              <Feather name="plus" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Slot Modal */}
      <Modal
        visible={timeSlotModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTimeSlotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Time</Text>
              <TouchableOpacity onPress={() => setTimeSlotModalVisible(false)}>
                <Feather name="x" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slotOption,
                  selectedTimeSlot === slot.time && styles.slotOptionSelected,
                ]}
                onPress={() => {
                  setSelectedTimeSlot(slot.time);
                  setTimeSlotModalVisible(false);
                }}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedTimeSlot === slot.time && styles.radioButtonSelected,
                  ]}
                >
                  {selectedTimeSlot === slot.time && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <View>
                  <Text style={styles.slotTime}>{slot.time}</Text>
                  <Text style={styles.slotAvailable}>
                    {slot.available ? '✓ Slot Available' : 'Not Available'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Feather name="x" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.paymentOption,
                  selectedPayment === option.name && styles.paymentOptionSelected,
                ]}
                onPress={() => {
                  setSelectedPayment(option.name);
                  setPaymentModalVisible(false);
                }}
              >
                <View style={[styles.paymentIcon, { backgroundColor: option.color }]}>
                  <Feather name={option.icon} size={18} color="#fff" />
                </View>
                <Text style={styles.paymentOptionName}>{option.name}</Text>
                <View
                  style={[
                    styles.radioButton,
                    selectedPayment === option.name && styles.radioButtonSelected,
                  ]}
                >
                  {selectedPayment === option.name && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <PaymentSuccessModal
        visible={modalVisible}
        orderId={orderId}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },

  content: { flex: 1, padding: 16 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  changeText: { fontSize: 13, color: PRIMARY_COLOR, fontWeight: '600' },

  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressInfo: { flex: 1 },
  addressType: { fontSize: 14, fontWeight: '600', color: '#111827' },
  addressText: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  timeSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeInfo: { flex: 1 },
  timeLabel: { fontSize: 12, color: '#9CA3AF' },
  timeValue: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 2 },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentValue: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  freeDelivery: { color: PRIMARY_COLOR, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: PRIMARY_COLOR },

  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  promoText: { flex: 1, fontSize: 14, fontWeight: '600', color: PRIMARY_COLOR },

  offerBox: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, borderLeftWidth: 4, borderColor: '#F59E0B' },
  offerTitle: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  offerDesc: { fontSize: 12, color: '#B45309', marginTop: 4 },

  footer: { padding: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
  btn: { backgroundColor: PRIMARY_COLOR, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingBottom: 30, maxHeight: '80%' },
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

  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  addressOptionSelected: { backgroundColor: '#F0FDF4' },
  addressOptionIcon: { width: 40, height: 40, backgroundColor: '#F9FAFB', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addressOptionContent: { flex: 1 },
  addressOptionType: { fontSize: 14, fontWeight: '600', color: '#111827' },
  addressOptionAddress: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addAddressText: { fontSize: 14, fontWeight: '600', color: PRIMARY_COLOR, marginLeft: 8 },

  slotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  slotOptionSelected: { backgroundColor: '#F0FDF4' },
  slotTime: { fontSize: 16, fontWeight: '600', color: '#111827' },
  slotAvailable: { fontSize: 12, color: '#10B981', marginTop: 4 },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  paymentOptionSelected: { backgroundColor: '#F0FDF4' },
  paymentIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  paymentOptionName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },

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