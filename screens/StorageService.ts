// services/StorageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface OrderItem {
  id: number;
  name: string;
  weight: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  deliveryAddress: Address;
  deliverySlot: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'on_way' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveredAt?: string;
}

export interface AppData {
  profile?: UserProfile;
  addresses: Address[];
  pastOrders: Order[];
  lastUpdated: string;
}

const STORAGE_KEY = 'kaikariXpress_appData';

// Initialize default data
const defaultData: AppData = {
  addresses: [],
  pastOrders: [],
  lastUpdated: new Date().toISOString(),
};

class StorageService {
  // Get all app data
  static async getAllData(): Promise<AppData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { ...defaultData };
    } catch (error) {
      console.error('Error retrieving app data:', error);
      return { ...defaultData };
    }
  }

  // Save all app data
  static async saveAllData(data: AppData): Promise<void> {
    try {
      data.lastUpdated = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  }

  // Profile Methods
  static async saveProfile(profile: UserProfile): Promise<void> {
    const data = await this.getAllData();
    data.profile = profile;
    await this.saveAllData(data);
  }

  static async getProfile(): Promise<UserProfile | undefined> {
    const data = await this.getAllData();
    return data.profile;
  }

  // Address Methods
  static async addAddress(address: Address): Promise<void> {
    const data = await this.getAllData();
    address.id = `addr_${Date.now()}`;
    
    // If no addresses yet, make it default
    if (data.addresses.length === 0) {
      address.isDefault = true;
    }
    
    data.addresses.push(address);
    await this.saveAllData(data);
  }

  static async updateAddress(addressId: string, address: Partial<Address>): Promise<void> {
    const data = await this.getAllData();
    const index = data.addresses.findIndex(a => a.id === addressId);
    if (index !== -1) {
      data.addresses[index] = { ...data.addresses[index], ...address };
      await this.saveAllData(data);
    }
  }

  static async deleteAddress(addressId: string): Promise<void> {
    const data = await this.getAllData();
    data.addresses = data.addresses.filter(a => a.id !== addressId);
    
    // If we deleted the default, make the first one default
    if (data.addresses.length > 0 && !data.addresses.some(a => a.isDefault)) {
      data.addresses[0].isDefault = true;
    }
    
    await this.saveAllData(data);
  }

  static async getAddresses(): Promise<Address[]> {
    const data = await this.getAllData();
    return data.addresses;
  }

  static async getDefaultAddress(): Promise<Address | undefined> {
    const data = await this.getAllData();
    return data.addresses.find(a => a.isDefault);
  }

  static async setDefaultAddress(addressId: string): Promise<void> {
    const data = await this.getAllData();
    data.addresses.forEach(a => {
      a.isDefault = a.id === addressId;
    });
    await this.saveAllData(data);
  }

  // Order Methods
  static async addOrder(order: Order): Promise<void> {
    const data = await this.getAllData();
    order.id = `ord_${Date.now()}`;
    order.createdAt = new Date().toISOString();
    data.pastOrders.push(order);
    await this.saveAllData(data);
  }

  static async updateOrder(orderId: string, order: Partial<Order>): Promise<void> {
    const data = await this.getAllData();
    const index = data.pastOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      data.pastOrders[index] = { ...data.pastOrders[index], ...order };
      await this.saveAllData(data);
    }
  }

  static async getOrders(): Promise<Order[]> {
    const data = await this.getAllData();
    return data.pastOrders;
  }

  static async getOrderById(orderId: string): Promise<Order | undefined> {
    const data = await this.getAllData();
    return data.pastOrders.find(o => o.id === orderId);
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default StorageService;