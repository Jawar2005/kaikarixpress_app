// components/PaymentSuccessModal.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#22C55E';

interface PaymentSuccessModalProps {
  visible: boolean;
  isSuccess: boolean;
  orderNumber?: string;
  totalAmount?: number;
  onClose: () => void;
}

const PaymentSuccessModal = ({
  visible,
  isSuccess,
  orderNumber,
  totalAmount,
  onClose,
}: PaymentSuccessModalProps) => {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isSuccess
                  ? '#ECFDF3'
                  : '#FEF2F2',
              },
            ]}
          >
            <MaterialIcons
              name={isSuccess ? 'check-circle' : 'error-outline'}
              size={60}
              color={isSuccess ? PRIMARY_COLOR : '#EF4444'}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isSuccess ? 'Order Placed!' : 'Payment Failed'}
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            {isSuccess
              ? 'Your order has been placed successfully. Track your delivery in the orders section.'
              : 'Something went wrong with your payment. Please try again.'}
          </Text>

          {/* Order Details */}
          {isSuccess && (
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Number</Text>
                <Text style={styles.detailValue}>{orderNumber}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Amount</Text>
                <Text style={styles.detailValue}>₹{totalAmount?.toFixed(2)}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            {isSuccess ? (
              <>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onClose}
                >
                  <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onClose}
                >
                  <MaterialIcons name="track-changes" size={20} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Track Order</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onClose}
                >
                  <Text style={styles.secondaryButtonText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onClose}
                >
                  <MaterialIcons name="refresh" size={20} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Retry Payment</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PaymentSuccessModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  detailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  buttonGroup: {
    gap: 10,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '700',
  },
});
