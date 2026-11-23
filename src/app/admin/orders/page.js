"use client";

import { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch orders. Ensure MongoDB is connected.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? data.data : o));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div>Loading Orders...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Manage Orders</h1>

      {error ? (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '2rem', borderRadius: '10px' }}>
          <h3>Database Connection Error</h3>
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '15px' }}>No orders found yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>{order.customerName}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{order.phone} | {order.address}</p>
                  <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ 
                      display: 'inline-block', padding: '0.5rem 1rem', marginBottom: '0.5rem',
                      background: order.status === 'Pending' ? '#fff3cd' : order.status === 'Confirmed' ? '#cce5ff' : order.status === 'Delivered' ? '#d4edda' : '#f8d7da',
                      color: order.status === 'Pending' ? '#856404' : order.status === 'Confirmed' ? '#004085' : order.status === 'Delivered' ? '#155724' : '#721c24',
                      borderRadius: '8px', fontWeight: 'bold', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <h3 style={{ fontSize: '1.5rem', color: '#d17875' }}>Rs. {order.totalAmount}</h3>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#555' }}>Items:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {order.items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed #eee' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
