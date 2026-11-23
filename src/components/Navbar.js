"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config/api';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const { cart, setIsCartOpen } = useCart();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchNavSections() {
      try {
        const res = await fetch(`${API_BASE_URL}/sections`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setSections(data.data);
        }
      } catch (err) {
        console.error("Navbar failed to fetch sections", err);
      }
    }
    fetchNavSections();
  }, []);

  // ONLY show sections where showOnHome === true
  // If the user turned off a section in Admin, it is completely hidden from Navbar!
  const navCategories = sections
    .filter(s => s.showOnHome === true && s.showInNav !== false)
    .map(s => ({ name: s.name, slug: s.slug }));

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="logo">
        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
          <img src="/images/logo.jpg" alt="Roose More Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="logo-text">Roose More</span>
      </Link>

      <div className="nav-links desktop-only">
        <Link href="/" style={{ color: pathname === '/' ? '#d17875' : undefined, fontWeight: pathname === '/' ? '700' : '500' }}>
          Home
        </Link>
        <div className="nav-dropdown-container">
          <Link href="/products" style={{ color: pathname?.startsWith('/products') ? '#d17875' : undefined, fontWeight: pathname?.startsWith('/products') ? '700' : '500' }}>
            Products
          </Link>
          <div className="nav-dropdown">
            <Link href="/products" style={{ fontWeight: pathname === '/products' ? 'bold' : 'normal' }}>
              All Products
            </Link>
            {navCategories.map(cat => (
              <Link 
                key={cat.slug} 
                href={`/products/${cat.slug}`}
                style={{ fontWeight: pathname === `/products/${cat.slug}` ? 'bold' : 'normal' }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/services" style={{ color: pathname === '/services' ? '#d17875' : undefined, fontWeight: pathname === '/services' ? '700' : '500' }}>
          Services
        </Link>
        <Link href="/about" style={{ color: pathname === '/about' ? '#d17875' : undefined, fontWeight: pathname === '/about' ? '700' : '500' }}>
          About Us
        </Link>
        <Link href="/contact" style={{ color: pathname === '/contact' ? '#d17875' : undefined, fontWeight: pathname === '/contact' ? '700' : '500' }}>
          Contact Us
        </Link>
      </div>

      <div className="nav-actions">
        <a href="https://wa.me/923034836076" target="_blank" rel="noreferrer" className="icon-btn">
          <Phone />
        </a>
        <button onClick={() => setIsCartOpen(true)} className="icon-btn cart-btn">
          <ShoppingCart />
          {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
        </button>
        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ color: pathname === '/' ? '#d17875' : undefined, fontWeight: pathname === '/' ? '700' : 'normal' }}>
            Home
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{ color: pathname === '/products' ? '#d17875' : undefined, fontWeight: pathname === '/products' ? '700' : 'normal' }}>
            Products
          </Link>
          {navCategories.map(cat => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="mobile-category-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: pathname === `/products/${cat.slug}` ? '#d17875' : undefined, fontWeight: pathname === `/products/${cat.slug}` ? 'bold' : 'normal' }}
            >
              - {cat.name}
            </Link>
          ))}
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} style={{ color: pathname === '/services' ? '#d17875' : undefined, fontWeight: pathname === '/services' ? '700' : 'normal' }}>
            Services
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: pathname === '/about' ? '#d17875' : undefined, fontWeight: pathname === '/about' ? '700' : 'normal' }}>
            About Us
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: pathname === '/contact' ? '#d17875' : undefined, fontWeight: pathname === '/contact' ? '700' : 'normal' }}>
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
