"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { X, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CartSidebar() {
  const pathname = usePathname();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    let message = "Hi Roose More! I want to order the following items:%0a%0a";
    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - Rs. ${item.price * item.quantity}%0a`;
    });
    message += `%0aTotal: Rs. ${cartTotal}`;
    window.open(`https://wa.me/923034836076?text=${message}`, '_blank');
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Roose More Floral & Events - Receipt", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Customer Name: ${formData.name}`, 14, 32);
    doc.text(`Phone: ${formData.phone}`, 14, 40);
    doc.text(`Address: ${formData.address}`, 14, 48);
    
    const tableColumn = ["Image", "Product", "Price", "Qty", "Total"];
    const tableRows = [];
    const loadedImages = [];

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    for (const item of cart) {
      const img = await loadImage(item.image);
      loadedImages.push(img);
      
      tableRows.push([
        "", // Empty space for the image
        item.name,
        `Rs. ${item.price}`,
        item.quantity,
        `Rs. ${item.price * item.quantity}`
      ]);
    }

    autoTable(doc, {
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      bodyStyles: { minCellHeight: 20 },
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.cell.section === 'body') {
          const img = loadedImages[data.row.index];
          if (img) {
            // Add image at x, y, width, height
            doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 16, 16);
          }
        }
      }
    });
    
    const finalY = doc.lastAutoTable.finalY || 55;
    doc.setFontSize(14);
    doc.text(`Total Amount: Rs. ${cartTotal}`, 14, finalY + 15);
    
    doc.save(`Receipt_Roose_More.pdf`);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      items: cart.map(item => ({
        productId: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: cartTotal
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        alert('Failed to place order: ' + data.error);
        setLoading(false);
      }
    } catch (err) {
      alert('Error saving order.');
      setLoading(false);
    } 
  };

  const finishCheckout = () => {
    clearCart();
    setIsCartOpen(false);
    setSuccess(false);
    setIsCheckingOut(false);
    setFormData({ name: '', phone: '', address: '' });
  };


  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="cart-overlay"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-sidebar"
          >
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="close-btn"><X /></button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="price">Rs. {item.price}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && !isCheckingOut && !success && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
                  <button onClick={handleCheckout} className="btn-website">
                    Order via Website
                  </button>
                  <button onClick={handleWhatsAppCheckout} className="btn-whatsapp">
                    <MessageCircle size={20} />
                    Order via WhatsApp
                  </button>
                </div>
              </div>
            )}

            {isCheckingOut && !success && (
              <div className="cart-footer checkout-form-container" style={{ background: '#fcfcfc', borderTop: '2px solid #eee' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Delivery Details</h3>
                <form onSubmit={submitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <textarea required placeholder="Full Delivery Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}></textarea>
                  
                  <div className="cart-total" style={{ marginTop: '0.5rem' }}>
                    <span>Total Amount:</span>
                    <span>Rs. {cartTotal}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => setIsCheckingOut(false)} style={{ flex: 1, padding: '1rem', border: 'none', background: '#eee', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    <button type="submit" disabled={loading} style={{ flex: 2, padding: '1rem', border: 'none', background: '#d17875', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {success && (
              <div className="cart-footer" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '60px', height: '60px', background: '#d4edda', color: '#155724', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '2rem' }}>✓</div>
                <h3 style={{ color: '#155724', marginBottom: '0.5rem' }}>Order Placed Successfully!</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>We will contact you shortly to confirm your order.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={generatePDF} style={{ padding: '1rem', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Download PDF Receipt
                  </button>
                  <button onClick={finishCheckout} style={{ padding: '1rem', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
