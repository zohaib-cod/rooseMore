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
    <main className="about-page" style={{ paddingTop: '100px', paddingBottom: '5rem', background: '#faf9f8', minHeight: '85vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
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
            About Roose More
          </span>
          <h1 className="hero-title" style={{ color: '#1a1a1a', textShadow: 'none', fontSize: '3rem', marginBottom: '1rem' }}>
            Our Story & Craft
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
            Transforming ordinary moments into extraordinary memories through the art of floral design and luxury event styling.
          </p>
        </motion.div>

        {/* Main Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column: Image with Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
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
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'white', padding: '1.25rem 1.5rem', borderRadius: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #f7cac9' }}
            >
              <div style={{ background: '#f7cac9', padding: '0.8rem', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star fill="white" size={22} />
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '1.15rem', margin: 0, color: '#1a1a1a' }}>Zohaib</p>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Founder & Lead Designer</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Story Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', color: '#1a1a1a' }}>
              {aboutData?.title ? aboutData.title : "Passion for Perfection."}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              {aboutData?.description || "Welcome to Roose More Floral & Events! Founded by Zohaib, our company was built on a simple yet profound belief: every milestone deserves to be celebrated in a breathtaking setting."}
            </p>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '2.5rem' }}>
              Based in the heart of Lahore at {aboutData?.address || "Chungi Amar Sidhu, Lahore"}, we specialize in high-end floral artistry and bespoke event setups. From intimate room decorations and romantic car adornments to grand wedding stages, bridal jewel sets (Zewar Sett), and baby showers, Zohaib and our dedicated team pour their hearts into every petal. We don't just decorate spaces; we craft experiences that you and your guests will cherish forever.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Heart color="#d17875" size={26} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>Crafted with Love</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Award color="#d17875" size={26} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>Premium Quality</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/products" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                View Our Catalog <ArrowRight size={18} />
              </Link>
              <Link href="/services" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.8rem 1.6rem',
                borderRadius: '30px',
                background: 'white',
                border: '1.5px solid #d17875',
                color: '#d17875',
                fontWeight: '600',
                transition: '0.3s'
              }}>
                Event Services <ArrowRight size={18} />
              </Link>
              <Link href="/contact" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.8rem 1.6rem',
                borderRadius: '30px',
                background: 'rgba(209, 120, 117, 0.1)',
                color: '#1a1a1a',
                fontWeight: '600',
                transition: '0.3s'
              }}>
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
