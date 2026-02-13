// constants.ts
import { Dimensions } from 'react-native';

export const PRIMARY_COLOR = '#22C55E'; // Your Green
export const SECONDARY_COLOR = '#Ecfdf5'; // Light Green background
export const TEXT_COLOR = '#1f2937';
export const GRAY_COLOR = '#6b7280';
export const BORDER_COLOR = '#e5e7eb';

export const { width, height } = Dimensions.get('window');

// Zepto-style Categories
export const CATEGORIES = [
  { id: 'veggies', name: 'Vegetables', icon: 'carrot', type: 'font-awesome-5' },
  { id: 'fruits', name: 'Fruits', icon: 'apple-alt', type: 'font-awesome-5' },
  { id: 'dairy', name: 'Dairy & Bread', icon: 'cheese', type: 'font-awesome-5' },
  { id: 'drinks', name: 'Cold Drinks', icon: 'glass-whiskey', type: 'font-awesome-5' },
  { id: 'snacks', name: 'Munchies', icon: 'cookie-bite', type: 'font-awesome-5' },
];

// Mock Products
export const PRODUCTS = [
  { id: 1, name: 'Fresh Tomato', weight: '500g', price: 18, oldPrice: 25, category: 'veggies', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' },
  { id: 2, name: 'Red Onion', weight: '1kg', price: 35, oldPrice: 50, category: 'veggies', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400' },
  { id: 3, name: 'Potato', weight: '1kg', price: 28, oldPrice: 35, category: 'veggies', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { id: 4, name: 'Amul Milk', weight: '500ml', price: 27, oldPrice: 27, category: 'dairy', image: 'https://images.unsplash.com/photo-1635436322965-482e383042ce?w=400' },
  { id: 5, name: 'Banana Robusta', weight: '6 pcs', price: 40, oldPrice: 55, category: 'fruits', image: 'https://images.unsplash.com/photo-1571771896328-7963057c1502?w=400' },
  { id: 6, name: 'Coca Cola', weight: '750ml', price: 45, oldPrice: 50, category: 'drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
  { id: 7, name: 'Lays Chips', weight: '50g', price: 20, oldPrice: 20, category: 'snacks', image: 'https://images.unsplash.com/photo-1566478949035-00c679a9e1f0?w=400' },
];