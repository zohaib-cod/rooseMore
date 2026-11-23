"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, PackageOpen, ArrowLeft, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { products as defaultProducts } from '../data/products';
import { API_BASE_URL } from '../config/api';

export default function ProductsView({ activeCategoryParam }) {
  const { addToCart } = useCart();
  const [localProducts, setLocalProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, secRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/sections`)
        ]);
        const prodData = await prodRes.json();
        const secData = await secRes.json();

        if (prodData.success && Array.isArray(prodData.data)) {
          setLocalProducts(prodData.data);
        }

        if (secData.success && Array.isArray(secData.data)) {
          setSections(secData.data);
        }
      } catch (err) {
        console.error('Failed to fetch data for view', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ONLY include active / enabled sections (showOnHome === true)
  // Any section that the user turned OFF in Admin is completely excluded!
  const visibleSections = sections.filter(s => s.showOnHome === true && s.isActive !== false);
  const activeSectionNames = new Set(visibleSections.map(s => s.name.toLowerCase()));

  // Check if current requested route/slug belongs to a disabled section
  const currentSection = sections.find(s => s.slug === activeCategoryParam || s.name.toLowerCase() === activeCategoryParam?.toLowerCase());
  const isSectionDisabled = currentSection && (currentSection.showOnHome === false || currentSection.isActive === false);

  // Determine active category title
  let activeCategory = 'All';
  if (activeCategoryParam && activeCategoryParam !== 'all') {
    if (currentSection) {
      activeCategory = currentSection.name;
    } else {
      activeCategory = activeCategoryParam;
    }
  }

  // Filter products:
  // 1. If currently viewing a disabled section, show NO products
  // 2. If viewing 'All', only show products that belong to an active/visible section
  // 3. If viewing a specific active section, show only that section's products
  let filteredProducts = [];
  if (!isSectionDisabled) {
    if (activeCategory === 'All') {
      filteredProducts = localProducts.filter(p => !p.category || activeSectionNames.has(p.category.toLowerCase()));
    } else {
      filteredProducts = localProducts.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }
  }

  return (
    <main className="products-page">
      <div className="page-header">
        <h1>{activeCategory === 'All' ? 'Our Products & Services' : activeCategory}</h1>
        <p>
          {currentSection?.description || 'Premium floral arrangements and decor, ready to order.'}
        </p>
      </div>

      {/* Category Tabs: ONLY display active sections! Disabled sections are completely removed */}
      <div className="category-tabs">
        <Link 
          href="/products" 
          className={`tab-btn ${activeCategory === 'All' ? 'active' : ''}`}
        >
          All
        </Link>
        {visibleSections.map(sec => (
          <Link 
            key={sec.slug} 
            href={`/products/${sec.slug}`}
            className={`tab-btn ${activeCategory.toLowerCase() === sec.name.toLowerCase() ? 'active' : ''}`}
          >
            {sec.name}
          </Link>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
          Loading products...
        </div>
      ) : isSectionDisabled ? (
        /* If section was turned OFF by admin */
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '15px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <EyeOff size={60} color="#c62828" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#c62828' }}>Section Disabled</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            "{activeCategory}" is currently turned off in the Admin Panel and hidden from the store.
          </p>
          <Link href="/products" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            <ArrowLeft size={18} /> View Active Products
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '15px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <PackageOpen size={60} color="#d17875" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products in "{activeCategory}" yet</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            New items uploaded to this section from the Admin Panel will appear here.
          </p>
          <Link href="/products" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            <ArrowLeft size={18} /> View All Products
          </Link>
        </div>
      ) : (
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
                      title="Add to Cart"
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
      )}
    </main>
  );
}
