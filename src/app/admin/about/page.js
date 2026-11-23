"use client";

import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, X, CheckCircle2, Phone, MapPin, 
  Upload, Eye, Sparkles, Flower2, PhoneCall 
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

export default function AdminAbout() {
  const [aboutList, setAboutList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "Let's Create Magic",
    description: "At Roose More Floral & Events, we believe every occasion deserves to be beautiful. Whether it's original flowers or stunning artificial setups, we pour our heart into making your event perfect.",
    image: "/images/bike.jpg",
    boxTitle: "Get in Touch",
    phone: "+92 303 4836076",
    whatsapp: "+92 303 4836076",
    address: "Chungi Amar Sidhu, Lahore",
    isActive: true
  });

  const fetchAboutData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/about/all`);
      const data = await res.json();
      if (data.success) {
        setAboutList(data.data || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch about data');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure local backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetActive = async (item) => {
    try {
      setAboutList(prev => prev.map(a => ({ ...a, isActive: a._id === item._id })));

      const res = await fetch(`${API_BASE_URL}/about/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${item.title}" is now active on the Home Page!`);
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        fetchAboutData();
        alert(data.error || 'Failed to update active status');
      }
    } catch (err) {
      fetchAboutData();
      alert('Error updating active about section');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title || "Let's Create Magic",
        description: item.description || '',
        image: item.image || '/images/bike.jpg',
        boxTitle: item.boxTitle || 'Get in Touch',
        phone: item.phone || '+92 303 4836076',
        whatsapp: item.whatsapp || '+92 303 4836076',
        address: item.address || 'Chungi Amar Sidhu, Lahore',
        isActive: item.isActive !== false
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "Let's Create Magic",
        description: "At Roose More Floral & Events, we believe every occasion deserves to be beautiful. Whether it's original flowers or stunning artificial setups, we pour our heart into making your event perfect.",
        image: "/images/bike.jpg",
        boxTitle: "Get in Touch",
        phone: "+92 303 4836076",
        whatsapp: "+92 303 4836076",
        address: "Chungi Amar Sidhu, Lahore",
        isActive: aboutList.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `${API_BASE_URL}/about/${editingId}` : `${API_BASE_URL}/about`;
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
        setSuccessMsg(editingId ? 'About & Contact section updated!' : 'New About & Contact section created!');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchAboutData();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      alert('Error saving about section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (aboutList.length <= 1) {
      alert('At least one About & Contact section is required for the homepage.');
      return;
    }
    if (!confirm('Are you sure you want to delete this About & Contact entry?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/about/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Deleted successfully.');
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchAboutData();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting');
    }
  };

  const activeAbout = aboutList.find(a => a.isActive) || aboutList[0] || formData;
  const whatsappClean = (activeAbout.whatsapp || activeAbout.phone || '').replace(/[^0-9]/g, '');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading About & Contact data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PhoneCall size={28} color="#d17875" />
            Manage About & Contact Section
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Customize the "Let's Create Magic" narrative, WhatsApp phone number, store address, and display photo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => openModal(activeAbout)}
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
            <Edit2 size={18} /> Edit Current Section
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
            <Plus size={20} /> Add New Entry
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

      {/* Live Preview Card */}
      <div style={{ background: 'white', borderRadius: '15px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} color="#d17875" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Live Homepage Section Preview</h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 'bold' }}>
            ● Active on Homepage
          </span>
        </div>

        {/* Section Layout Mock */}
        <div style={{
          background: '#fffbfb',
          borderRadius: '16px',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          border: '1px solid #fce4ec'
        }}>
          {/* Photo on Left */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <img
                src={activeAbout.image || '/images/bike.jpg'}
                alt={activeAbout.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Floating badge with flower icon */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              background: 'white',
              padding: '12px',
              borderRadius: '50%',
              boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flower2 color="#f7cac9" size={32} />
            </div>
          </div>

          {/* Text & Contact Box on Right */}
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.2rem',
              color: '#1a1a1a',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              {activeAbout.title || "Let's Create Magic"}
            </h2>
            <p style={{
              color: '#555',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '1.75rem'
            }}>
              {activeAbout.description}
            </p>

            {/* "Get in Touch" White Card */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              border: '1px solid #eee'
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontFamily: "'Playfair Display', serif", color: '#222' }}>
                {activeAbout.boxTitle || "Get in Touch"}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} color="#2e7d32" />
                </div>
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#222', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}
                >
                  {activeAbout.phone} (WhatsApp)
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="#E1306C" />
                </div>
                <span style={{ color: '#444', fontSize: '0.95rem' }}>
                  {activeAbout.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Entries List */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>All About & Contact Entries ({aboutList.length})</h2>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {aboutList.map((item) => {
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                  <div style={{
                    width: '85px',
                    height: '65px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f0f0f0',
                    flexShrink: 0
                  }}>
                    <img
                      src={item.image || '/images/bike.jpg'}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.title}</h3>
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
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, marginBottom: '0.3rem', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#888' }}>
                      <span>Phone: <strong>{item.phone}</strong></span>
                      <span>Address: <strong>{item.address}</strong></span>
                    </div>
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
                    title="Edit Entry"
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
                    title="Delete Entry"
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
            maxWidth: '600px',
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
              {editingId ? 'Edit About & Contact' : 'Create About & Contact Entry'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Update the section narrative, WhatsApp contact info, store address, and display photo.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Section Headline / Title *
                </label>
                <input
                  required
                  placeholder="e.g. Let's Create Magic"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Story Description / Text *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. At Roose More Floral & Events, we believe every occasion deserves to be beautiful..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Showcase Display Photo
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.7rem 1.2rem',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    <Upload size={16} /> Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>OR</span>
                  <input
                    placeholder="Image URL (e.g. /images/bike.jpg)"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                {formData.image && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>
                )}
              </div>

              {/* Contact Card Details */}
              <div style={{ background: '#f8f9fa', padding: '1.2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#333' }}>
                  "Get in Touch" Box Details
                </h4>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Card Box Heading
                  </label>
                  <input
                    placeholder="e.g. Get in Touch"
                    value={formData.boxTitle}
                    onChange={e => setFormData({ ...formData, boxTitle: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      placeholder="e.g. +92 303 4836076"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Store Location / Address
                    </label>
                    <input
                      placeholder="e.g. Chungi Amar Sidhu, Lahore"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                </div>
              </div>

              {/* Set Active Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Set as Active on Homepage</span>
                  <small style={{ color: '#666' }}>Show this About & Contact information on the homepage.</small>
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
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create About Section'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
