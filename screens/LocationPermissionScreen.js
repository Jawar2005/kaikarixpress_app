// screens/LocationPermissionScreen.tsx
import React,{ useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image, Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from "expo-location";


const LocationPermissionScreen = ({ navigation }: any) => {
  const handleAllow = () => {
    navigation.replace('MainTabs');
  };

const [loading, setLoading] = useState(false);
const [address, setAddress] = useState(null);

const getLocationAndAddress = async () => {
  try {
    setLoading(true);

    // Ask permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location access is required');
      setLoading(false);
      return;
    }

    // Get accurate location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;

    // LocationIQ Reverse Geocode
    const url = `https://us1.locationiq.com/v1/reverse?key=pk.e2e68619a0bccebb228c1464cf6e10d4&lat=${latitude}&lon=${longitude}&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();

    const formattedAddress = {
      fullAddress: data.display_name || '',
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        '',
      state: data.address?.state || '',
      country: data.address?.country || '',
      pincode: data.address?.postcode || '',
      road: data.address?.road || '',
      suburb: data.address?.suburb || '',
      latitude,
      longitude,
    };

    setAddress(formattedAddress);

    // Navigate after success
    navigation.navigate('MainApp', {
      screen: 'MainTabs',
      params: { address: formattedAddress },
    });

  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Unable to fetch location');
  } finally {
    setLoading(false);
  }
};



  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialIcons
            name="location-on"
            size={48}
            color="#22C55E"
          />
        </View>
        <Text style={styles.title}>Enable Location Services</Text>
        <Text style={styles.subtitle}>
          We need your location to show nearby stores and deliver to your doorstep quickly.
        </Text>

        <View style={styles.benefitBox}>
          <View style={styles.benefitRow}>
            <MaterialIcons name="check-circle" size={20} color="#22C55E" />
            <Text style={styles.benefitText}>Find nearby stores</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialIcons name="check-circle" size={20} color="#22C55E" />
            <Text style={styles.benefitText}>Fast delivery tracking</Text>
          </View>
          <View style={styles.benefitRow}>
            <MaterialIcons name="check-circle" size={20} color="#22C55E" />
            <Text style={styles.benefitText}>Better delivery estimates</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={getLocationAndAddress}
        >
          <Text style={styles.primaryText}>Allow Location Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleAllow}
        >
          <Text style={styles.secondaryText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

};


export default LocationPermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  benefitBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
});
