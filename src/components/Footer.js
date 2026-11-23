"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function Footer() {
  const pathname = usePathname();
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    async function loadFooter() {
      try {
        const res = await fetch(`${API_BASE_URL}/footer`);
        const json = await res.json();
        if (json.success && json.data) {
          setFooterData(json.data);
        }
      } catch (err) {
        console.error('Failed to load footer', err);
      }
    }
    loadFooter();
  }, []);

  // Do not render footer on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  if (!footerData || footerData.isActive === false) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const whatsappClean = (footerData.whatsapp || footerData.phone || '').replace(/[^0-9]/g, '');
  const facebookUrl = footerData.facebook
    ? (footerData.facebook.startsWith('http') ? footerData.facebook : `https://${footerData.facebook}`)
    : '';
  const instagramUrl = footerData.instagram
    ? (footerData.instagram.startsWith('http') ? footerData.instagram : `https://${footerData.instagram}`)
    : '';

  return (
    <footer className="footer">
      {/* Brand Title with Gradient */}
      <h3 style={{
        marginBottom: '0.5rem',
        fontSize: '1.6rem',
        fontFamily: "'Playfair Display', serif",
        background: 'linear-gradient(to right, #f7cac9, #b5e7a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
      }}>
        {footerData.brandName || 'Roose More Floral & Events'}
      </h3>

      {/* Tagline */}
      {footerData.tagline && (
        <p style={{ opacity: 0.85, fontSize: '0.95rem', marginBottom: '1rem', color: '#ccc' }}>
          {footerData.tagline}
        </p>
      )}

      {/* Quick Nav Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.75rem',
        flexWrap: 'wrap',
        margin: '0.75rem 0 1.25rem 0',
        fontSize: '0.95rem',
        fontWeight: '500'
      }}>
        <Link href="/" style={{ color: pathname === '/' ? '#f7cac9' : '#e0e0e0', textDecoration: 'none', transition: '0.2s' }}>
          Home
        </Link>
        <Link href="/products" style={{ color: pathname?.startsWith('/products') ? '#f7cac9' : '#e0e0e0', textDecoration: 'none', transition: '0.2s' }}>
          Products
        </Link>
        <Link href="/services" style={{ color: pathname === '/services' ? '#f7cac9' : '#e0e0e0', textDecoration: 'none', transition: '0.2s' }}>
          Services
        </Link>
        <Link href="/about" style={{ color: pathname === '/about' ? '#f7cac9' : '#e0e0e0', textDecoration: 'none', transition: '0.2s' }}>
          About Us
        </Link>
        <Link href="/contact" style={{ color: pathname === '/contact' ? '#f7cac9' : '#e0e0e0', textDecoration: 'none', transition: '0.2s' }}>
          Contact Us
        </Link>
      </div>

      {/* Contact & Social Links Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
        margin: '1.25rem 0',
        fontSize: '0.9rem'
      }}>
        {/* Phone / WhatsApp */}
        {footerData.phone && (
          <a
            href={`https://wa.me/${whatsappClean}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#f0f0f0',
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.06)',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: '0.2s'
            }}
          >
            <Phone size={15} color="#25D366" />
            <span>{footerData.phone}</span>
          </a>
        )}

        {/* Address */}
        {footerData.address && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#ddd',
              background: 'rgba(255,255,255,0.06)',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <MapPin size={15} color="#E1306C" />
            <span>{footerData.address}</span>
          </span>
        )}

        {/* Facebook Link */}
        {facebookUrl && (
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#ffffff',
              textDecoration: 'none',
              background: 'rgba(24, 119, 242, 0.25)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: '1px solid rgba(24, 119, 242, 0.5)',
              fontWeight: '500',
              transition: '0.2s'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>
        )}

        {/* Instagram Link */}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#ffffff',
              textDecoration: 'none',
              background: 'rgba(225, 48, 108, 0.25)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: '1px solid rgba(225, 48, 108, 0.5)',
              fontWeight: '500',
              transition: '0.2s'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#E1306C">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </a>
        )}
      </div>

      {/* Subtle Divider */}
      <div style={{
        height: '1px',
        background: 'rgba(255,255,255,0.12)',
        maxWidth: '420px',
        margin: '1.25rem auto'
      }} />

      {/* Copyright Notice */}
      <p style={{ opacity: 0.7, fontSize: '0.88rem', margin: 0, color: '#bbb' }}>
        {footerData.showYear !== false ? `© ${currentYear} ` : ''}
        {footerData.copyrightText || 'Roose More. All rights reserved.'}
      </p>
    </footer>
  );
}
