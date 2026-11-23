"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Flower2, Gift, Sparkles, Heart, Crown, Home as HomeIcon, ArrowRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { products as defaultProducts, categories } from '../data/products';
import { API_BASE_URL } from '../config/api';

const services = [
  { title: "Original & Artificial Flowers", icon: Flower2, desc: "Breathtaking arrangements using fresh and premium artificial blooms." },
  { title: "Birthday & Party Events", icon: Gift, desc: "Make your special day unforgettable with our custom event styling." },
  { title: "Room Decor", icon: Heart, desc: "Romantic and aesthetic room transformations for any occasion." },
  { title: "Bouquets", icon: Sparkles, desc: "Hand-tied, bespoke bouquets crafted with love and care." },
  { title: "Car Decor", icon: Crown, desc: "Elegant floral adornments for wedding and event vehicles." },
  { title: "Zewar Sett", icon: Sparkles, desc: "Beautiful floral jewelry sets for Mehndi and Mayun." },
  { title: "Baby Shower", icon: Heart, desc: "Soft, beautiful setups to welcome your little one." },
  { title: "House Decor", icon: HomeIcon, desc: "Complete home floral transformations for festive events." },
];

export default function LandingPage() {
  const containerRef = useRef(null);
  const { addToCart } = useCart();
  const [localProducts, setLocalProducts] = useState(defaultProducts);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, secRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/sections`)
        ]);
        const prodData = await prodRes.json();
        const secData = await secRes.json();

        if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          setLocalProducts(prodData.data);
        }
        if (secData.success && Array.isArray(secData.data) && secData.data.length > 0) {
          setSections(secData.data);
        }
      } catch (err) {
        console.error('Failed to fetch data for landing page', err);
      }
    }
    loadHomeData();
  }, []);

  const featuredProduct = localProducts[0] || defaultProducts[0];
  
  // Advanced Scroll Animation Setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Scroll phase 1: Flower falls down into the card (0 to 0.4)
  const flowerY = useTransform(scrollYProgress, [0, 0.4], ["-100vh", "0vh"]);
  const flowerRotate = useTransform(scrollYProgress, [0, 0.4], [-45, 0]);
  const flowerScale = useTransform(scrollYProgress, [0, 0.4], [1.5, 1]);

  // Scroll phase 2: Card reveals and shrinks slightly (0.4 to 0.6)
  const cardOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.4, 0.6], [1.1, 1]);

  // Scroll phase 3: Card moves left, text appears right (0.6 to 1.0)
  const containerX = useTransform(scrollYProgress, [0.6, 0.9], ["0%", "-25%"]);
  const textOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const textX = useTransform(scrollYProgress, [0.7, 0.9], [50, 0]);

  // Handle Mobile Responsiveness for the animation
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <Image src="/images/bg.jpg" alt="Hero Background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        </div>
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="hero-title">Elevate Your Moments</h1>
          <p className="hero-subtitle">Premium Floral & Event Decoration in Lahore</p>
          <Link href="/products" className="cta-button">
            Shop Products <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Advanced Scroll Animation Section */}
      <section ref={containerRef} className="scroll-animation-wrapper">
        <div className="sticky-container">
          <div className="sticky-content">
            {/* The Animated Product Composition */}
            <motion.div style={{ x: isMobile ? 0 : containerX }} className="animated-product-card">
              <motion.div style={{ opacity: cardOpacity, scale: cardScale }} className="card-glass-body">
                {/* Product Info */}
                <div className="card-text-bottom">
                  <h3>{featuredProduct.name}</h3>
                  <p>Rs. {featuredProduct.price}</p>
                </div>
              </motion.div>
              
              {/* The falling flower image that lands EXACTLY in the card */}
              <motion.div 
                className="falling-flower-img"
                style={{ y: flowerY, rotate: flowerRotate, scale: flowerScale }}
              >
                <img 
                  src={featuredProduct.image || "/images/bg.jpg"} 
                  alt={featuredProduct.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  className="rounded-flower"
                />
              </motion.div>
            </motion.div>

            {/* The text that reveals alongside it */}
            {!isMobile && (
              <motion.div 
                className="animated-text-reveal"
                style={{ x: textX, color: '#1a1a1a', opacity: 1 }}
              >
                <h2 className="section-title" style={{ color: '#1a1a1a', textShadow: 'none' }}>Perfection in Every Petal.</h2>
                <p style={{ color: '#333', fontWeight: 600, textShadow: 'none' }}>We source the finest blooms to create masterpieces that leave a lasting impression. Every bouquet is crafted with love and attention to detail.</p>
                <Link href="/products" className="cta-button" style={{ marginTop: '2rem', display: 'inline-block' }}>
                  Browse All Products
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Category Wise Products Section */}
      <section className="services-section" style={{ background: '#fff', marginTop: '-30vh', paddingTop: '10vh', position: 'relative', zIndex: 10 }}>
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore our diverse range of premium floral arrangements and event decor.
          </motion.p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {(sections.length > 0 
            ? sections.filter(s => s.showOnHome !== false)
            : categories.filter(c => c !== 'All').map(c => ({ name: c, slug: c.toLowerCase().replace(/ /g, '-') }))
          ).map((section) => {
            const categoryProducts = localProducts.filter(p => p.category?.toLowerCase() === section.name.toLowerCase());
            if (categoryProducts.length === 0) return null;

            return (
              <div key={section.slug || section._id} style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f7cac9', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", color: '#1a1a1a' }}>{section.name}</h3>
                  <Link href={`/products/${section.slug}`} style={{ color: '#d17875', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    View All <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="products-grid">
                  {categoryProducts.slice(0, 4).map((product, index) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      key={product._id || product.id} 
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
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{product.description}</p>
                        <div className="product-bottom">
                          <span className="product-price">Rs. {product.price}</span>
                          <button className="add-cart-btn" onClick={() => addToCart(product)}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Services
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            From intimate gatherings to grand celebrations, we bring your vision to life.
          </motion.p>
        </div>

        <div className="services-grid perspective-container">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                className="glass-card threed-card"
                initial={{ opacity: 0, rotateX: 20, y: 50 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
                style={{ padding: '2rem', textAlign: 'center' }}
              >
                <div className="service-icon" style={{ margin: '0 auto 1.5rem auto' }}>
                  <Icon size={30} />
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{service.title}</h3>
                <p style={{ color: '#555', fontSize: '0.95rem' }}>{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About/Contact Section */}
      <section id="contact" className="info-section">
        <div className="info-container">
          <motion.div 
            className="info-image"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '20px', overflow: 'hidden' }}>
              <Image src="/images/bike.jpg" alt="Decoration Info" fill style={{ objectFit: 'cover' }} />
            </div>
            {/* Floating decorative elements */}
            <motion.div 
              style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'white', padding: '15px', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Flower2 color="#f7cac9" size={40} />
            </motion.div>
          </motion.div>

          <motion.div 
            className="info-text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title" style={{ textAlign: 'left' }}>Let's Create Magic</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#555', lineHeight: '1.8' }}>
              At Roose More Floral & Events, we believe every occasion deserves to be beautiful. 
              Whether it's original flowers or stunning artificial setups, we pour our heart into making your event perfect.
            </p>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Get in Touch</h3>
              
              <div className="contact-item">
                <Phone className="contact-icon" />
                <a href="https://wa.me/923034836076" target="_blank" rel="noreferrer" style={{ fontWeight: '600' }}>
                  +92 303 4836076 (WhatsApp)
                </a>
              </div>
              
              <div className="contact-item">
                <MapPin className="contact-icon" style={{ color: '#E1306C' }} />
                <span>Chungi Amar Sidhu, Lahore</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', background: 'linear-gradient(to right, #f7cac9, #b5e7a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roose More Floral & Events</h3>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>© {new Date().getFullYear()} Roose More. All rights reserved.</p>
      </footer>
    </main>
  );
}
