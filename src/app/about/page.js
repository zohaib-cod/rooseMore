"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Heart, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="about-page" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 className="hero-title" style={{ color: '#1a1a1a', textShadow: 'none', fontSize: '3rem' }}>Our Story</h1>
          <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Transforming ordinary moments into extraordinary memories through the art of floral design and event decoration.
          </p>
        </motion.div>

        {/* Main Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <Image 
                src="/images/zohaib.jpg" 
                alt="Zohaib - Founder of Roose More" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            
            {/* Decorative Element */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ background: '#f7cac9', padding: '0.8rem', borderRadius: '50%', color: 'white' }}>
                <Star fill="white" size={24} />
              </div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>Zohaib</p>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Founder & Lead Designer</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', color: '#1a1a1a' }}>
              Passion for Perfection.
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Welcome to <strong>Roose More Floral & Events</strong>! Founded by Zohaib, our company was built on a simple yet profound belief: every milestone deserves to be celebrated in a breathtaking setting.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '2.5rem' }}>
              Based in the heart of Lahore at Chungi Amar Sidhu, we specialize in high-end floral artistry and bespoke event setups. From intimate room decorations and romantic car adornments to grand wedding stages and baby showers, Zohaib and our dedicated team pour their hearts into every petal. We don't just decorate spaces; we craft experiences that you and your guests will cherish forever.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Heart color="#d17875" size={28} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>Crafted with Love</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Award color="#d17875" size={28} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>Premium Quality</span>
              </div>
            </div>

            <Link href="/products" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              View Our Work <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
