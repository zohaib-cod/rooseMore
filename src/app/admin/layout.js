"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Layers, Sparkles } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Sections', href: '/admin/sections', icon: Layers },
    { name: 'Hero Banner', href: '/admin/hero', icon: Sparkles },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'white', boxShadow: '2px 0 10px rgba(0,0,0,0.05)', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#d17875', fontSize: '1.5rem' }}>Roose More</h2>
          <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>ADMIN PANEL</p>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: '600', transition: '0.2s',
                background: isActive ? '#fff5f5' : 'transparent',
                color: isActive ? '#d17875' : '#666'
              }}>
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0 2rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#666', textDecoration: 'none', fontWeight: '600' }}>
            <LogOut size={20} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
