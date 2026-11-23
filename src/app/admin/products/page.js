"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Package, Download } from 'lucide-react';
import { categories as defaultCategories, products as defaultProducts } from '../../../data/products';
import { API_BASE_URL } from '../../../config/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'Bouquets', image: '', description: '' });

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

  const loadData = async () => {
    try {
      const [prodRes, secRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/sections`)
      ]);
      const prodData = await prodRes.json();
      const secData = await secRes.json();

      if (prodData.success) {
        setProducts(prodData.data);
        setError(null);
      } else {
        setError(prodData.error);
      }

      if (secData.success && Array.isArray(secData.data) && secData.data.length > 0) {
        setSections(secData.data);
        if (!formData.category && secData.data.length > 0) {
          setFormData(prev => ({ ...prev, category: secData.data[0].name }));
        }
      }
    } catch (err) {
      setError('Failed to fetch data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableCategories = sections.length > 0
    ? sections.map(s => s.name)
    : defaultCategories.filter(c => c !== 'All');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_BASE_URL}/products/${editingId}` : `${API_BASE_URL}/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("This will load the initial default products into the database. Continue?")) return;
    setIsSeeding(true);
    try {
      for (const p of defaultProducts) {
        await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            description: p.description
          })
        });
      }
      await loadData();
      alert("Default products loaded into database successfully!");
    } catch (err) {
      alert("Error saving products to database");
    } finally {
      setIsSeeding(false);
    }
  };

  const openModal = (product = null) => {
    const defaultCat = availableCategories[0] || 'Bouquets';
    if (product) {
      setEditingId(product._id);
      setFormData({ 
        name: product.name, 
        price: product.price, 
        category: product.category || defaultCat, 
        image: product.image, 
        description: product.description 
      });
    } else {
      setEditingId(null);
      setFormData({ 
        name: '', 
        price: '', 
        category: defaultCat, 
        image: '', 
        description: '' 
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading Products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Manage Products</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleSeedDefaults} 
            disabled={isSeeding}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#333', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', cursor: isSeeding ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            <Download size={18} /> {isSeeding ? 'Importing...' : 'Import Default Products'}
          </button>
          <button 
            onClick={() => openModal()} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#d17875', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      {error ? (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '2rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Notice</h3>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '15px' }}>
          <Package size={50} color="#ddd" style={{ marginBottom: '1rem' }} />
          <h3>No products in database yet</h3>
          <p style={{ color: '#666', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Click "Add Product" to create a new product, or "Import Default Products" to load the initial catalogue.</p>
          <button 
            onClick={handleSeedDefaults} 
            disabled={isSeeding}
            style={{ background: '#d17875', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: isSeeding ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {isSeeding ? 'Importing...' : 'Load Default Products'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {products.map(product => (
            <div key={product._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={product.image || '/images/bg.jpg'} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{product.category}</p>
                  <p style={{ fontWeight: 'bold', color: '#d17875' }}>Rs. {product.price}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => openModal(product)} style={{ padding: '0.5rem', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}><Edit2 size={18} color="#555" /></button>
                <button onClick={() => handleDelete(product._id)} style={{ padding: '0.5rem', background: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={18} color="#c62828" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', width: '90%', maxWidth: '500px', borderRadius: '15px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input required type="number" placeholder="Price (Rs.)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Assign to Section / Category
                </label>
                <select 
                  required 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                >
                  {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                  <span style={{ color: '#999', fontSize: '0.9rem' }}>OR</span>
                  <input placeholder="Paste Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                {formData.image && (
                  <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem' }} />
                )}
              </div>
              <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}></textarea>
              
              <button type="submit" style={{ padding: '1rem', background: '#d17875', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}>
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
