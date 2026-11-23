"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Award, CheckCircle2, ArrowRight, Image as ImageIcon, Eye, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

export default function AdminShowcase() {
  const [showcases, setShowcases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: 'Perfection in Every Petal.',
    description: 'We source the finest blooms to create masterpieces that leave a lasting impression. Every bouquet is crafted with love and attention to detail.',
    buttonText: 'Browse All Products',
    buttonLink: '/products',
    productName: '',
    productPrice: 0,
    image: '',
    productId: '',
    isActive: true
  });

  const fetchData = async () => {
    try {
      const [showcaseRes, prodRes] = await Promise.all([
        fetch(`${API_BASE_URL}/showcase/all`),
        fetch(`${API_BASE_URL}/products`)
      ]);

      const showcaseData = await showcaseRes.json();
      const prodData = await prodRes.json();

      if (showcaseData.success) {
        setShowcases(showcaseData.data || []);
        setError(null);
      } else {
        setError(showcaseData.error || 'Failed to fetch showcase data');
      }

      if (prodData.success && Array.isArray(prodData.data)) {
        setProducts(prodData.data);
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure local backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData(prev => ({
        ...prev,
        productId: '',
      }));
      return;
    }

    const prod = products.find(p => p._id === selectedId);
    if (prod) {
      setFormData(prev => ({
        ...prev,
        productId: prod._id,
        productName: prod.name,
        productPrice: prod.price,
        image: prod.image || prev.image
      }));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetActive = async (showcase) => {
    try {
      setShowcases(prev => prev.map(s => ({ ...s, isActive: s._id === showcase._id })));

      const res = await fetch(`${API_BASE_URL}/showcase/${showcase._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${showcase.title}" is now active on the Home Page!`);
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        fetchData();
        alert(data.error || 'Failed to update active status');
      }
    } catch (err) {
      fetchData();
      alert('Error updating active showcase');
    }
  };

  const openModal = (showcase = null) => {
    if (showcase) {
      setEditingId(showcase._id);
      setFormData({
        title: showcase.title || '',
        description: showcase.description || '',
        buttonText: showcase.buttonText || 'Browse All Products',
        buttonLink: showcase.buttonLink || '/products',
        productName: showcase.productName || (showcase.productId?.name || ''),
        productPrice: showcase.productPrice || (showcase.productId?.price || 0),
        image: showcase.image || (showcase.productId?.image || ''),
        productId: showcase.productId?._id || showcase.productId || '',
        isActive: showcase.isActive !== false
      });
    } else {
      setEditingId(null);
      const defaultProd = products[0];
      setFormData({
        title: 'Perfection in Every Petal.',
        description: 'We source the finest blooms to create masterpieces that leave a lasting impression. Every bouquet is crafted with love and attention to detail.',
        buttonText: 'Browse All Products',
        buttonLink: '/products',
        productName: defaultProd ? defaultProd.name : 'Handcrafted Luxury Bouquet',
        productPrice: defaultProd ? defaultProd.price : 3500,
        image: defaultProd ? defaultProd.image : '/images/bg.jpg',
        productId: defaultProd ? defaultProd._id : '',
        isActive: showcases.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `${API_BASE_URL}/showcase/${editingId}` : `${API_BASE_URL}/showcase`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const payload = {
        ...formData,
        productPrice: Number(formData.productPrice) || 0,
        productId: formData.productId || null
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setSuccessMsg(editingId ? 'Feature Story updated successfully!' : 'New Feature Story created!');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchData();
      } else {
        alert(data.error || 'Failed to save showcase');
      }
    } catch (err) {
      alert('Error saving feature story');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (showcases.length <= 1) {
      alert('At least one Feature Story section is required for the homepage.');
      return;
    }
    if (!confirm('Are you sure you want to delete this feature story?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/showcase/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Feature Story deleted successfully.');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchData();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting feature story');
    }
  };

  const activeShowcase = showcases.find(s => s.isActive) || showcases[0] || formData;
  const previewImage = activeShowcase.image || activeShowcase.productId?.image || (products[0]?.image || '/images/bg.jpg');
  const previewName = activeShowcase.productName || activeShowcase.productId?.name || (products[0]?.name || 'Featured Product');
  const previewPrice = activeShowcase.productPrice || activeShowcase.productId?.price || (products[0]?.price || '2,500');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading Feature Story data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={28} color="#d17875" />
            Manage Feature Story / Showcase
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Customize the animated scroll section with the featured product card, story headline, description, and button.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => openModal(activeShowcase)}
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
            <Edit2 size={18} /> Edit Current Story
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
            <Plus size={20} /> Add New Story
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
      <div style={{ background: 'white', borderRadius: '15px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} color="#d17875" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Live Homepage Section Preview</h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 'bold' }}>
            ● Active on Homepage
          </span>
        </div>

        {/* Section Mock Preview */}
        <div style={{
          background: '#fff7f7',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          border: '1px solid #fce4ec'
        }}>
          {/* Card Mock on Left */}
          <div style={{
            width: '240px',
            background: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: '1px solid #eee'
          }}>
            <div style={{ height: '220px', background: '#f5f5f5', overflow: 'hidden' }}>
              <img
                src={previewImage}
                alt={previewName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#222' }}>{previewName}</h4>
              <p style={{ margin: '0.3rem 0 0', fontWeight: 'bold', color: '#d17875', fontSize: '1rem' }}>
                Rs. {previewPrice}
              </p>
            </div>
          </div>

          {/* Text Reveal Mock on Right */}
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '500px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              color: '#1a1a1a',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              {activeShowcase.title || 'Perfection in Every Petal.'}
            </h2>
            <p style={{
              color: '#444',
              lineHeight: 1.7,
              fontSize: '0.98rem',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>
              {activeShowcase.description || 'We source the finest blooms to create masterpieces that leave a lasting impression. Every bouquet is crafted with love and attention to detail.'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#d17875',
              color: 'white',
              padding: '0.75rem 1.6rem',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(209, 120, 117, 0.35)'
            }}>
              {activeShowcase.buttonText || 'Browse All Products'} <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Showcases List */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>All Feature Stories ({showcases.length})</h2>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {showcases.map((showcase) => {
            const isActive = showcase.isActive;
            const thumbImage = showcase.image || showcase.productId?.image || '/images/bg.jpg';
            const thumbName = showcase.productName || showcase.productId?.name || 'Default Card';

            return (
              <div
                key={showcase._id}
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
                    width: '85px',
                    height: '85px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f0f0f0',
                    flexShrink: 0
                  }}>
                    <img
                      src={thumbImage}
                      alt={showcase.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{showcase.title}</h3>
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
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, marginBottom: '0.4rem', maxWidth: '650px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {showcase.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem', color: '#888' }}>
                      <span>Card Product: <strong>{thumbName}</strong></span>
                      <span>Button: <strong>{showcase.buttonText}</strong></span>
                      <span>Link: <strong>{showcase.buttonLink}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {!isActive && (
                    <button
                      onClick={() => handleSetActive(showcase)}
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
                    onClick={() => openModal(showcase)}
                    style={{
                      padding: '0.6rem',
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Edit Story"
                  >
                    <Edit2 size={18} color="#555" />
                  </button>

                  <button
                    onClick={() => handleDelete(showcase._id)}
                    style={{
                      padding: '0.6rem',
                      background: '#fff5f5',
                      border: '1px solid #ffcdd2',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Delete Story"
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
            maxWidth: '650px',
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
              {editingId ? 'Edit Feature Story' : 'Create Feature Story'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Update the headline, narrative copy, call-to-action button, and animated product showcase.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Headline */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Section Headline / Title *
                </label>
                <input
                  required
                  placeholder="e.g. Perfection in Every Petal."
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
                  placeholder="e.g. We source the finest blooms to create masterpieces..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                    placeholder="e.g. Browse All Products"
                    value={formData.buttonText}
                    onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Button Target Link
                  </label>
                  <input
                    placeholder="e.g. /products or /products/bouquets"
                    value={formData.buttonLink}
                    onChange={e => setFormData({ ...formData, buttonLink: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              {/* Card Product Selection */}
              <div style={{ background: '#f8f9fa', padding: '1.2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1rem', color: '#333' }}>
                  Animated Showcase Card
                </h4>
                
                {/* Select Existing Product */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Quick Select from Existing Products (Optional)
                  </label>
                  <select
                    value={formData.productId || ''}
                    onChange={handleProductSelect}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                  >
                    <option value="">-- Choose a Product or Enter Custom Below --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Rs. {p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Card Product Name
                    </label>
                    <input
                      placeholder="e.g. Luxury Velvet Rose"
                      value={formData.productName}
                      onChange={e => setFormData({ ...formData, productName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3500"
                      value={formData.productPrice}
                      onChange={e => setFormData({ ...formData, productPrice: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                </div>

                {/* Image Upload for Card */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                    Card Image (Falling Flower / Product Photo)
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1rem',
                      background: 'white',
                      border: '1px solid #ddd',
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
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      style={{ flex: 1, padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                    />
                  </div>
                  {formData.image && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                      <small style={{ color: '#666' }}>Selected Card Preview</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Set as Active Feature Story</span>
                  <small style={{ color: '#666' }}>Make this story visible in the scroll animation on the homepage.</small>
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
                {saving ? 'Saving...' : editingId ? 'Save Story Changes' : 'Create Feature Story'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
