"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Phone, MapPin, Flower2, Gift, Sparkles, Heart, Crown, Home as HomeIcon, 
  ArrowRight, ShoppingCart, PartyPopper, Calendar, Star, Camera, Smile, Cake, Sun, Gem, Palette,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config/api';

const iconMap = {
  flower2: Flower2,
  gift: Gift,
  heart: Heart,
  sparkles: Sparkles,
  crown: Crown,
  home: HomeIcon,
  partypopper: PartyPopper,
  calendar: Calendar,
  star: Star,
  camera: Camera,
  smile: Smile,
  cake: Cake,
  sun: Sun,
  gem: Gem,
  palette: Palette
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { addToCart } = useCart();
  const [localProducts, setLocalProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [isSectionsLoaded, setIsSectionsLoaded] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [showcaseData, setShowcaseData] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, secRes, heroRes, showcaseRes, servRes, aboutRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`).catch(() => null),
          fetch(`${API_BASE_URL}/sections`).catch(() => null),
          fetch(`${API_BASE_URL}/hero`).catch(() => null),
          fetch(`${API_BASE_URL}/showcase`).catch(() => null),
          fetch(`${API_BASE_URL}/services`).catch(() => null),
          fetch(`${API_BASE_URL}/about`).catch(() => null)
        ]);

        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
            setLocalProducts(prodData.data);
          }
        }
        if (secRes && secRes.ok) {
          const secData = await secRes.json();
          if (secData.success && Array.isArray(secData.data)) {
            setSections(secData.data);
            setIsSectionsLoaded(true);
          }
        }
        if (heroRes && heroRes.ok) {
          const heroJson = await heroRes.json();
          if (heroJson.success && heroJson.data) {
            setHeroData(heroJson.data);
          }
        }
        if (showcaseRes && showcaseRes.ok) {
          const showcaseJson = await showcaseRes.json();
          if (showcaseJson.success && showcaseJson.data) {
            setShowcaseData(showcaseJson.data);
          }
        }
        if (servRes && servRes.ok) {
          const servJson = await servRes.json();
          if (servJson.success && Array.isArray(servJson.data)) {
            setServicesList(servJson.data);
          }
        }
        if (aboutRes && aboutRes.ok) {
          const aboutJson = await aboutRes.json();
          if (aboutJson.success && aboutJson.data) {
            setAboutData(aboutJson.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data for landing page', err);
      }
    }
    loadHomeData();
  }, []);

  const activeSectionNames = new Set(sections.filter(s => s.showOnHome === true && s.isActive !== false).map(s => s.name.toLowerCase()));
  const activeProducts = localProducts.filter(p => !p.category || activeSectionNames.has(p.category.toLowerCase()));
  const featuredProduct = activeProducts[0] || localProducts[0] || null;

  const showcaseProduct = showcaseData ? {
    name: showcaseData.productName || showcaseData.productId?.name || (featuredProduct ? featuredProduct.name : ''),
    price: (showcaseData.productPrice !== undefined && showcaseData.productPrice !== 0 && showcaseData.productPrice !== null)
      ? showcaseData.productPrice
      : (showcaseData.productId?.price || (featuredProduct ? featuredProduct.price : 0)),
    image: showcaseData.image || showcaseData.productId?.image || (featuredProduct ? featuredProduct.image : "/images/bg.jpg")
  } : null;

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <Image 
            src={heroData?.backgroundImage || "/images/bg.jpg"} 
            alt={heroData?.title || "Hero Background"} 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center' }} 
            priority 
            unoptimized={heroData?.backgroundImage?.startsWith('http')}
          />
        </div>
        <div className="hero-overlay"></div>
        {heroData && (
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">{heroData.title}</h1>
            <p className="hero-subtitle">{heroData.subtitle}</p>
            {heroData.buttonText && (
              <Link href={heroData.buttonLink || "/products"} className="cta-button">
                {heroData.buttonText} <ArrowRight size={14} />
              </Link>
            )}
          </motion.div>
        )}
      </section>

      {/* Showcase Section: Clean Luxury Feature Card with Falling Image Animation */}
      {showcaseData && (
        <section className="showcase-section">
          <div className="showcase-container">
            {/* The Featured Product Card */}
            {showcaseProduct && (
              <motion.div 
                className="showcase-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="showcase-image-wrapper">
                  <motion.div
                    className="falling-image-container"
                    initial={{ y: -90, opacity: 0, scale: 1.15 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={{ type: "spring", stiffness: 75, damping: 15, duration: 0.8 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <img 
                      src={showcaseProduct.image || "/images/bg.jpg"} 
                      alt={showcaseProduct.name} 
                      className="showcase-img"
                    />
                  </motion.div>
                </div>
                <div className="showcase-card-info">
                  <h3>{showcaseProduct.name}</h3>
                  {showcaseProduct.price > 0 && <p>Rs. {showcaseProduct.price}</p>}
                </div>
              </motion.div>
            )}

            {/* The narrative text alongside it */}
            <motion.div 
              className="showcase-text"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="section-title" style={{ textAlign: 'left', color: '#1a1a1a' }}>
                {showcaseData.title}
              </h2>
              <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                {showcaseData.description}
              </p>
              {showcaseData.buttonText && (
                <Link href={showcaseData.buttonLink || "/products"} className="cta-button" style={{ display: 'inline-flex' }}>
                  {showcaseData.buttonText} <ArrowRight size={13} />
                </Link>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Wise Products Section */}
      <section className="services-section" style={{ background: '#fff', position: 'relative', zIndex: 10 }}>
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Explore our curated range of floral arrangements and bespoke event decor.
          </motion.p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
          {sections.filter(s => s.showOnHome === true && s.isActive !== false).map((section) => {
            const categoryProducts = localProducts.filter(p => p.category?.toLowerCase() === section.name.toLowerCase());
            if (categoryProducts.length === 0) return null;

            return (
              <div key={section.slug || section._id} style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f7cac9', paddingBottom: '0.4rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)', fontFamily: "'Playfair Display', serif", color: '#1a1a1a' }}>{section.name}</h3>
                  <Link href={`/products/${section.slug}`} style={{ color: '#d17875', fontWeight: '600', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    View All <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="products-grid">
                  {categoryProducts.slice(0, 4).map((product, index) => {
                    const discountPercent = product.discount || ((index % 2 === 0) ? 30 : 50);
                    const originalPrice = product.originalPrice || Math.round(product.price / (1 - discountPercent / 100));
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        key={product._id || product.id} 
                        className="product-card"
                      >
                        <div className="product-image-container">
                          <span className="product-badge-save">SAVE {discountPercent}%</span>
                          <img src={product.image || '/images/bg.jpg'} alt={product.name} />
                          <button 
                            type="button" 
                            className="product-quick-add-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            title="Add to Cart"
                          >
                            <Plus size={18} strokeWidth={2.4} />
                          </button>
                        </div>
                        <div className="product-info">
                          <h3 className="product-title">{product.name}</h3>
                          <div className="product-prices-wrapper">
                            <span className="product-price-current">RS.{Number(product.price).toLocaleString()}</span>
                            <span className="product-price-original">RS.{Number(originalPrice).toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Section */}
      {servicesList.length > 0 && (
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

          <div className="services-grid">
            {servicesList.filter(s => s.isActive !== false).map((service, index) => {
              const Icon = iconMap[(service.icon || '').toLowerCase()] || Sparkles;
              return (
                <motion.div
                  key={service._id || index}
                  className="glass-card service-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="service-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Link href="/services" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              View All Services <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      )}

      {/* About/Contact Section */}
      {aboutData && aboutData.isActive !== false && (
        <section id="contact" className="info-section">
          <div className="info-container">
            <motion.div 
              className="info-image"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '0px', overflow: 'hidden' }}>
                <Image 
                  src={aboutData.image || "/images/bike.jpg"} 
                  alt={aboutData.title || "Decoration Info"} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  unoptimized={aboutData.image?.startsWith('http')}
                />
              </div>
            </motion.div>

            <motion.div 
              className="info-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="section-title" style={{ textAlign: 'left' }}>{aboutData.title}</h2>
              <p style={{ marginBottom: '1.25rem', fontSize: '0.92rem', color: '#666', lineHeight: '1.7' }}>
                {aboutData.description}
              </p>

              <div style={{ background: 'white', padding: '1.15rem', borderRadius: '0px', boxShadow: '0 4px 18px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', width: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ marginBottom: '0.85rem', fontSize: '1.15rem', fontFamily: "'Playfair Display', serif" }}>{aboutData.boxTitle || "Get in Touch"}</h3>
                
                {aboutData.phone && (
                  <div className="contact-item">
                    <Phone className="contact-icon" size={16} />
                    <a 
                      href={`https://wa.me/${(aboutData.whatsapp || aboutData.phone || '').replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ fontWeight: '600', fontSize: '0.92rem' }}
                    >
                      {aboutData.phone} (WhatsApp)
                    </a>
                  </div>
                )}
                
                {aboutData.address && (
                  <div className="contact-item">
                    <MapPin className="contact-icon" size={16} style={{ color: '#E1306C' }} />
                    <span style={{ fontSize: '0.88rem' }}>{aboutData.address}</span>
                  </div>
                )}

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <Link href="/contact" className="cta-button">
                    Book an Event <ArrowRight size={13} />
                  </Link>
                  <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1rem', fontSize: '0.82rem', color: '#1a1a1a', fontWeight: '600' }}>
                    Our Story <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
