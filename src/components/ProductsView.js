"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { products as defaultProducts, categories } from '../data/products';
import { API_BASE_URL } from '../config/api';

export default function ProductsView({ activeCategoryParam }) {
  const { addToCart } = useCart();
  const [localProducts, setLocalProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLocalProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products for view', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  
  // Format the URL param back to the original category string
  // e.g. "room-decor" -> "Room Decor", "zewar-sett" -> "Zewar Sett"
  const activeCategory = activeCategoryParam === 'all' 
    ? 'All' 
    : categories.find(c => c.toLowerCase().replace(/ /g, '-') === activeCategoryParam) || 'All';

  const filteredProducts = activeCategory === 'All' 
    ? localProducts 
    : localProducts.filter(p => p.category === activeCategory);

  return (
    <main className="products-page">
      <div className="page-header">
        <h1>Our Products & Services</h1>
        <p>Premium floral arrangements and decor, ready to order.</p>
      </div>

      <div className="category-tabs">
        {categories.map(cat => {
          const catSlug = cat === 'All' ? 'all' : cat.toLowerCase().replace(/ /g, '-');
          const href = cat === 'All' ? '/products' : `/products/${catSlug}`;
          
          return (
            <Link 
              key={cat} 
              href={href}
              className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      <motion.div layout className="products-grid">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => {
            const prodKey = product._id || product.id;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={prodKey} 
                className="product-card threed-card"
              >
                <div className="product-image-container">
                  <img src={product.image || '/images/bg.jpg'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    className="add-to-cart-quick"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-bottom">
                    <span className="product-price">Rs. {product.price}</span>
                    <button className="add-cart-btn" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
