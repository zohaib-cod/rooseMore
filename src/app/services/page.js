"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Flower2, Gift, Heart, Sparkles, Crown, Home as HomeIcon,
  PartyPopper, Calendar, Star, Camera, Smile, Cake, Sun, Gem, Palette,
  ArrowRight, Phone, MessageSquare, CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

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

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_BASE_URL}/services`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        }
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '5rem', minHeight: '80vh', background: '#faf9f8' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            color: '#d17875', 
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>
            Bespoke Event Styling
          </span>
          <h1 className="hero-title" style={{ color: '#1a1a1a', textShadow: 'none', fontSize: '3rem', marginBottom: '1rem' }}>
            Our Floral & Event Services
          </h1>
          <p style={{ color: '#666', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
            From intimate birthday gatherings to grand wedding stages, we bring your vision to life with fresh flowers, premium artificial blooms, and creative styling.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
            Loading Services...
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {services.filter(s => s.isActive !== false).map((service, index) => {
              const Icon = iconMap[(service.icon || '').toLowerCase()] || Sparkles;

              return (
                <motion.div
                  key={service._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2.5rem 2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Icon Circle */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    margin: '0 auto 1.5rem auto',
                    background: 'rgba(247, 202, 201, 0.4)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d17875'
                  }}>
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontFamily: "'Playfair Display', serif",
                    marginBottom: '0.85rem',
                    color: '#1a1a1a'
                  }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '0.95rem',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    {service.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Custom Event Callout Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
            border: '2px solid #f7cac9',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(247, 202, 201, 0.25)'
          }}
        >
          <Sparkles size={40} color="#d17875" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{
            fontSize: '2.2rem',
            fontFamily: "'Playfair Display', serif",
            color: '#1a1a1a',
            marginBottom: '1rem'
          }}>
            Planning a Custom Event in Lahore?
          </h2>
          <p style={{
            maxWidth: '650px',
            margin: '0 auto 2rem auto',
            color: '#555',
            fontSize: '1.05rem',
            lineHeight: '1.8'
          }}>
            Every event is unique. Our floral artists work closely with you to design custom backdrops, personalized bouquets, car ribbons, and complete venue styling matching your aesthetic.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              className="cta-button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Get a Custom Quote <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'white',
                color: '#333',
                padding: '0.85rem 1.8rem',
                borderRadius: '30px',
                border: '1px solid #ddd',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Browse Products
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
