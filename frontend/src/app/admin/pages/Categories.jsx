import { useState, useEffect } from 'react';
import { getAdminCategories, createAdminCategory, deleteAdminCategory } from '../../../services/admin-api';
import { Trash2, Plus, X } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'job' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAdminCategories();
      setCategories(res.data.data || []);
    } catch { setCategories([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setForm({ name: '', type: 'job' }); setError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await createAdminCategory(form);
      closeModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteAdminCategory(id);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Categories</h1>
        <button onClick={openAdd} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-screen" style={{ height: '200px' }}><div className="spinner"></div></div>
        ) : (
          <table>
            <thead><tr>
              <th>Name</th><th>Type</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{cat.type}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(cat._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray)', padding: '3rem' }}>No categories found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Add Category</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Railway" />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-input" name="type" value={form.type} onChange={handleChange} required>
                  <option value="job">Job</option>
                  <option value="result">Result</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="scheme">Scheme</option>
                  <option value="news">News</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }} disabled={saving}>
                {saving ? 'Saving...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
