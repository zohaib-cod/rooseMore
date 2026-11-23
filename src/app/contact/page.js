"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Flower2, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function ContactPage() {
  const [aboutData, setAboutData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: 'Bouquets',
    date: '',
    message: ''
  });

  useEffect(() => {
    async function loadContactInfo() {
      try {
        const res = await fetch(`${API_BASE_URL}/about`);
        const json = await res.json();
        if (json.success && json.data) {
          setAboutData(json.data);
        }
      } catch (err) {
        console.error('Failed to load contact info', err);
      }
    }
    loadContactInfo();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format a structured WhatsApp message
    const lines = [
      `*New Inquiry from Roose More Website*`,
      `*Name:* ${formData.name}`,
      `*Phone:* ${formData.phone}`,
      `*Service:* ${formData.serviceType}`,
      formData.date ? `*Event Date:* ${formData.date}` : '',
      formData.message ? `*Message:* ${formData.message}` : ''
    ].filter(Boolean).join('\n');

    const whatsappNum = (aboutData?.whatsapp || aboutData?.phone || '923034836076').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(lines)}`;

    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  const phoneNum = aboutData?.phone || '+92 303 4836076';
  const whatsappNum = (aboutData?.whatsapp || aboutData?.phone || '923034836076').replace(/[^0-9]/g, '');
  const storeAddress = aboutData?.address || 'Chungi Amar Sidhu, Lahore';

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
            Get In Touch
          </span>
          <h1 className="hero-title" style={{ color: '#1a1a1a', textShadow: 'none', fontSize: '3rem', marginBottom: '1rem' }}>
            Contact Roose More
          </h1>
          <p style={{ color: '#666', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
            Have questions about bouquet orders, wedding stage decor, or need a custom quote? We're just a message or call away.
          </p>
        </motion.div>

        {/* Split Content: Info & Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Direct Contact Card */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontFamily: "'Playfair Display', serif",
                marginBottom: '1rem',
                color: '#1a1a1a'
              }}>
                {aboutData?.boxTitle || "Let's Talk"}
              </h2>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                {aboutData?.description || "At Roose More Floral & Events, we believe every occasion deserves to be beautiful. Let's make your celebration unforgettable."}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Phone & WhatsApp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2e7d32',
                    flexShrink: 0
                  }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>Phone & WhatsApp</span>
                    <a
                      href={`https://wa.me/${whatsappNum}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a', textDecoration: 'none' }}
                    >
                      {phoneNum}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#fce4ec',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E1306C',
                    flexShrink: 0
                  }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>Studio Location</span>
                    <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                      {storeAddress}
                    </p>
                  </div>
                </div>

                {/* Timings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f57c00',
                    flexShrink: 0
                  }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>Store Timings</span>
                    <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                      Mon - Sun: 9:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action Button */}
              <div style={{ marginTop: '2.5rem' }}>
                <a
                  href={`https://wa.me/${whatsappNum}?text=Hi%20Roose%20More,%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    background: '#25D366',
                    color: 'white',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <Phone size={18} /> Chat Directly on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontFamily: "'Playfair Display', serif",
                marginBottom: '0.5rem',
                color: '#1a1a1a'
              }}>
                Send an Event Inquiry
              </h2>
              <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                Fill out the form below and we will get back to you with custom pricing and setup options.
              </p>

              {submitted && (
                <div style={{
                  background: '#e8f5e9',
                  border: '1px solid #c8e6c9',
                  color: '#2e7d32',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={20} />
                  <span>WhatsApp inquiry prepared! Opening chat now...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Your Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Ali Khan"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #ddd' }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    required
                    placeholder="e.g. 0300 1234567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #ddd' }}
                  />
                </div>

                {/* Service Type & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Service Needed
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #ddd', background: 'white' }}
                    >
                      <option value="Bouquets">Hand Bouquet</option>
                      <option value="Room Decor">Room Decor</option>
                      <option value="Car Decor">Wedding Car Decor</option>
                      <option value="Zewar Sett">Fresh Flower Zewar Sett</option>
                      <option value="Birthday Decor">Birthday / Party Decor</option>
                      <option value="Baby Shower">Baby Shower Setup</option>
                      <option value="Stage Decor">Wedding Stage / Backdrop</option>
                      <option value="Custom Order">Custom Requirements</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Event Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Event Details / Special Request
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your theme, preferred flowers, venue location or budget..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #ddd', resize: 'vertical' }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    background: '#d17875',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    boxShadow: '0 4px 15px rgba(209, 120, 117, 0.4)'
                  }}
                >
                  <Send size={18} /> Send Inquiry via WhatsApp
                </button>
              </form>
            </div>
          </motion.div>
        </div>

      </div>
    </main>
  );
}
