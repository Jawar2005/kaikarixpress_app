// components/AddressEditorModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Address } from '../screens/StorageService';

const PRIMARY_COLOR = '#22C55E';

interface AddressEditorModalProps {
  visible: boolean;
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}

const AddressEditorModal = ({
  visible,
  address,
  onClose,
  onSave,
}: AddressEditorModalProps) => {
  const [formData, setFormData] = useState<Address>(
    address || {
      id: '',
      type: 'home',
      fullAddress: '',
      city: '',
      state: '',
      pincode: '',
      latitude: 0,
      longitude: 0,
      isDefault: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      newErrors.pincode = 'Valid 6-digit pincode required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Address</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <ScrollView style={styles.scrollContent}>
          {/* Address Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Address Type</Text>
            <View style={styles.typeSelector}>
              {(['home', 'work', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <MaterialIcons
                    name={type === 'home' ? 'home' : type === 'work' ? 'work' : 'location-on'}
                    size={20}
                    color={formData.type === type ? PRIMARY_COLOR : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Full Address */}
          <View style={styles.section}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput
              style={[styles.input, errors.fullAddress && styles.inputError]}
              placeholder="Enter complete address"
              value={formData.fullAddress}
              onChangeText={(text) =>
                setFormData({ ...formData, fullAddress: text })
              }
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
            {errors.fullAddress && (
              <Text style={styles.errorText}>{errors.fullAddress}</Text>
            )}
          </View>

          {/* City */}
          <View style={styles.section}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="Enter city"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholderTextColor="#9CA3AF"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          {/* State */}
          <View style={styles.section}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={[styles.input, errors.state && styles.inputError]}
              placeholder="Enter state"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholderTextColor="#9CA3AF"
            />
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}
          </View>

          {/* Pincode */}
          <View style={styles.section}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={[styles.input, errors.pincode && styles.inputError]}
              placeholder="Enter 6-digit pincode"
              value={formData.pincode}
              onChangeText={(text) =>
                setFormData({ ...formData, pincode: text.slice(0, 6) })
              }
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#9CA3AF"
            />
            {errors.pincode && (
              <Text style={styles.errorText}>{errors.pincode}</Text>
            )}
          </View>

          {/* Set as Default */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() =>
                setFormData({ ...formData, isDefault: !formData.isDefault })
              }
            >
              <View
                style={[
                  styles.checkbox,
                  formData.isDefault && styles.checkboxChecked,
                ]}
              >
                {formData.isDefault && (
                  <MaterialIcons
                    name="check"
                    size={16}
                    color="#ffffff"
                  />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Set as default delivery address
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <MaterialIcons name="check" size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddressEditorModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: '#ECFDF3',
    borderColor: PRIMARY_COLOR,
  },
  typeButtonText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#166534',
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
  saveButton: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
