// screens/CartContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type CartItem = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  image: string;
  weight: string;
};

type Order = {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Active' | 'Completed';
};

type CartContextType = {
  cartItems: CartItem[];
  orders: Order[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, type: 'increase' | 'decrease') => void;
  placeOrder: (total: number) => Promise<string>;
  getItemCount: (id: number) => number;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const storedCart = await AsyncStorage.getItem('kaikari_cart');
      const storedOrders = await AsyncStorage.getItem('kaikari_orders');
      if (storedCart) setCartItems(JSON.parse(storedCart));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('kaikari_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    AsyncStorage.setItem('kaikari_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, type: 'increase' | 'decrease') => {
    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQty = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemCount = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const clearCart = () => setCartItems([]);

  const placeOrder = async (totalAmount: number): Promise<string> => {
    const newOrder: Order = {
      id: `#ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      items: [...cartItems],
      totalAmount,
      status: 'Active',
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setCartItems([]);
    return newOrder.id;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, orders, addToCart, removeFromCart, updateQuantity, placeOrder, getItemCount, cartCount, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};