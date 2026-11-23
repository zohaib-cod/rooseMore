"use client";

import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, X, CheckCircle2, Eye, PanelBottom,
  Phone, MapPin, Globe, Share2
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

export default function AdminFooter() {
  const [footers, setFooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    brandName: 'Roose More Floral & Events',
    tagline: 'Premium Floral & Event Decoration in Lahore',
    copyrightText: 'Roose More. All rights reserved.',
    showYear: true,
    phone: '+92 303 4836076',
    whatsapp: '+92 303 4836076',
    address: 'Chungi Amar Sidhu, Lahore',
    instagram: '',
    facebook: '',
    isActive: true
  });

  const fetchFooters = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/footer/all`);
      const data = await res.json();
      if (data.success) {
        setFooters(data.data || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch footer data');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure local backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooters();
  }, []);

  const handleSetActive = async (item) => {
    try {
      setFooters(prev => prev.map(f => ({ ...f, isActive: f._id === item._id })));

      const res = await fetch(`${API_BASE_URL}/footer/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${item.brandName}" footer is now active on the store!`);
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        fetchFooters();
        alert(data.error || 'Failed to update active footer');
      }
    } catch (err) {
      fetchFooters();
      alert('Error updating active footer');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        brandName: item.brandName || 'Roose More Floral & Events',
        tagline: item.tagline || '',
        copyrightText: item.copyrightText || 'Roose More. All rights reserved.',
        showYear: item.showYear !== false,
        phone: item.phone || '+92 303 4836076',
        whatsapp: item.whatsapp || '+92 303 4836076',
        address: item.address || 'Chungi Amar Sidhu, Lahore',
        instagram: item.instagram || '',
        facebook: item.facebook || '',
        isActive: item.isActive !== false
      });
    } else {
      setEditingId(null);
      setFormData({
        brandName: 'Roose More Floral & Events',
        tagline: 'Premium Floral & Event Decoration in Lahore',
        copyrightText: 'Roose More. All rights reserved.',
        showYear: true,
        phone: '+92 303 4836076',
        whatsapp: '+92 303 4836076',
        address: 'Chungi Amar Sidhu, Lahore',
        instagram: '',
        facebook: '',
        isActive: footers.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `${API_BASE_URL}/footer/${editingId}` : `${API_BASE_URL}/footer`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setSuccessMsg(editingId ? 'Footer settings updated!' : 'New footer settings created!');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchFooters();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      alert('Error saving footer settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (footers.length <= 1) {
      alert('At least one footer setup is required.');
      return;
    }
    if (!confirm('Are you sure you want to delete this footer setup?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/footer/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Footer setup deleted.');
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchFooters();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting footer setup');
    }
  };

  const activeFooter = footers.find(f => f.isActive) || footers[0] || formData;
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading Footer Settings...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PanelBottom size={28} color="#d17875" />
            Manage Footer Section
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Customize the brand headline, copyright line, contact details, and social links displayed at the bottom of the store.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => openModal(activeFooter)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f8f9fa',
              color: '#333',
              border: '1px solid #ddd',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <Edit2 size={18} /> Edit Current Footer
          </button>
          <button
            onClick={() => openModal(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#d17875',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            <Plus size={20} /> Add New Footer Setup
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', color: '#2e7d32', padding: '1rem 1.5rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Live Dark Preview Card */}
      <div style={{ background: 'white', borderRadius: '15px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} color="#d17875" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Live Store Footer Preview</h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 'bold' }}>
            ● Active on Website
          </span>
        </div>

        {/* Dark Footer Preview Container */}
        <div style={{
          background: '#0d0d18',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>
          {/* Gradient Brand Name */}
          <h2 style={{
            fontSize: '1.9rem',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #f7cac9, #b5e7a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            {activeFooter.brandName || 'Roose More Floral & Events'}
          </h2>

          {activeFooter.tagline && (
            <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {activeFooter.tagline}
            </p>
          )}

          {/* Contact Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', margin: '1rem 0 1.5rem 0', color: '#bbb', fontSize: '0.85rem' }}>
            {activeFooter.phone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="#f7cac9" /> {activeFooter.phone}
              </span>
            )}
            {activeFooter.address && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="#b5e7a0" /> {activeFooter.address}
              </span>
            )}
            {activeFooter.instagram && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Share2 size={14} color="#f7cac9" /> Instagram
              </span>
            )}
            {activeFooter.facebook && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={14} color="#b5e7a0" /> Facebook
              </span>
            )}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', maxWidth: '400px', margin: '1rem auto' }} />

          {/* Copyright Notice */}
          <p style={{ opacity: 0.7, fontSize: '0.88rem', margin: 0, color: '#aaa' }}>
            {activeFooter.showYear !== false ? `© ${currentYear} ` : ''}
            {activeFooter.copyrightText || 'Roose More. All rights reserved.'}
          </p>
        </div>
      </div>

      {/* Footer Setups List */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>All Footer Configurations ({footers.length})</h2>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {footers.map((item) => {
            const isActive = item.isActive;

            return (
              <div
                key={item._id}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isActive ? '2px solid #d17875' : '1px solid transparent',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.brandName}</h3>
                    {isActive ? (
                      <span style={{ fontSize: '0.75rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 'bold' }}>
                        Active on Website
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', background: '#f5f5f5', color: '#888', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                        Draft
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, marginBottom: '0.35rem' }}>
                    {item.showYear !== false ? `© ${currentYear} ` : ''}{item.copyrightText}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#888' }}>
                    <span>Phone: <strong>{item.phone || 'N/A'}</strong></span>
                    <span>Address: <strong>{item.address || 'N/A'}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {!isActive && (
                    <button
                      onClick={() => handleSetActive(item)}
                      style={{
                        padding: '0.55rem 1rem',
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        border: '1px solid #c8e6c9',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}
                    >
                      Set as Active
                    </button>
                  )}

                  <button
                    onClick={() => openModal(item)}
                    style={{
                      padding: '0.6rem',
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Edit Settings"
                  >
                    <Edit2 size={18} color="#555" />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding: '0.6rem',
                      background: '#fff5f5',
                      border: '1px solid #ffcdd2',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={18} color="#c62828" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '620px',
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
              {editingId ? 'Edit Footer Settings' : 'Create Footer Settings'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Customize the brand name, copyright notice, and contact/social links.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Brand Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Footer Brand Title *
                </label>
                <input
                  required
                  placeholder="e.g. Roose More Floral & Events"
                  value={formData.brandName}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {/* Tagline */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Tagline / Subtitle
                </label>
                <input
                  placeholder="e.g. Premium Floral & Event Decoration in Lahore"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {/* Copyright Text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Copyright Notice *
                </label>
                <input
                  required
                  placeholder="e.g. Roose More. All rights reserved."
                  value={formData.copyrightText}
                  onChange={e => setFormData({ ...formData, copyrightText: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {/* Include Year Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.9rem' }}>Automatically Include Current Year</span>
                  <small style={{ color: '#666' }}>Displays "© {currentYear}" before the copyright text.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showYear}
                  onChange={e => setFormData({ ...formData, showYear: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              {/* Contact & Social Links */}
              <div style={{ background: '#f8f9fa', padding: '1.2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#333' }}>
                  Contact & Social Media Links (Optional)
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Phone / WhatsApp
                    </label>
                    <input
                      placeholder="+92 303 4836076"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Store Address / City
                    </label>
                    <input
                      placeholder="Chungi Amar Sidhu, Lahore"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Instagram URL
                    </label>
                    <input
                      placeholder="https://instagram.com/..."
                      value={formData.instagram}
                      onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Facebook URL
                    </label>
                    <input
                      placeholder="https://facebook.com/..."
                      value={formData.facebook}
                      onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                </div>
              </div>

              {/* Set Active Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Set as Active Footer</span>
                  <small style={{ color: '#666' }}>Show this footer across the store website.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '1rem',
                  background: saving ? '#aaa' : '#d17875',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  marginTop: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                {saving ? 'Saving...' : editingId ? 'Save Footer Changes' : 'Create Footer Setup'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
