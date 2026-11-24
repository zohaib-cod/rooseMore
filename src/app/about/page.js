"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Heart, Award, Sparkles, MapPin, Phone, MessageSquare } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch(`${API_BASE_URL}/about`);
        const json = await res.json();
        if (json.success && json.data) {
          setAboutData(json.data);
        }
      } catch (err) {
        console.error("Failed to load about data", err);
      }
    }
    loadAbout();
  }, []);

  return (
    <main className="about-page" style={{ paddingTop: 'clamp(70px, 8vw, 90px)', paddingBottom: '3.5rem', background: '#faf9f8', minHeight: '80vh' }}>
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
            About Roose More
          </span>
          <h1 className="hero-title" style={{ color: '#1a1a1a', textShadow: 'none', marginBottom: '0.65rem' }}>
            Our Story & Craft
          </h1>
          <p style={{ color: '#666', fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            Transforming ordinary moments into extraordinary memories through the art of floral design and luxury event styling.
          </p>
        </motion.div>

        {/* Main Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 'clamp(2rem, 4vw, 3rem)', alignItems: 'center' }}>
          
          {/* Left Column: Image with Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ position: 'relative', maxWidth: '360px', margin: '0 auto', width: '100%' }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0,0,0,0.08)' }}>
              <Image 
                src="/images/zohaib.jpg" 
                alt="Zohaib - Founder of Roose More" 
                fill 
                style={{ objectFit: 'cover' }} 
                priority
              />
            </div>
            
            {/* Decorative Floating Element */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'white', padding: '0.65rem 0.95rem', borderRadius: '12px', boxShadow: '0 4px 18px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid #f7cac9' }}
            >
              <div style={{ background: '#f7cac9', padding: '0.45rem', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star fill="white" size={15} />
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', margin: 0, color: '#1a1a1a' }}>Zohaib</p>
                <p style={{ color: '#888', fontSize: '0.7rem', margin: 0 }}>Founder & Designer</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Story Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontFamily: "'Playfair Display', serif", marginBottom: '1rem', color: '#1a1a1a' }}>
              {aboutData?.title ? aboutData.title : "Passion for Perfection."}
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: '1.75', marginBottom: '1.15rem' }}>
              {aboutData?.description || "Welcome to Roose More Floral & Events! Founded by Zohaib, our company was built on a simple yet profound belief: every milestone deserves to be celebrated in a breathtaking setting."}
            </p>
            <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: '1.75', marginBottom: '1.75rem' }}>
              Based in the heart of Lahore at {aboutData?.address || "Chungi Amar Sidhu, Lahore"}, we specialize in high-end floral artistry and bespoke event setups. From intimate room decorations and romantic car adornments to grand wedding stages, bridal jewel sets (Zewar Sett), and baby showers, Zohaib and our dedicated team pour their hearts into every petal. We don't just decorate spaces; we craft experiences that you and your guests will cherish forever.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Heart color="#d17875" size={20} />
                <span style={{ fontWeight: '600', color: '#333', fontSize: '0.88rem' }}>Crafted with Love</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award color="#d17875" size={20} />
                <span style={{ fontWeight: '600', color: '#333', fontSize: '0.88rem' }}>Premium Quality</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Link href="/products" className="cta-button">
                Catalog <ArrowRight size={13} />
              </Link>
              <Link href="/services" className="cta-button-outline">
                Services <ArrowRight size={13} />
              </Link>
              <Link href="/contact" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem',
                padding: '0.42rem 1.1rem',
                borderRadius: '20px',
                background: 'rgba(209, 120, 117, 0.08)',
                color: '#1a1a1a',
                fontWeight: '600',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                transition: '0.2s'
              }}>
                Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
