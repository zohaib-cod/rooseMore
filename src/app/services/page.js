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
    <main style={{ paddingTop: 'clamp(70px, 8vw, 90px)', paddingBottom: '3.5rem', minHeight: '80vh', background: '#faf9f8' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px', 
            color: '#d17875', 
            display: 'inline-block',
            marginBottom: '0.35rem'
          }}>
            Bespoke Event Styling
          </span>
          <h1 className="hero-title" style={{ color: '#1a1a1a', textShadow: 'none', marginBottom: '0.65rem' }}>
            Our Floral & Event Services
          </h1>
          <p style={{ color: '#666', fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            From intimate birthday gatherings to grand wedding stages, we bring your vision to life with fresh flowers, premium blooms, and creative styling.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888', fontSize: '0.95rem' }}>
            Loading Services...
          </div>
        ) : (
          <div className="services-grid" style={{ marginBottom: '2.5rem' }}>
            {services.filter(s => s.isActive !== false).map((service, index) => {
              const Icon = iconMap[(service.icon || '').toLowerCase()] || Sparkles;

              return (
                <motion.div
                  key={service._id || index}
                  className="glass-card service-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  {/* Icon Circle */}
                  <div className="service-icon">
                    <Icon size={20} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    marginBottom: '0.4rem',
                    color: '#1a1a1a'
                  }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '0.85rem',
                    lineHeight: '1.55',
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
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
            border: '1.5px solid #f7cac9',
            borderRadius: '18px',
            padding: '2.25rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(247, 202, 201, 0.2)'
          }}
        >
          <Sparkles size={28} color="#d17875" style={{ margin: '0 auto 0.75rem auto' }} />
          <h2 style={{
            fontSize: 'clamp(1.35rem, 2.5vw, 1.8rem)',
            fontFamily: "'Playfair Display', serif",
            color: '#1a1a1a',
            marginBottom: '0.65rem'
          }}>
            Planning a Custom Event in Lahore?
          </h2>
          <p style={{
            maxWidth: '560px',
            margin: '0 auto 1.5rem auto',
            color: '#666',
            fontSize: '0.92rem',
            lineHeight: '1.7'
          }}>
            Every event is unique. Our floral artists work closely with you to design custom backdrops, personalized bouquets, car ribbons, and complete venue styling matching your aesthetic.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              className="cta-button"
            >
              Custom Quote <ArrowRight size={13} />
            </Link>
            <Link
              href="/products"
              className="cta-button-outline"
            >
              Browse Products <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
