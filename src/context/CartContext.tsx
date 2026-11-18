'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  shipping: number;
  freeShippingThreshold: number;
  total: number;
  totalCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING_COST = 10;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('glow_beauty_cart');
      const savedPromo = localStorage.getItem('glow_beauty_promo');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      if (savedPromo) {
        const { code, percent } = JSON.parse(savedPromo);
        setDiscountCode(code);
        setDiscountPercent(percent);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('glow_beauty_cart', JSON.stringify(items));
      if (discountCode) {
        localStorage.setItem('glow_beauty_promo', JSON.stringify({ code: discountCode, percent: discountPercent }));
      } else {
        localStorage.removeItem('glow_beauty_promo');
      }
    } catch (e) {
      console.error('Failed to persist cart to storage', e);
    }
  }, [items, discountCode, discountPercent, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode(null);
    setDiscountPercent(0);
    try {
      localStorage.removeItem('glow_beauty_cart');
      localStorage.removeItem('glow_beauty_promo');
    } catch (e) {}
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GLOW10') {
      setDiscountCode('GLOW10');
      setDiscountPercent(10);
      return { success: true, message: 'Промокод GLOW10 применен (-10%)' };
    }
    if (cleanCode === 'WELCOME15') {
      setDiscountCode('WELCOME15');
      setDiscountPercent(15);
      return { success: true, message: 'Промокод WELCOME15 применен (-15%)' };
    }
    return { success: false, message: 'Неверный или устаревший промокод' };
  };

  const removePromoCode = () => {
    setDiscountCode(null);
    setDiscountPercent(0);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        discountCode,
        applyPromoCode,
        removePromoCode,
        shipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        total,
        totalCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
