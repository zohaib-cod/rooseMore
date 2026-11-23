"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, CheckCircle2, ArrowRight, Image as ImageIcon, Eye, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

export default function AdminHero() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Elevate Your Moments',
    subtitle: 'Premium Floral & Event Decoration in Lahore',
    buttonText: 'Shop Products',
    buttonLink: '/products',
    backgroundImage: '/images/bg.jpg',
    isActive: true
  });

  const fetchHeroes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hero/all`);
      const data = await res.json();
      if (data.success) {
        setHeroes(data.data || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to load hero banner data');
      }
    } catch (err) {
      setError('Could not connect to backend to fetch hero banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, backgroundImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetActive = async (hero) => {
    try {
      // Optimistic update
      setHeroes(prev => prev.map(h => ({ ...h, isActive: h._id === hero._id })));

      const res = await fetch(`${API_BASE_URL}/hero/${hero._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${hero.title}" is now active on the Home Page!`);
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        fetchHeroes();
        alert(data.error || 'Failed to update active status');
      }
    } catch (err) {
      fetchHeroes();
      alert('Error updating active banner');
    }
  };

  const openModal = (hero = null) => {
    if (hero) {
      setEditingId(hero._id);
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        buttonText: hero.buttonText || 'Shop Products',
        buttonLink: hero.buttonLink || '/products',
        backgroundImage: hero.backgroundImage || '/images/bg.jpg',
        isActive: hero.isActive !== false
      });
    } else {
      setEditingId(null);
      setFormData({
        title: 'Elevate Your Moments',
        subtitle: 'Premium Floral & Event Decoration in Lahore',
        buttonText: 'Shop Products',
        buttonLink: '/products',
        backgroundImage: '/images/bg.jpg',
        isActive: heroes.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `${API_BASE_URL}/hero/${editingId}` : `${API_BASE_URL}/hero`;
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
        setSuccessMsg(editingId ? 'Hero banner updated successfully!' : 'New hero banner created!');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchHeroes();
      } else {
        alert(data.error || 'Failed to save hero banner');
      }
    } catch (err) {
      alert('Error saving hero banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, isActive) => {
    if (heroes.length <= 1) {
      alert('At least one hero banner is required for the store homepage.');
      return;
    }
    if (!confirm('Are you sure you want to delete this hero banner?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/hero/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Hero banner deleted successfully.');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchHeroes();
      } else {
        alert(data.error || 'Failed to delete hero banner');
      }
    } catch (err) {
      alert('Error deleting hero banner');
    }
  };

  const activeHero = heroes.find(h => h.isActive) || heroes[0] || formData;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading Hero Section data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={28} color="#d17875" />
            Manage Hero Section
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Customize the main banner text, call-to-action button, and background image displayed at the top of your homepage.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => openModal(activeHero)}
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
            <Edit2 size={18} /> Edit Current Banner
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
            <Plus size={20} /> Add New Banner
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
      <div style={{ background: 'white', borderRadius: '15px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} color="#d17875" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Live Homepage Preview</h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 'bold' }}>
            ● Active on Homepage
          </span>
        </div>

        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          backgroundImage: `url(${activeHero.backgroundImage || '/images/bg.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #eee'
        }}>
          {/* Soft overlay matching main website */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.4rem',
              color: '#1a1a1a',
              marginBottom: '0.75rem',
              lineHeight: 1.2
            }}>
              {activeHero.title || 'Elevate Your Moments'}
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#555',
              marginBottom: '1.5rem'
            }}>
              {activeHero.subtitle || 'Premium Floral & Event Decoration in Lahore'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#d17875',
              color: 'white',
              padding: '0.75rem 1.75rem',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(209, 120, 117, 0.4)'
            }}>
              {activeHero.buttonText || 'Shop Products'} <ArrowRight size={18} />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <small style={{ color: '#777', fontSize: '0.8rem' }}>Target URL: {activeHero.buttonLink || '/products'}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banners List */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>All Hero Banners ({heroes.length})</h2>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {heroes.map((hero) => {
            const isActive = hero.isActive;

            return (
              <div
                key={hero._id}
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
                {/* Image and Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                  <div style={{
                    width: '100px',
                    height: '65px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f0f0f0',
                    flexShrink: 0
                  }}>
                    <img
                      src={hero.backgroundImage || '/images/bg.jpg'}
                      alt={hero.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{hero.title}</h3>
                      {isActive ? (
                        <span style={{ fontSize: '0.75rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.5rem', borderRadius: '12px', fontWeight: 'bold' }}>
                          Active Banner
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', background: '#f5f5f5', color: '#888', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                          Draft
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, marginBottom: '0.35rem' }}>
                      {hero.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#888' }}>
                      <span>Button: <strong>{hero.buttonText}</strong></span>
                      <span>Link: <strong>{hero.buttonLink}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {!isActive && (
                    <button
                      onClick={() => handleSetActive(hero)}
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
                    onClick={() => openModal(hero)}
                    style={{
                      padding: '0.6rem',
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Edit Banner"
                  >
                    <Edit2 size={18} color="#555" />
                  </button>

                  <button
                    onClick={() => handleDelete(hero._id, hero.isActive)}
                    style={{
                      padding: '0.6rem',
                      background: '#fff5f5',
                      border: '1px solid #ffcdd2',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Delete Banner"
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
              {editingId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Update text headlines, button link, and background banner image.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Title Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Hero Headline / Title *
                </label>
                <input
                  required
                  placeholder="e.g. Elevate Your Moments"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {/* Subtitle Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Subtitle / Tagline
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Premium Floral & Event Decoration in Lahore"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                />
              </div>

              {/* Button Text & Button Link */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Button Text
                  </label>
                  <input
                    placeholder="e.g. Shop Products"
                    value={formData.buttonText}
                    onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Button Link / URL
                  </label>
                  <input
                    placeholder="e.g. /products or /products/bouquets"
                    value={formData.buttonLink}
                    onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              {/* Background Image Upload & Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Hero Background Image
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
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
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>OR</span>
                  <input
                    placeholder="Paste image URL (e.g. /images/bg.jpg)"
                    value={formData.backgroundImage}
                    onChange={e => setFormData({ ...formData, backgroundImage: e.target.value })}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>

                {formData.backgroundImage && (
                  <div style={{ marginTop: '0.5rem', position: 'relative', width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img
                      src={formData.backgroundImage}
                      alt="Banner Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{ position: 'absolute', bottom: '6px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      Image Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Set Active Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Set as Active Banner</span>
                  <small style={{ color: '#666' }}>Make this banner visible on the homepage right now.</small>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              {/* Submit Button */}
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
                {saving ? 'Saving...' : editingId ? 'Save Banner Changes' : 'Create Hero Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
