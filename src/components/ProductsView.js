"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, PackageOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { products as defaultProducts, categories as defaultCategories } from '../data/products';
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
          setLocalProducts(prodData.data.length > 0 ? prodData.data : defaultProducts);
        } else {
          setLocalProducts(defaultProducts);
        }

        if (secData.success && Array.isArray(secData.data) && secData.data.length > 0) {
          setSections(secData.data);
        }
      } catch (err) {
        console.error('Failed to fetch data for view', err);
        setLocalProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const allSections = sections.length > 0 
    ? sections 
    : defaultCategories.filter(c => c !== 'All').map(c => ({ name: c, slug: c.toLowerCase().replace(/ /g, '-') }));

  // Find active category
  let activeCategory = 'All';
  let activeSectionDetails = null;

  if (activeCategoryParam && activeCategoryParam !== 'all') {
    const matched = allSections.find(s => s.slug === activeCategoryParam || s.name.toLowerCase() === activeCategoryParam.toLowerCase());
    if (matched) {
      activeCategory = matched.name;
      activeSectionDetails = matched;
    } else {
      activeCategory = activeCategoryParam;
    }
  }

  const filteredProducts = activeCategory === 'All' 
    ? localProducts 
    : localProducts.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <main className="products-page">
      <div className="page-header">
        <h1>{activeCategory === 'All' ? 'Our Products & Services' : activeCategory}</h1>
        <p>
          {activeSectionDetails?.description || 'Premium floral arrangements and decor, ready to order.'}
        </p>
      </div>

      <div className="category-tabs">
        <Link 
          href="/products" 
          className={`tab-btn ${activeCategory === 'All' ? 'active' : ''}`}
        >
          All
        </Link>
        {allSections.map(sec => (
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
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '15px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <PackageOpen size={60} color="#d17875" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products in "{activeCategory}" yet</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            New items uploaded to this section from the Admin Panel will appear here in real-time.
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
