"use client";

import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, X, CheckCircle2, Eye, EyeOff,
  Flower2, Gift, Heart, Sparkles, Crown, Home as HomeIcon,
  PartyPopper, Calendar, Star, Camera, Smile, Cake, Sun, Gem, Palette
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/api';

const AVAILABLE_ICONS = [
  { name: 'Flower2', label: 'Flower', icon: Flower2 },
  { name: 'Gift', label: 'Gift', icon: Gift },
  { name: 'Heart', label: 'Heart', icon: Heart },
  { name: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { name: 'Crown', label: 'Crown', icon: Crown },
  { name: 'Home', label: 'House', icon: HomeIcon },
  { name: 'PartyPopper', label: 'Party', icon: PartyPopper },
  { name: 'Calendar', label: 'Calendar', icon: Calendar },
  { name: 'Star', label: 'Star', icon: Star },
  { name: 'Camera', label: 'Camera', icon: Camera },
  { name: 'Smile', label: 'Smile', icon: Smile },
  { name: 'Cake', label: 'Cake', icon: Cake },
  { name: 'Sun', label: 'Sun', icon: Sun },
  { name: 'Gem', label: 'Jewelry', icon: Gem },
  { name: 'Palette', label: 'Decor Art', icon: Palette },
];

const getIconComponent = (iconName) => {
  const found = AVAILABLE_ICONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  return found ? found.icon : Sparkles;
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    icon: 'Flower2',
    order: 0,
    isActive: true
  });

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/all`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch services');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure local backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggle = async (service) => {
    const updatedStatus = !service.isActive;

    // Optimistic UI update
    setServices(prev => prev.map(s => s._id === service._id ? { ...s, isActive: updatedStatus } : s));

    try {
      const res = await fetch(`${API_BASE_URL}/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${service.title}" visibility updated!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        fetchServices();
        alert(data.error || 'Failed to update visibility');
      }
    } catch (err) {
      fetchServices();
      alert('Error updating service status');
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        title: service.title,
        desc: service.desc,
        icon: service.icon || 'Flower2',
        order: service.order || 0,
        isActive: service.isActive !== false
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        desc: '',
        icon: 'Flower2',
        order: services.length + 1,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `${API_BASE_URL}/services/${editingId}` : `${API_BASE_URL}/services`;
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
        setSuccessMsg(editingId ? 'Service updated successfully!' : 'New service created successfully!');
        setTimeout(() => setSuccessMsg(null), 3500);
        fetchServices();
      } else {
        alert(data.error || 'Failed to save service');
      }
    } catch (err) {
      alert('Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`"${title}" deleted successfully.`);
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchServices();
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (err) {
      alert('Error deleting service');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading Services data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Flower2 size={28} color="#d17875" />
            Manage Services
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Add, edit, reorder or toggle services displayed under "Our Services" on the Home Page.
          </p>
        </div>
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
            fontWeight: 'bold',
            fontSize: '0.95rem'
          }}
        >
          <Plus size={20} /> Add New Service
        </button>
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

      {/* Services Grid (Matching Homepage Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {services.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          const isServiceActive = service.isActive !== false;

          return (
            <div
              key={service._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isServiceActive ? '1px solid #eee' : '1px dashed #ccc',
                opacity: isServiceActive ? 1 : 0.65,
                transition: '0.2s',
                position: 'relative'
              }}
            >
              <div>
                {/* Top Row: Order Badge & Visibility Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', background: '#f5f5f5', color: '#777', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 'bold' }}>
                    Order #{service.order || 0}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    background: isServiceActive ? '#e8f5e9' : '#ffebee',
                    color: isServiceActive ? '#2e7d32' : '#c62828'
                  }}>
                    {isServiceActive ? 'Visible on Home' : 'Hidden'}
                  </span>
                </div>

                {/* Service Icon in soft pink circular badge */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1.25rem auto',
                  background: 'rgba(247, 202, 201, 0.35)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d17875'
                }}>
                  <IconComponent size={28} />
                </div>

                {/* Title & Desc */}
                <h3 style={{
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: '0.75rem',
                  color: '#1a1a1a'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {service.desc}
                </p>
              </div>

              {/* Bottom Actions Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f0f0f0'
              }}>
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggle(service)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                    background: isServiceActive ? '#f0fdf4' : '#fafafa',
                    border: '1px solid',
                    borderColor: isServiceActive ? '#bbf7d0' : '#ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: isServiceActive ? '#166534' : '#777',
                    fontWeight: '600'
                  }}
                >
                  {isServiceActive ? <Eye size={15} /> : <EyeOff size={15} />}
                  {isServiceActive ? 'Hide' : 'Show'}
                </button>

                {/* Edit & Delete */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openModal(service)}
                    style={{
                      padding: '0.5rem',
                      background: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Edit Service"
                  >
                    <Edit2 size={16} color="#555" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id, service.title)}
                    style={{
                      padding: '0.5rem',
                      background: '#fff5f5',
                      border: '1px solid #ffcdd2',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Delete Service"
                  >
                    <Trash2 size={16} color="#c62828" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
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
            maxWidth: '560px',
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
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Customize the service card headline, description, icon and display order.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Service Title *
                </label>
                <input
                  required
                  placeholder="e.g. Wedding Stage Decor"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Service Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Bespoke floral setups and grand stages crafted for your special day."
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Choose Card Icon
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.6rem',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1px solid #eee'
                }}>
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = (formData.icon || '').toLowerCase() === item.name.toLowerCase();

                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.6rem 0.2rem',
                          background: isSelected ? '#d17875' : 'white',
                          color: isSelected ? 'white' : '#555',
                          border: isSelected ? '1px solid #d17875' : '1px solid #ddd',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: '0.15s'
                        }}
                      >
                        <Icon size={20} />
                        <span style={{ fontSize: '0.7rem' }}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="1, 2, 3..."
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <small style={{ color: '#888' }}>Lower numbers will appear first on the page.</small>
              </div>

              {/* Active Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>Show in "Our Services"</span>
                  <small style={{ color: '#666' }}>Toggle this service's appearance on the homepage.</small>
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
                {saving ? 'Saving...' : editingId ? 'Save Service Changes' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
