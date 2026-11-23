"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('roose_more_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart from storage", err);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('roose_more_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const prodId = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find(item => (item._id || item.id) === prodId);
      if (existing) {
        return prev.map(item => (item._id || item.id) === prodId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, id: prodId, _id: prodId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart((prev) => prev.map(item => {
      if ((item._id || item.id) === productId) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
