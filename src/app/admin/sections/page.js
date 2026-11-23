"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Layers, ExternalLink, Eye, EyeOff, Image as ImageIcon, Compass } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '../../../config/api';

export default function AdminSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    description: '', 
    image: '', 
    showOnHome: true, 
    showInNav: true,
    order: 0 
  });

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sections`);
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch sections from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
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

  const handleToggle = async (section, field) => {
    const currentValue = section[field] !== false;
    const updatedStatus = !currentValue;
    
    // Optimistic UI update
    setSections(prev => prev.map(s => s._id === section._id ? { ...s, [field]: updatedStatus } : s));
    
    try {
      const res = await fetch(`${API_BASE_URL}/sections/${section._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: updatedStatus })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on error
        setSections(prev => prev.map(s => s._id === section._id ? section : s));
        alert('Failed to update: ' + data.error);
      }
    } catch (err) {
      setSections(prev => prev.map(s => s._id === section._id ? section : s));
      alert('Error updating visibility');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_BASE_URL}/sections/${editingId}` : `${API_BASE_URL}/sections`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchSections();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error saving section");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this section? Products assigned to it may need to be updated.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/sections/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchSections();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error deleting section");
    }
  };

  const openModal = (section = null) => {
    if (section) {
      setEditingId(section._id);
      setFormData({
        name: section.name,
        slug: section.slug,
        description: section.description || '',
        image: section.image || '',
        showOnHome: section.showOnHome !== false,
        showInNav: section.showInNav !== false,
        order: section.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        showOnHome: true,
        showInNav: true,
        order: sections.length + 1
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading Sections...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Manage Sections & Categories</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Control where each section appears: on the Home Page and in the Navbar Menu.
          </p>
        </div>
        <button 
          onClick={() => openModal()} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#d17875', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <Plus size={20} /> Add New Section
        </button>
      </div>

      {error ? (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '2rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Error Loading Sections</h3>
          <p>{error}</p>
        </div>
      ) : sections.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '15px' }}>
          <Layers size={50} color="#ddd" style={{ marginBottom: '1rem' }} />
          <h3>No sections created yet</h3>
          <p style={{ color: '#666', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Create your first store section to organize products.</p>
          <button 
            onClick={() => openModal()} 
            style={{ background: '#d17875', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Create Section
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {sections.map(section => {
            const isHomeOn = section.showOnHome !== false;
            const isNavOn = section.showInNav !== false && section.showOnHome !== false;

            return (
              <div 
                key={section._id} 
                style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '15px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '12px', background: '#f5f5f5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {section.image ? (
                      <img src={section.image} alt={section.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={30} color="#bbb" />
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{section.name}</h3>
                      <Link 
                        href={`/products/${section.slug}`} 
                        target="_blank"
                        style={{ fontSize: '0.8rem', color: '#0969da', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', background: '#eef3fb', padding: '0.2rem 0.5rem', borderRadius: '6px' }}
                      >
                        /products/{section.slug} <ExternalLink size={12} />
                      </Link>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {section.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {/* Home Page Toggle Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8f9fa', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #eee' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isHomeOn ? '#2e7d32' : '#888', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {isHomeOn ? <Eye size={16} /> : <EyeOff size={16} />}
                      {isHomeOn ? 'Home: Visible' : 'Home: Hidden'}
                    </span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={isHomeOn} 
                        onChange={() => handleToggle(section, 'showOnHome')}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: isHomeOn ? '#4caf50' : '#ccc',
                        borderRadius: '24px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: isHomeOn ? '22px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Navbar Menu Toggle Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8f9fa', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #eee' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isNavOn ? '#1565c0' : '#888', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Compass size={16} />
                      {isNavOn ? 'Navbar: Visible' : 'Navbar: Hidden'}
                    </span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={isNavOn} 
                        onChange={() => handleToggle(section, 'showInNav')}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: isNavOn ? '#2196f3' : '#ccc',
                        borderRadius: '24px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: isNavOn ? '22px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Edit & Delete actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openModal(section)} 
                      style={{ padding: '0.6rem', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}
                      title="Edit Section"
                    >
                      <Edit2 size={18} color="#555" />
                    </button>
                    <button 
                      onClick={() => handleDelete(section._id)} 
                      style={{ padding: '0.6rem', background: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: '8px', cursor: 'pointer' }}
                      title="Delete Section"
                    >
                      <Trash2 size={18} color="#c62828" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '520px', borderRadius: '15px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Section' : 'Add New Section'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Section / Category Name *
                </label>
                <input 
                  required 
                  placeholder="e.g. Wedding Decor, Gift Boxes, Bouquets" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Route Slug (URL path)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', padding: '0 0.8rem' }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>/products/</span>
                  <input 
                    placeholder="auto-generated-if-empty" 
                    value={formData.slug} 
                    onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                    style={{ flex: 1, padding: '0.8rem 0.4rem', border: 'none', background: 'transparent', outline: 'none' }} 
                  />
                </div>
                <small style={{ color: '#888' }}>This will be the live URL for this section's dedicated page.</small>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea 
                  placeholder="Short description of this section..." 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '70px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Cover Image (Optional)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>OR</span>
                  <input 
                    placeholder="Paste Image URL" 
                    value={formData.image} 
                    onChange={e => setFormData({ ...formData, image: e.target.value })} 
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} 
                  />
                </div>
                {formData.image && (
                  <img src={formData.image} alt="Preview" style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem' }} />
                )}
              </div>

              {/* Show on Home Page Option */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Show on Home Page</span>
                  <small style={{ color: '#666' }}>Display this section under "Shop by Category" on Home page.</small>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.showOnHome} 
                  onChange={e => setFormData({ ...formData, showOnHome: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              {/* Show in Navbar Menu Option */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Show in Navbar Dropdown</span>
                  <small style={{ color: '#666' }}>Include this section link in the "Products & Services" header menu.</small>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.showInNav} 
                  onChange={e => setFormData({ ...formData, showInNav: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <button 
                type="submit" 
                style={{ padding: '1rem', background: '#d17875', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '1rem' }}
              >
                {editingId ? 'Save Changes' : 'Create Section & Generate Page'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
