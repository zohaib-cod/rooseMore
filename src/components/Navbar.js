"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="logo">
        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
          <img src="/images/logo.jpg" alt="Roose More Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="logo-text">Roose More</span>
      </Link>

      <div className="nav-links desktop-only">
        <Link href="/">Home</Link>
        <div className="nav-dropdown-container">
          <Link href="/products">Products & Services</Link>
          <div className="nav-dropdown">
            {categories.map(cat => {
              const slug = cat === 'All' ? '' : cat.toLowerCase().replace(/ /g, '-');
              return (
                <Link key={cat} href={`/products/${slug}`}>{cat}</Link>
              );
            })}
          </div>
        </div>
        <a href="#contact">Contact-Us</a>
        <Link href="/about">About-Us</Link>
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
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Products & Services</Link>
          {categories.filter(c => c !== 'All').map(cat => (
            <Link
              key={cat}
              href={`/products/${cat.toLowerCase().replace(/ /g, '-')}`}
              className="mobile-category-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              - {cat}
            </Link>
          ))}
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
        </div>
      )}
    </nav>
  );
}
