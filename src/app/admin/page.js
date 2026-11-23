"use client";

import { useEffect, useState } from 'react';
import { ShoppingBag, Package, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`)
        ]);
        
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        let revenue = 0;
        let ordersCount = 0;
        let productsCount = 0;

        if (ordersData.success) {
          ordersCount = ordersData.data.length;
          revenue = ordersData.data.reduce((sum, order) => sum + order.totalAmount, 0);
        }
        if (productsData.success) {
          productsCount = productsData.data.length;
        }

        setStats({ totalOrders: ordersCount, totalProducts: productsCount, totalRevenue: revenue });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#4CAF50' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: '#2196F3' },
    { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#FF9800' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <Icon size={30} />
              </div>
              <div>
                <p style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '2rem', color: '#333' }}>{stat.value}</h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
